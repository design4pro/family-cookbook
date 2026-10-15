import { env } from "cloudflare:workers";
import { expect, test } from "vitest";
import { createHousehold, inviteMember, acceptInvitation, removeMember, getHousehold } from "../../src/households/membership";
import { grantHandoverReauthentication, requestHandover, cancelHandover, acceptHandover, claimAdministration } from "../../src/households/handover";

async function fixture() {
  for (const id of ["owner", "a", "b", "outsider"]) await env.DB.prepare('INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES (?, ?, ?, 1, 0, 0)').bind(id, id, `${id}@example.test`).run();
  const id = (await createHousehold(env.DB, "owner"))!;
  for (const member of ["a", "b"]) await acceptInvitation(env.DB, member, (await inviteMember(env.DB, "owner", id, `${member}@example.test`))!.token);
  await env.DB.prepare('INSERT INTO session (id, token, userId, expiresAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, 0, 0)').bind("session", "token", "owner", Date.now() + 3600000).run();
  return id;
}
async function nominate(id: string, recipient = "a", now = Date.now()) {
  expect(await grantHandoverReauthentication(env.DB, "owner", "session", id, now)).toBe(true);
  return (await requestHandover(env.DB, "owner", "session", id, recipient, now))!;
}

test("handover requires a fresh session-bound proof, nominates one member and only switches on acceptance", async () => {
  const id = await fixture();
  expect(await requestHandover(env.DB, "owner", "session", id, "a")).toBeNull();
  await grantHandoverReauthentication(env.DB, "owner", "session", id, 100);
  expect(await requestHandover(env.DB, "owner", "session", id, "a", 300100)).toBeNull();
  const pending = await nominate(id);
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_reauthentication").first("n")).toBe(0);
  expect(await requestHandover(env.DB, "owner", "session", id, "b")).toBeNull();
  expect((await getHousehold(env.DB, "owner"))!.administratorId).toBe("owner");
  expect(await acceptHandover(env.DB, "b", id, pending.id)).toBe(false);
  expect(await acceptHandover(env.DB, "a", id, pending.id)).toBe(true);
  const household = (await getHousehold(env.DB, "owner"))!;
  expect(household.administratorId).toBe("a");
  expect(household.payerId).toBe("owner");
  expect(household.members.map(member => member.id).sort()).toEqual(["a", "b", "owner"]);
  expect(await acceptHandover(env.DB, "a", id, pending.id)).toBe(false);
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_notifications WHERE kind = 'administrator_changed'").first("n")).toBe(3);
});

test("only one competing nomination wins; no self, outsider, other household or unverified recipient", async () => {
  const id = await fixture();
  expect(await grantHandoverReauthentication(env.DB, "a", "session", id)).toBe(false);
  await grantHandoverReauthentication(env.DB, "owner", "session", id);
  for (const recipient of ["owner", "outsider"]) expect(await requestHandover(env.DB, "owner", "session", id, recipient)).toBeNull();
  await env.DB.prepare("UPDATE user SET emailVerified = 0 WHERE id = 'a'").run();
  expect(await requestHandover(env.DB, "owner", "session", id, "a")).toBeNull();
  await env.DB.prepare("UPDATE user SET emailVerified = 1 WHERE id = 'a'").run();
  const results = await Promise.all(["a", "b"].map(member => requestHandover(env.DB, "owner", "session", id, member)));
  expect(results.filter(Boolean)).toHaveLength(1);
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_handovers").first("n")).toBe(1);
});

test("cancellation and exact expiry prevent acceptance, while expired requests allow a fresh nomination", async () => {
  const id = await fixture();
  const canceled = await nominate(id);
  expect(await cancelHandover(env.DB, "a", id, canceled.id)).toBe(false);
  expect(await cancelHandover(env.DB, "owner", id, canceled.id)).toBe(true);
  expect(await acceptHandover(env.DB, "a", id, canceled.id)).toBe(false);
  const expired = await nominate(id, "a", 100);
  expect(await acceptHandover(env.DB, "a", id, expired.id, expired.expiresAt)).toBe(false);
  const fresh = await nominate(id, "b", expired.expiresAt);
  expect(fresh).not.toBeNull();
  expect(await acceptHandover(env.DB, "b", id, fresh.id, expired.expiresAt + 1)).toBe(true);
});

test.each(["leave", "remove", "delete"])("recipient %s invalidates the request, including after rejoining", async mode => {
  const id = await fixture();
  const pending = await nominate(id);
  if (mode === "delete") await env.DB.prepare("DELETE FROM user WHERE id = 'a'").run();
  else {
    expect(await removeMember(env.DB, mode === "leave" ? "a" : "owner", id, "a")).toBe(true);
    await acceptInvitation(env.DB, "a", (await inviteMember(env.DB, "owner", id, "a@example.test"))!.token);
  }
  expect(await acceptHandover(env.DB, "a", id, pending.id)).toBe(false);
  expect((await getHousehold(env.DB, "owner"))!.administratorId).toBe("owner");
});

