import { openDatabaseAsync } from "expo-sqlite";
import { PendingChecks } from "./pending-store";

let opening: ReturnType<typeof createNativePending> | undefined;

async function createNativePending() {
  const database = await openDatabaseAsync("t03-pending.db");
  const queue = await PendingChecks.open(database);
  return { queue, database };
}

// One queue owns this database connection; all application writes use its serializer.
export function openNativePending() {
  return opening ??= createNativePending().catch(error => { opening = undefined; throw error; });
}
