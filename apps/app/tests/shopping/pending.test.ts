import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "vitest";
import { PendingChecks } from "../../src/shopping/pending-store";
import { openTestDatabase } from "./sqlite";
import { SyncSession } from "../../src/shopping/sync-state";

const scope = { accountId: "alice", householdId: "home-a" };
const item = { listId: "list-1", itemId: "milk", revision: 1, purchased: false };
const directories: string[] = [];
afterEach(() => { for (const path of directories.splice(0)) rmSync(path, { recursive: true, force: true }); });

function databasePath() {
  const directory = mkdtempSync(join(tmpdir(), "t03-"));
  directories.push(directory);
  return join(directory, "pending.db");
}

test("a committed check survives closing and reopening its SQLite database", async () => {
  const path = databasePath();
  const first = openTestDatabase(path);
  const queue = await PendingChecks.open(first.database);
  await queue.check(scope, item, true, "check-1");
  first.close();
  const second = openTestDatabase(path);
  const restored = await PendingChecks.open(second.database);
  expect(await restored.read(scope)).toEqual([{
    item, next: { ...item, operationId: "check-1", purchased: true }, flight: null, notice: null,
  }]);
  second.close();
});

test("unsent taps collapse while retries and old acknowledgments preserve later intent", async () => {
  const connection = openTestDatabase(databasePath());
  const queue = await PendingChecks.open(connection.database);
  await Promise.all([
    queue.check(scope, item, true, "one"),
    queue.check(scope, item, false, "two"),
    queue.check(scope, item, true, "three"),
  ]);
  const sent = await queue.claim(scope);
  expect(sent).toEqual({ ...item, operationId: "three", purchased: true });
  await queue.check(scope, item, false, "four");
  expect(await queue.claim(scope)).toEqual(sent);
  await queue.settle(scope, sent!, { status: "accepted", revision: 2, purchased: true });
  expect((await queue.read(scope))[0]?.next?.operationId).toBe("four");
  const next = await queue.claim(scope);
  await queue.settle(scope, sent!, { status: "accepted", revision: 2, purchased: true });
  expect(await queue.claim(scope)).toEqual(next);
  expect(next).toEqual({ ...item, operationId: "four", purchased: false });
  connection.close();
});

test("switching identity during a claim cannot send another account's pending changes", async () => {
  const connection = openTestDatabase(databasePath());
  const queue = await PendingChecks.open(connection.database);
  await queue.check(scope, item, true, "alice-check");
  const session = new SyncSession(queue);
  session.activate(scope);
  const sent: string[] = [];
  const sync = session.sync(async (identity, command) => {
    sent.push(`${identity.accountId}/${command.operationId}`);
    return { status: "accepted", revision: 2, purchased: true };
  });
  session.activate({ accountId: "bob", householdId: "home-a" });
  await sync;
  await session.sync(async () => { throw new Error("No Bob operation should exist"); });
  expect(sent).toEqual([]);
  expect((await queue.read(scope))[0]?.flight?.operationId).toBe("alice-check");
  session.activate(scope);
  await session.logout();
  expect(await queue.read(scope)).toEqual([]);
  connection.close();
});

test("a fetched snapshot preserves pending intent and a stale rejection does not rebase it", async () => {
  const connection = openTestDatabase(databasePath());
  const queue = await PendingChecks.open(connection.database);
  await queue.check(scope, item, true, "stale");
  await queue.observe(scope, { ...item, revision: 7 });
  expect((await queue.read(scope))[0]?.next?.operationId).toBe("stale");
  const command = await queue.claim(scope);
  expect(command?.revision).toBe(1);
  await queue.settle(scope, command!, { status: "conflict", revision: 7, purchased: false });
  expect(await queue.claim(scope)).toBeNull();
  expect((await queue.read(scope))[0]).toMatchObject({ item: { revision: 7, purchased: false }, next: null, flight: null });
  expect((await queue.read(scope))[0]?.notice).toContain("changed elsewhere");
  connection.close();
});

