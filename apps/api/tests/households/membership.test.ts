import { env } from "cloudflare:workers";
import { expect, test } from "vitest";
import { createHousehold, inviteMember, acceptInvitation, removeMember, revokeInvitation, getHousehold, readHouseholdResource } from "../../src/households/membership";
import { createJob } from "../../src/usage/reservations";
import { claimJob, settleJob } from "../../src/imports/job-state";
import { applyCheck } from "../../src/shopping/apply-check";

async function user(id: string) {
  await env.DB.prepare('INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES (?, ?, ?, 1, 0, 0)')
    .bind(id, id, `${id}@example.test`).run();
  return id;
}

test("creation atomically assigns separate administrator and payer roles and a single membership", async () => {
  const owner = await user("owner");
  const results = await Promise.all([createHousehold(env.DB, owner), createHousehold(env.DB, owner)]);
  expect(results.filter(result => result !== null)).toHaveLength(1);
  const household = await getHousehold(env.DB, owner);
  expect(household).toMatchObject({ administratorId: owner, payerId: owner });
  expect(await env.DB.prepare('SELECT COUNT(*) AS n FROM households').first("n")).toBe(1);
  expect(household!.members).toHaveLength(1);
});

test("invitations are email-bound, expiring, single-use and revocable", async () => {
  const owner = await user("owner"), member = await user("member"), other = await user("other");
  const household = (await createHousehold(env.DB, owner))!;
  const invite = (await inviteMember(env.DB, owner, household, "MEMBER@example.test", 100))!;
  expect(await acceptInvitation(env.DB, other, invite.token, 101)).toBeNull();
  const accepted = await Promise.all([1, 2].map(() => acceptInvitation(env.DB, member, invite.token, 101)));
  expect(accepted.filter(Boolean)).toEqual([household]);
  const expired = (await inviteMember(env.DB, owner, household, "other@example.test", 100))!;
  expect(await acceptInvitation(env.DB, other, expired.token, expired.expiresAt)).toBeNull();
  const canceled = (await inviteMember(env.DB, owner, household, "other@example.test", 100))!;
  expect(await revokeInvitation(env.DB, member, household, canceled.id)).toBe(false);
  expect(await revokeInvitation(env.DB, owner, household, canceled.id)).toBe(true);
  expect(await acceptInvitation(env.DB, other, canceled.token, 101)).toBeNull();
  expect(await env.DB.prepare('SELECT token_hash FROM household_invitations WHERE id = ?').bind(invite.id).first("token_hash")).not.toBe(invite.token);
});

test("competing acceptances cannot exceed five people or join two households", async () => {
  const owner = await user("owner"), second = await user("second");
  const household = (await createHousehold(env.DB, owner))!;
  const otherHousehold = (await createHousehold(env.DB, second))!;
  const members = await Promise.all(["a", "b", "c", "d", "e", "f"].map(user));
  const invites = await Promise.all(members.map(id => inviteMember(env.DB, owner, household, `${id}@example.test`)));
  const results = await Promise.all(members.map((id, i) => acceptInvitation(env.DB, id, invites[i]!.token)));
  expect(results.filter(Boolean)).toHaveLength(4);
  expect((await getHousehold(env.DB, owner))!.members).toHaveLength(5);
  const joined = members[results.findIndex(Boolean)]!;
  const another = (await inviteMember(env.DB, second, otherHousehold, `${joined}@example.test`))!;
  expect(await acceptInvitation(env.DB, joined, another.token)).toBeNull();
});

test("members can leave, admins cannot abandon other members, empty households close", async () => {
  const owner = await user("owner"), member = await user("member");
  const household = (await createHousehold(env.DB, owner))!;
  const invite = (await inviteMember(env.DB, owner, household, "member@example.test"))!;
  await acceptInvitation(env.DB, member, invite.token);
  expect(await removeMember(env.DB, owner, household, owner)).toBe(false);
  expect(await removeMember(env.DB, member, household, owner)).toBe(false);
  expect(await removeMember(env.DB, member, household, member)).toBe(true);
  expect(await getHousehold(env.DB, member)).toBeNull();
  expect(await env.DB.prepare('SELECT id FROM user WHERE id = ?').bind(member).first("id")).toBe(member);
  expect(await env.DB.prepare('SELECT payer_user_id FROM billing_households WHERE household_id = ?').bind(household).first("payer_user_id")).toBe(owner);
  const pending = (await inviteMember(env.DB, owner, household, "member@example.test"))!;
  expect(await removeMember(env.DB, owner, household, owner)).toBe(true);
  expect(await env.DB.prepare('SELECT closed FROM households WHERE id = ?').bind(household).first("closed")).toBe(1);
  expect(await acceptInvitation(env.DB, member, pending.token)).toBeNull();
});

