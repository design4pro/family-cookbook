import { DatabaseSync } from "node:sqlite";
import type { PendingDatabase, PendingTransaction } from "../../src/shopping/pending-store";

// Desktop SQL integration only; physical-device evidence is recorded separately.
export function openTestDatabase(path: string) {
  const db = new DatabaseSync(path);
  const transaction: PendingTransaction = {
    async runAsync(sql, ...parameters) { db.prepare(sql).run(...parameters); },
    async getAllAsync<T>(sql: string, ...parameters: (string | number)[]) {
      return db.prepare(sql).all(...parameters) as T[];
    },
  };
  const database: PendingDatabase = {
    ...transaction,
    async execAsync(sql) { db.exec(sql); },
    async withExclusiveTransactionAsync(task) {
      db.exec("BEGIN IMMEDIATE");
      try { await task(transaction); db.exec("COMMIT"); }
      catch (error) { db.exec("ROLLBACK"); throw error; }
    },
  };
  return { database, close: () => db.close() };
}