test("a SQLite write failure rejects the action without changing the last saved intent", async () => {
  const connection = openTestDatabase(databasePath());
  const queue = await PendingChecks.open(connection.database);
  await queue.check(scope, item, true, "saved");
  await connection.database.execAsync("CREATE TRIGGER fail_write BEFORE INSERT ON pending_checks BEGIN SELECT RAISE(ABORT, 'disk full fixture'); END;");
  await expect(queue.check(scope, item, false, "not-saved")).rejects.toThrow("disk full fixture");
  expect((await queue.read(scope))[0]?.next?.operationId).toBe("saved");
  await expect(queue.claim(scope)).rejects.toThrow("disk full fixture");
  expect((await queue.read(scope))[0]?.flight).toBeNull();
  await connection.database.execAsync("DROP TRIGGER fail_write;");
  expect((await queue.claim(scope))?.operationId).toBe("saved");
  connection.close();
});

test("unknown delivery outcomes retry the same persisted operation after reopening", async () => {
  const path = databasePath();
  const first = openTestDatabase(path);
  const queue = await PendingChecks.open(first.database);
  await queue.check(scope, item, true, "unknown-result");
  const session = new SyncSession(queue);
  session.activate(scope);
  await expect(session.sync(async () => { throw new Error("Response lost"); })).rejects.toThrow("Response lost");
  await queue.check(scope, item, false, "later-tap");
  first.close();
  const second = openTestDatabase(path);
  const restored = await PendingChecks.open(second.database);
  expect(await restored.claim(scope)).toEqual({ ...item, purchased: true, operationId: "unknown-result" });
  expect((await restored.read(scope))[0]?.next?.operationId).toBe("later-tap");
  second.close();
});

test("membership revocation fences an in-flight response and deletes only that household", async () => {
  const connection = openTestDatabase(databasePath());
  const queue = await PendingChecks.open(connection.database);
  const otherHome = { ...scope, householdId: "home-b" };
  const otherAccount = { ...scope, accountId: "bob" };
  for (const identity of [scope, otherHome, otherAccount]) await queue.check(identity, item, true, "check");
  const session = new SyncSession(queue);
  session.activate(scope);
  let complete!: (value: { status: "accepted"; revision: number; purchased: boolean }) => void;
  let started!: () => void;
  const sending = new Promise<void>(resolve => { started = resolve; });
  let signal!: AbortSignal;
  const sync = session.sync(async (_scope, _command, capturedSignal) => {
    signal = capturedSignal;
    started();
    return new Promise(resolve => { complete = resolve; });
  });
  await sending;
  await session.revoke();
  expect(signal.aborted).toBe(true);
  session.activate(otherAccount);
  complete({ status: "accepted", revision: 2, purchased: true });
  await sync;
  expect(await queue.read(scope)).toEqual([]);
  expect((await queue.read(otherHome))[0]?.next?.operationId).toBe("check");
  expect((await queue.read(otherAccount))[0]?.next?.operationId).toBe("check");
  connection.close();
});

test("forbidden stops the sync loop and a removed item cannot be resurrected", async () => {
  const connection = openTestDatabase(databasePath());
  const queue = await PendingChecks.open(connection.database);
  await queue.check(scope, item, true, "first");
  const command = await queue.claim(scope);
  await queue.check(scope, item, false, "later");
  await queue.settle(scope, command!, { status: "unavailable", revision: null, purchased: null });
  expect(await queue.claim(scope)).toBeNull();
  await expect(queue.check(scope, item, true, "after-refresh")).rejects.toThrow("no longer available");
  await queue.observe(scope, { ...item, revision: 9 });
  await expect(queue.check(scope, item, true, "cached-snapshot")).rejects.toThrow("no longer available");
  await queue.check(scope, { ...item, itemId: "bread" }, true, "bread");
  const session = new SyncSession(queue);
  session.activate(scope);
  const sent: string[] = [];
  await session.sync(async (_identity, operation) => {
    sent.push(operation.operationId);
    return { status: "forbidden", revision: null, purchased: null };
  });
  expect(sent).toEqual(["bread"]);
  expect(await queue.read(scope)).toEqual([]);
  await expect(session.check(item, true, "forbidden-tap")).rejects.toThrow("Sign in");
  connection.close();
});
