import { IDBFactory } from "fake-indexeddb";
import { expect, test } from "vitest";
import { openWebPending } from "../../src/shopping/pending.web";
import { SyncSession } from "../../src/shopping/sync-state";

const scope = { accountId: "alice", householdId: "home-a" };
const item = { listId: "list-1", itemId: "milk", revision: 1, purchased: false };

test("IndexedDB commits intent before resolving and restores it after reopening", async () => {
  const factory = new IDBFactory();
  const first = await openWebPending(factory);
  await first.check(scope, item, true, "saved");
  first.close();
  const second = await openWebPending(factory);
  expect((await second.read(scope))[0]).toEqual({
    item, next: { ...item, purchased: true, operationId: "saved" }, flight: null, notice: null,
  });
  second.close();
});

test("two connections serialize writes, preserve unknown delivery and ignore duplicate acknowledgments", async () => {
  const factory = new IDBFactory();
  const first = await openWebPending(factory);
  const second = await openWebPending(factory);
  await Promise.all([
    first.check(scope, item, true, "one"),
    second.check(scope, item, false, "two"),
    first.check(scope, item, true, "three"),
  ]);
  const sent = await second.claim(scope);
  expect(sent?.operationId).toBe("three");
  await first.check(scope, item, false, "later");
  await second.observe(scope, { ...item, revision: 7 });
  expect(await first.claim(scope)).toEqual(sent);
  await second.settle(scope, sent!, { status: "accepted", revision: 2, purchased: true });
  const later = await first.claim(scope);
  await second.settle(scope, sent!, { status: "accepted", revision: 2, purchased: true });
  expect(await first.claim(scope)).toEqual({ ...item, operationId: "later", purchased: false });
  await first.settle(scope, later!, { status: "conflict", revision: 7, purchased: false });
  expect(await second.claim(scope)).toBeNull();
  expect((await first.read(scope))[0]).toMatchObject({ item: { revision: 7 }, notice: expect.stringContaining("changed elsewhere") });
  first.close(); second.close();
});

test("identity switching during an IndexedDB claim prevents dispatch", async () => {
  const queue = await openWebPending(new IDBFactory());
  await queue.check(scope, item, true, "alice");
  const session = new SyncSession(queue);
  session.activate(scope);
  let sends = 0;
  const sending = session.sync(async () => { sends++; return { status: "accepted", revision: 2, purchased: true }; });
  session.activate({ ...scope, accountId: "bob" });
  await sending;
  await session.sync(async () => { sends++; throw new Error("No Bob command exists"); });
  expect(sends).toBe(0);
  expect((await queue.claim(scope))?.operationId).toBe("alice");
  queue.close();
});

test("revocation fences held acknowledgments and clears only the revoked household", async () => {
  const queue = await openWebPending(new IDBFactory());
  const otherHome = { ...scope, householdId: "home-b" };
  const otherAccount = { ...scope, accountId: "bob" };
  for (const identity of [scope, otherHome, otherAccount]) await queue.check(identity, item, true, "saved");
  const session = new SyncSession(queue);
  session.activate(scope);
  let release!: () => void;
  let started!: () => void;
  const sending = new Promise<void>(resolve => { started = resolve; });
  let signal!: AbortSignal;
  const sync = session.sync(async (_scope, _command, captured) => {
    signal = captured;
    started();
    await new Promise<void>(resolve => { release = resolve; });
    return { status: "accepted", revision: 2, purchased: true };
  });
  await sending;
  await session.revoke();
  expect(signal.aborted).toBe(true);
  session.activate(otherAccount);
  release();
  await sync;
  expect(await queue.read(scope)).toEqual([]);
  expect((await queue.read(otherHome))[0]?.next?.operationId).toBe("saved");
  expect((await queue.read(otherAccount))[0]?.next?.operationId).toBe("saved");
  session.activate(otherHome);
  await session.logout();
  expect(await queue.read(otherHome)).toEqual([]);
  expect((await queue.read(otherAccount))[0]?.next?.operationId).toBe("saved");
  queue.close();
});

test("a removed item stays unavailable after refresh and forbidden clears a whole scope", async () => {
  const queue = await openWebPending(new IDBFactory());
  await queue.check(scope, item, true, "removed");
  const command = await queue.claim(scope);
  await queue.check(scope, item, false, "later");
  await queue.settle(scope, command!, { status: "unavailable", revision: null, purchased: null });
  await queue.observe(scope, { ...item, revision: 9 });
  await expect(queue.check(scope, item, true, "cached")).rejects.toThrow("no longer available");
  expect(await queue.claim(scope)).toBeNull();
  await queue.check(scope, { ...item, itemId: "bread" }, true, "bread");
  const bread = await queue.claim(scope);
  await queue.settle(scope, bread!, { status: "forbidden", revision: null, purchased: null });
  expect(await queue.read(scope)).toEqual([]);
  queue.close();
});