test("one user racing two household invitations gets exactly one membership without consuming the losing invitation", async () => {
  const first = await user("first"), second = await user("second"), member = await user("member");
  const a = (await createHousehold(env.DB, first))!, b = (await createHousehold(env.DB, second))!;
  const ia = (await inviteMember(env.DB, first, a, "member@example.test"))!;
  const ib = (await inviteMember(env.DB, second, b, "member@example.test"))!;
  const results = await Promise.all([ia, ib].map(invite => acceptInvitation(env.DB, member, invite.token)));
  expect(results.filter(Boolean)).toHaveLength(1);
  expect(await env.DB.prepare('SELECT COUNT(*) AS n FROM household_invitations WHERE consumed_by IS NOT NULL').first("n")).toBe(1);
});

test("only the current administrator can invite, unverified email cannot join, and unknown tokens disclose nothing", async () => {
  const owner = await user("owner"), member = await user("member"), outsider = await user("outsider");
  const household = (await createHousehold(env.DB, owner))!;
  expect(await inviteMember(env.DB, outsider, household, "member@example.test")).toBeNull();
  expect(await inviteMember(env.DB, owner, household, "not an email")).toBeNull();
  expect(await acceptInvitation(env.DB, member, "unknown")).toBeNull();
  const invite = (await inviteMember(env.DB, owner, household, "member@example.test"))!;
  await env.DB.prepare('UPDATE user SET emailVerified = 0 WHERE id = ?').bind(member).run();
  expect(await acceptInvitation(env.DB, member, invite.token)).toBeNull();
  expect(await createHousehold(env.DB, member)).toBeNull();
});

test("administrator removal revokes private reads, late jobs and sync without erasing sources or billing", async () => {
  const owner = await user("owner"), member = await user("member");
  const household = (await createHousehold(env.DB, owner))!;
  await acceptInvitation(env.DB, member, (await inviteMember(env.DB, owner, household, "member@example.test"))!.token);
  await env.DB.batch([
    env.DB.prepare("INSERT INTO import_sources (id, household_id) VALUES ('source', ?)").bind(household),
    env.DB.prepare("INSERT INTO allowance_windows (id, household_id, capacity) VALUES ('window', ?, 5)").bind(household),
    env.DB.prepare("INSERT INTO shopping_lists (id, household_id) VALUES ('list', ?)").bind(household),
    env.DB.prepare("INSERT INTO shopping_items (id, list_id, revision, purchased) VALUES ('item', 'list', 0, 0)"),
  ]);
  await env.ACTIVE.put("private-source", "unchanged original");
  const input = { id: "job", householdId: household, memberId: member, sourceId: "source", windowId: "window", units: 1 };
  await createJob(env.DB, input);
  const claimed = (await claimJob(env.DB, { jobId: "job", generation: 0 }, Date.now()))!;
  expect(claimed).not.toBeNull();
  expect((await readHouseholdResource(env.DB, member, household, async () => new Response("recipe"))).status).toBe(200);
  // The payer can leave membership without transferring billing ownership.
  await env.DB.prepare('UPDATE billing_households SET payer_user_id = ? WHERE household_id = ?').bind(member, household).run();
  expect(await removeMember(env.DB, owner, household, member)).toBe(true);
  for (const resource of ["recipe", "object", "job", "sync"]) {
    let called = false;
    const response = await readHouseholdResource(env.DB, member, household, async () => { called = true; return new Response(resource); });
    expect(response.status).toBe(403);
    expect(called).toBe(false);
  }
  expect(await applyCheck(env.DB, { householdId: household, memberId: member, operationId: "late", listId: "list", itemId: "item", expectedRevision: 0, purchased: true })).toMatchObject({ status: "forbidden" });
  await expect(createJob(env.DB, { ...input, id: "late-job" })).rejects.toThrow("unavailable");
  // Rejoining must not revive the already running job or its reserved units.
  await acceptInvitation(env.DB, member, (await inviteMember(env.DB, owner, household, "member@example.test"))!.token);
  await settleJob(env.DB, claimed, "late result");
  expect(await env.DB.prepare("SELECT state FROM import_jobs WHERE id = 'job'").first("state")).toBe("canceled");
  expect(await env.DB.prepare("SELECT state FROM usage_reservations WHERE job_id = 'job'").first("state")).toBe("released");
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM import_results").first("n")).toBe(0);
  expect(await env.DB.prepare("SELECT deleted FROM import_sources WHERE id = 'source'").first("deleted")).toBe(0);
  expect(await (await env.ACTIVE.get("private-source"))!.text()).toBe("unchanged original");
  expect(await env.DB.prepare('SELECT payer_user_id FROM billing_households WHERE household_id = ?').bind(household).first("payer_user_id")).toBe(member);
});

test("private object response is suppressed when membership disappears during storage read", async () => {
  const owner = await user("owner");
  const household = (await createHousehold(env.DB, owner))!;
  const response = await readHouseholdResource(env.DB, owner, household, async () => {
    await removeMember(env.DB, owner, household, owner);
    return new Response("private bytes");
  });
  expect(response.status).toBe(403);
  expect(await response.text()).not.toContain("private bytes");
});
