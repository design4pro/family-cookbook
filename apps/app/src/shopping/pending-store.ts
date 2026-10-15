import { checkItem, claimItem, findItem, observeItem, settleItem } from "./pending-state";
import type { Command, Item, Outcome, PendingItem, Scope } from "./pending-state";
export type { Command, Item, Outcome, PendingItem, Scope } from "./pending-state";

export interface PendingTransaction {
  runAsync(sql: string, ...parameters: (string | number)[]): Promise<unknown>;
  getAllAsync<T>(sql: string, ...parameters: (string | number)[]): Promise<T[]>;
}
export interface PendingDatabase extends PendingTransaction {
  execAsync(sql: string): Promise<void>;
  withExclusiveTransactionAsync(task: (transaction: PendingTransaction) => Promise<void>): Promise<void>;
}

export class PendingChecks {
  private tail: Promise<unknown> = Promise.resolve();
  private constructor(private readonly db: PendingDatabase) {}

  static async open(db: PendingDatabase) {
    await db.execAsync(`PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      CREATE TABLE IF NOT EXISTS pending_checks (
        account TEXT NOT NULL, household TEXT NOT NULL, list TEXT NOT NULL,
        item TEXT NOT NULL, state TEXT NOT NULL,
        PRIMARY KEY (account, household, list, item)
      );`);
    return new PendingChecks(db);
  }

  // Serialize reads and transactions, including rapid taps before a prior commit.
  private serial<T>(task: () => Promise<T>): Promise<T> {
    const result = this.tail.then(task);
    this.tail = result.catch(() => undefined);
    return result;
  }

  private async rows(db: PendingTransaction, scope: Scope): Promise<PendingItem[]> {
    const rows = await db.getAllAsync<{ state: string }>(
      "SELECT state FROM pending_checks WHERE account = ? AND household = ? ORDER BY list, item",
      scope.accountId, scope.householdId,
    );
    return rows.map(row => JSON.parse(row.state) as PendingItem);
  }

  private save(db: PendingTransaction, scope: Scope, state: PendingItem) {
    return db.runAsync(`INSERT INTO pending_checks (account, household, list, item, state)
      VALUES (?, ?, ?, ?, ?) ON CONFLICT (account, household, list, item)
      DO UPDATE SET state = excluded.state`,
    scope.accountId, scope.householdId, state.item.listId, state.item.itemId, JSON.stringify(state));
  }

  read(scope: Scope) { return this.serial(() => this.rows(this.db, scope)); }

  observe(scope: Scope, item: Item) {
    return this.serial(() => this.db.withExclusiveTransactionAsync(async db => {
      const state = findItem(await this.rows(db, scope), item);
      observeItem(state, item);
      await this.save(db, scope, state);
    }));
  }

  clear(scope: Scope, entireAccount = false) {
    return this.serial(() => this.db.withExclusiveTransactionAsync(async db => {
      if (entireAccount) await db.runAsync("DELETE FROM pending_checks WHERE account = ?", scope.accountId);
      else await db.runAsync("DELETE FROM pending_checks WHERE account = ? AND household = ?", scope.accountId, scope.householdId);
    }));
  }

  check(scope: Scope, item: Item, purchased: boolean, operationId: string) {
    return this.serial(() => this.db.withExclusiveTransactionAsync(async db => {
      const state = findItem(await this.rows(db, scope), item);
      checkItem(state, item, purchased, operationId);
      await this.save(db, scope, state);
    }));
  }

  claim(scope: Scope): Promise<Command | null> {
    return this.serial(async () => {
      let command: Command | null = null;
      await this.db.withExclusiveTransactionAsync(async db => {
        const state = claimItem(await this.rows(db, scope));
        if (!state) return;
        await this.save(db, scope, state);
        command = state.flight;
      });
      return command;
    });
  }

  settle(scope: Scope, command: Command, outcome: Outcome) {
    return this.serial(() => this.db.withExclusiveTransactionAsync(async db => {
      const state = findItem(await this.rows(db, scope), command);
      const action = settleItem(state, command, outcome);
      if (action === "clear") {
        await db.runAsync("DELETE FROM pending_checks WHERE account = ? AND household = ?",
          scope.accountId, scope.householdId);
      } else if (action === "save") await this.save(db, scope, state);
    }));
  }
}
