import { checkItem, claimItem, findItem, observeItem, settleItem } from "./pending-state";
import type { Command, Item, Outcome, PendingItem, PendingQueue, Scope } from "./pending-state";

interface StoredItem extends Scope { state: PendingItem; listId: string; itemId: string }

class WebPending implements PendingQueue {
  constructor(private readonly db: IDBDatabase) { db.onversionchange = () => db.close(); }
  close() { this.db.close(); }

  private transaction<T>(scope: Scope, mode: IDBTransactionMode,
    action: (rows: PendingItem[], store: IDBObjectStore) => T): Promise<T> {
    return new Promise((resolve, reject) => {
      // Resolve only on commit, never on a put request's earlier success event.
      const tx = this.db.transaction("checks", mode, { durability: "strict" });
      const store = tx.objectStore("checks");
      let result: T;
      let failure: unknown;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(failure ?? tx.error ?? new Error("Local storage transaction aborted."));
      const request = store.index("scope").getAll([scope.accountId, scope.householdId]);
      request.onsuccess = () => {
        try { result = action((request.result as StoredItem[]).map(row => row.state), store); }
        catch (error) { failure = error; tx.abort(); }
      };
    });
  }

  private save(store: IDBObjectStore, scope: Scope, state: PendingItem) {
    store.put({ ...scope, listId: state.item.listId, itemId: state.item.itemId, state } satisfies StoredItem);
  }

  read(scope: Scope) { return this.transaction(scope, "readonly", rows => rows); }

  observe(scope: Scope, item: Item) {
    return this.transaction(scope, "readwrite", (rows, store) => {
      const state = findItem(rows, item);
      observeItem(state, item);
      this.save(store, scope, state);
    });
  }

  check(scope: Scope, item: Item, purchased: boolean, operationId: string) {
    return this.transaction(scope, "readwrite", (rows, store) => {
      const state = findItem(rows, item);
      checkItem(state, item, purchased, operationId);
      this.save(store, scope, state);
    });
  }

  claim(scope: Scope) {
    return this.transaction(scope, "readwrite", (rows, store) => {
      const state = claimItem(rows);
      if (!state) return null;
      this.save(store, scope, state);
      return state.flight;
    });
  }

  settle(scope: Scope, command: Command, outcome: Outcome) {
    return this.transaction(scope, "readwrite", (rows, store) => {
      const state = findItem(rows, command);
      const action = settleItem(state, command, outcome);
      if (action === "clear") {
        for (const row of rows) store.delete([scope.accountId, scope.householdId, row.item.listId, row.item.itemId]);
      } else if (action === "save") this.save(store, scope, state);
    });
  }

  clear(scope: Scope, entireAccount = false) {
    return this.transaction(scope, "readwrite", (_rows, store) => {
      const request = entireAccount ? store.index("account").getAllKeys(scope.accountId)
        : store.index("scope").getAllKeys([scope.accountId, scope.householdId]);
      request.onsuccess = () => { for (const key of request.result) store.delete(key); };
    });
  }
}

export function openWebPending(factory: IDBFactory = indexedDB): Promise<WebPending> {
  return new Promise((resolve, reject) => {
    const request = factory.open("cookbook-pending", 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore("checks", { keyPath: ["accountId", "householdId", "listId", "itemId"] });
      store.createIndex("scope", ["accountId", "householdId"]);
      store.createIndex("account", "accountId");
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(new WebPending(request.result));
  });
}
