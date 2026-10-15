export interface Scope { accountId: string; householdId: string }
export interface Item { listId: string; itemId: string; revision: number; purchased: boolean }
export interface Command extends Item { operationId: string }
export type Outcome =
  | { status: "accepted" | "conflict"; revision: number; purchased: boolean }
  | { status: "unavailable"; revision: null; purchased: null }
  | { status: "forbidden"; revision: null; purchased: null };
export interface PendingItem {
  item: Item;
  next: Command | null;
  flight: Command | null;
  notice: string | null;
  unavailable?: boolean;
}

export interface PendingQueue {
  read(scope: Scope): Promise<PendingItem[]>;
  observe(scope: Scope, item: Item): Promise<void>;
  check(scope: Scope, item: Item, purchased: boolean, operationId: string): Promise<void>;
  claim(scope: Scope): Promise<Command | null>;
  settle(scope: Scope, command: Command, outcome: Outcome): Promise<void>;
  clear(scope: Scope, entireAccount?: boolean): Promise<void>;
}

export function findItem(rows: PendingItem[], item: Item): PendingItem {
  return rows.find(row => row.item.listId === item.listId && row.item.itemId === item.itemId)
    ?? { item, next: null, flight: null, notice: null };
}

export function observeItem(state: PendingItem, item: Item) {
  if (!state.unavailable && item.revision >= state.item.revision) state.item = item;
}

export function checkItem(state: PendingItem, item: Item, purchased: boolean, operationId: string) {
  if (state.unavailable) throw new Error("Item is no longer available.");
  state.next = { ...item, purchased, operationId };
  state.notice = null;
}

export function claimItem(rows: PendingItem[]) {
  const state = rows.find(row => row.flight) ?? rows.find(row => row.next);
  if (state && !state.flight) { state.flight = state.next; state.next = null; }
  return state;
}

export function settleItem(state: PendingItem, command: Command, outcome: Outcome): "ignore" | "clear" | "save" {
  if (state.flight?.operationId !== command.operationId) return "ignore";
  if (outcome.status === "forbidden") return "clear";
  state.flight = null;
  if (outcome.status === "unavailable") {
    // Keep a tombstone so an old cached snapshot cannot recreate this immutable item ID.
    state.unavailable = true;
    state.next = null;
    state.notice = "Item is no longer available.";
  } else {
    // Later taps retain their observed revision. Never silently rebase stale intent.
    if (outcome.revision >= state.item.revision) {
      state.item = { ...state.item, revision: outcome.revision, purchased: outcome.purchased };
    }
    state.notice = outcome.status === "conflict" ? "Item changed elsewhere. Review it before checking again." : null;
  }
  return "save";
}