test("administrator deletion preserves access but only verified pre-existing members can claim once", async () => {
  const id = await fixture();
  const invite = (await inviteMember(env.DB, "owner", id, "outsider@example.test"))!;
  const pending = await nominate(id);
  await env.DB.prepare("DELETE FROM user WHERE id = 'owner'").run();
  expect((await getHousehold(env.DB, "a"))!.administratorId).toBeNull();
  expect((await getHousehold(env.DB, "a"))!.members).toHaveLength(2);
  expect(await acceptHandover(env.DB, "a", id, pending.id)).toBe(false);
  expect(await claimAdministration(env.DB, "outsider", id)).toBe(false);
  expect(await acceptInvitation(env.DB, "outsider", invite.token)).toBeNull();
  expect(await inviteMember(env.DB, "a", id, "outsider@example.test")).toBeNull();
  await env.DB.prepare("UPDATE user SET emailVerified = 0 WHERE id = 'a'").run();
  expect(await claimAdministration(env.DB, "a", id)).toBe(false);
  await env.DB.prepare("UPDATE user SET emailVerified = 1 WHERE id = 'a'").run();
  const results = await Promise.all(["a", "b"].map(member => claimAdministration(env.DB, member, id)));
  expect(results.filter(Boolean)).toHaveLength(1);
  expect(["a", "b"]).toContain((await getHousehold(env.DB, "a"))!.administratorId);
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_notifications WHERE kind = 'administrator_deleted'").first("n")).toBe(2);
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_notifications WHERE kind = 'administrator_changed'").first("n")).toBe(2);
});

test("inactivity, departure and a vacant flag without eligible membership do not confer administration", async () => {
  const id = await fixture();
  expect(await claimAdministration(env.DB, "a", id)).toBe(false);
  await env.DB.prepare("DELETE FROM user WHERE id = 'owner'").run();
  await removeMember(env.DB, "a", id, "a");
  // A raw inserted later member must not gain a snapshot-based claim right either.
  await env.DB.prepare("INSERT INTO household_members (household_id, member_id) VALUES (?, 'a')").bind(id).run();
  expect(await claimAdministration(env.DB, "a", id)).toBe(false);
  expect(await claimAdministration(env.DB, "b", id)).toBe(true);
});

test("deleting the last administrator closes the household without a public claim path", async () => {
  const id = await fixture();
  await removeMember(env.DB, "owner", id, "a"); await removeMember(env.DB, "owner", id, "b");
  await env.DB.prepare("DELETE FROM user WHERE id = 'owner'").run();
  expect(await env.DB.prepare("SELECT closed FROM households WHERE id = ?").bind(id).first("closed")).toBe(1);
  expect(await claimAdministration(env.DB, "outsider", id)).toBe(false);
});

test("handover does not mutate sources, billing references or quota history", async () => {
  const id = await fixture();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO import_sources (id, household_id) VALUES ('source', ?)").bind(id),
    env.DB.prepare("INSERT INTO allowance_windows (id, household_id, capacity) VALUES ('quota', ?, 20)").bind(id),
    env.DB.prepare("INSERT INTO billing_payers (id, user_id) VALUES ('payer', 'owner')"),
    env.DB.prepare("INSERT INTO billing_purchase_intents (id, environment, organization_id, payer_id, household_id) VALUES ('intent', 'sandbox', 'org', 'payer', ?)").bind(id),
  ]);
  const tables = ["import_sources", "allowance_windows", "billing_payers", "billing_purchase_intents", "billing_households"];
  const before = await Promise.all(tables.map(table => env.DB.prepare(`SELECT * FROM ${table}`).all()));
  const pending = await nominate(id);
  expect(await acceptHandover(env.DB, "a", id, pending.id)).toBe(true);
  const after = await Promise.all(tables.map(table => env.DB.prepare(`SELECT * FROM ${table}`).all()));
  expect(after.map(result => result.results)).toEqual(before.map(result => result.results));
  expect(await inviteMember(env.DB, "owner", id, "outsider@example.test")).toBeNull();
  expect(await removeMember(env.DB, "owner", id, "owner")).toBe(true);
});

test("role change rolls back if notification persistence fails, and retries notify each member once", async () => {
  const id = await fixture();
  const pending = await nominate(id);
  await env.DB.prepare("CREATE TRIGGER reject_role_notice BEFORE INSERT ON household_notifications WHEN NEW.kind = 'administrator_changed' BEGIN SELECT RAISE(ABORT, 'notification unavailable'); END").run();
  await expect(acceptHandover(env.DB, "a", id, pending.id)).rejects.toThrow("notification unavailable");
  expect((await getHousehold(env.DB, "owner"))!.administratorId).toBe("owner");
  expect((await getHousehold(env.DB, "owner"))!.handover?.id).toBe(pending.id);
  await env.DB.prepare("DROP TRIGGER reject_role_notice").run();
  const results = await Promise.all([1, 2].map(() => acceptHandover(env.DB, "a", id, pending.id)));
  expect(results.filter(Boolean)).toHaveLength(1);
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_notifications WHERE kind = 'administrator_changed'").first("n")).toBe(3);
});

test("cancel racing acceptance has one winner and old administrator invitations stay revoked", async () => {
  const id = await fixture();
  const invitation = (await inviteMember(env.DB, "owner", id, "outsider@example.test"))!;
  const pending = await nominate(id);
  const results = await Promise.all([acceptHandover(env.DB, "a", id, pending.id), cancelHandover(env.DB, "owner", id, pending.id)]);
  expect(results.filter(Boolean)).toHaveLength(1);
  if (!results[0]) {
    const replacement = await nominate(id);
    expect(await acceptHandover(env.DB, "a", id, replacement.id)).toBe(true);
  }
  expect(await env.DB.prepare("SELECT revoked FROM household_invitations WHERE id = ?").bind(invitation.id).first("revoked")).toBe(1);
  expect(await acceptInvitation(env.DB, "outsider", invitation.token)).toBeNull();
  expect((await getHousehold(env.DB, "owner"))!.canClaimAdministration).toBe(false);
});
