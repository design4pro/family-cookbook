import { randomUUID } from "expo-crypto";
import { useNetworkState } from "expo-network";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { openNativePending } from "../shopping/pending.native";
import type { Command, Item, Outcome, PendingItem, Scope } from "../shopping/pending-store";
import { SyncSession } from "../shopping/sync-state";

const scopes: Scope[] = [
  { accountId: "alice", householdId: "home-a" },
  { accountId: "bob", householdId: "home-a" },
  { accountId: "alice", householdId: "home-b" },
];
const seed: Item = { listId: "proof-list", itemId: "milk", revision: 1, purchased: false };
type FixtureRequest = { command: Command; resolve: (outcome: Outcome) => void };

function Button({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
    onPress={onPress} style={[styles.button, disabled && styles.disabled]}>
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>;
}

export default function ProofShopping() {
  const [store, setStore] = useState<Awaited<ReturnType<typeof openNativePending>>>();
  const session = useRef<SyncSession | null>(null);
  const scopeRef = useRef<Scope | null>(scopes[0]!);
  const [scope, setScope] = useState<Scope | null>(scopeRef.current);
  const [rows, setRows] = useState<PendingItem[]>([]);
  const [message, setMessage] = useState("Opening durable storage...");
  const [failure, setFailure] = useState(false);
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [request, setRequest] = useState<FixtureRequest | null>(null);
  const network = useNetworkState();
  const online = network.isConnected === true && network.isInternetReachable !== false;

  const refresh = useCallback(async () => {
    if (!store) return;
    const identity = scopeRef.current;
    const restored = identity ? await store.queue.read(identity) : [];
    if (scopeRef.current === identity) setRows(restored);
  }, [store]);

  useEffect(() => {
    let mounted = true;
    openNativePending().then(async value => {
      const faults = await value.database.getAllAsync("SELECT name FROM sqlite_master WHERE name = 'proof_storage_failure'");
      if (!mounted) return;
      session.current = new SyncSession(value.queue);
      session.current.activate(scopeRef.current);
      setFailure(faults.length > 0);
      setStore(value);
      setMessage("Storage ready. Only synthetic identities and items are used.");
    }).catch(error => { if (mounted) setMessage(`Storage unavailable: ${String(error)}`); });
    return () => { mounted = false; session.current?.activate(null); };
  }, []);

  useEffect(() => { void refresh().catch(error => setMessage(`Read failed: ${String(error)}`)); }, [refresh, scope]);

  const sync = useCallback(async () => {
    if (!online || !session.current) { setMessage("Offline. Changes remain on this device."); return; }
    setSyncing(true);
    try {
      await session.current.sync(async (_identity, command, signal) => {
        // A controllable transport boundary, not a real server or authentication provider.
        return new Promise<Outcome>((resolve, reject) => {
          const abort = () => { setRequest(null); reject(new Error("Session changed; request canceled.")); };
          signal.addEventListener("abort", abort, { once: true });
          setRequest({ command, resolve: outcome => {
            signal.removeEventListener("abort", abort);
            setRequest(null);
            if (outcome.status === "forbidden") { scopeRef.current = null; setScope(null); setRows([]); }
            resolve(outcome);
          } });
        });
      });
      setMessage("Fixture sync finished. No external server was contacted.");
    } catch (error) { setMessage(`Sync stopped: ${String(error)}`); }
    finally { setSyncing(false); await refresh().catch(error => setMessage(`Read failed: ${String(error)}`)); }
  }, [online, refresh]);

  useEffect(() => {
    if (autoSync && online && AppState.currentState === "active") void sync();
    const subscription = AppState.addEventListener("change", state => {
      if (autoSync && online && state === "active") void sync();
    });
    return () => subscription.remove();
  }, [autoSync, online, sync]);

  async function action(task: () => Promise<void>, success: string) {
    setBusy(true);
    try { await task(); setMessage(success); }
    catch (error) { setMessage(`Action not saved: ${String(error)}`); }
    finally { await refresh().catch(error => setMessage(`Read failed: ${String(error)}`)); setBusy(false); }
  }

  const row = rows[0];
  const item = row?.item ?? seed;
  const purchased = row?.next?.purchased ?? row?.flight?.purchased ?? item.purchased;
  const count = rows.reduce((total, entry) => total + Number(!!entry.next) + Number(!!entry.flight), 0);
  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="header" style={styles.title}>Native pending-check proof</Text>
    <Text>Temporary T03 route. SQLite is real; acknowledgments below are controlled test fixtures.</Text>
    <Text selectable>Identity: {scope ? `${scope.accountId} / ${scope.householdId}` : "signed out"}</Text>
    <Text>Connectivity: {online ? "online" : "offline / unknown"}</Text>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
    <Text style={styles.title}>Milk: {purchased ? "checked" : "unchecked"}</Text>
    <Text accessibilityLiveRegion="polite">{count} changes waiting to sync</Text>
    <Text>Observed revision: {item.revision}</Text>
    {row?.notice && <Text accessibilityLiveRegion="polite">{row.notice}</Text>}
    <Button title="Check milk" disabled={!store || !scope || busy || row?.unavailable} onPress={() => void action(
      () => session.current!.check(item, true, randomUUID()), "Check saved on this device.")} />
    <Button title="Uncheck milk" disabled={!store || !scope || busy || row?.unavailable} onPress={() => void action(
      () => session.current!.check(item, false, randomUUID()), "Uncheck saved on this device.")} />
    <Text selectable>Pending ID: {row?.next?.operationId ?? "none"}</Text>
    <Text selectable>In-flight ID: {row?.flight?.operationId ?? request?.command.operationId ?? "none"}</Text>
    <View style={styles.toggle}><Text>Fail SQLite writes</Text><Switch accessibilityLabel="Fail SQLite writes" value={failure}
      disabled={!store || busy || syncing} onValueChange={enabled => void action(async () => {
        await store!.database.execAsync(enabled
          ? "CREATE TRIGGER proof_storage_failure BEFORE INSERT ON pending_checks BEGIN SELECT RAISE(ABORT, 'Injected storage failure'); END;"
          : "DROP TRIGGER IF EXISTS proof_storage_failure;");
        setFailure(enabled);
      }, "Storage fault setting updated.")} /></View>
    <View style={styles.toggle}><Text>Retry on reconnect / focus</Text><Switch accessibilityLabel="Retry on reconnect or focus"
      value={autoSync} onValueChange={setAutoSync} /></View>
    <Button title="Sync with controlled fixture" disabled={!store || !scope || busy || syncing || !online} onPress={() => void sync()} />
    {request && <View style={styles.fixture}>
      <Text selectable>Awaiting fixture outcome: {request.command.operationId}</Text>
      <Text>Tap again above while this acknowledgment is held.</Text>
      <Button title="Accept captured command" onPress={() => request.resolve({ status: "accepted", revision: request.command.revision + 1, purchased: request.command.purchased })} />
      <Button title="Reject as stale" onPress={() => request.resolve({ status: "conflict", revision: request.command.revision + 2, purchased: !request.command.purchased })} />
      <Button title="Reject removed item" onPress={() => request.resolve({ status: "unavailable", revision: null, purchased: null })} />
      <Button title="Reject revoked membership" onPress={() => request.resolve({ status: "forbidden", revision: null, purchased: null })} />
    </View>}
    {scopes.map(identity => <Button key={`${identity.accountId}/${identity.householdId}`} title={`Use ${identity.accountId} / ${identity.householdId}`}
      disabled={!store || busy} onPress={() => {
        session.current!.activate(identity); scopeRef.current = identity; setScope(identity); setRows([]);
        setMessage("Synthetic identity changed. Other partitions remain isolated.");
      }} />)}
    <Button title="Log out and clear account queue" disabled={!scope || busy} onPress={() => void action(async () => {
      const cleared = session.current!.logout(); scopeRef.current = null; setScope(null); setRows([]); await cleared;
    }, "Signed out. This account's queue was removed.")} />
    <Text>For restart evidence, use a build with an embedded JavaScript bundle. Force-close in airplane mode, reopen, and compare the pending ID. No background sync is promised.</Text>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, gap: 14, maxWidth: 640, width: "100%", alignSelf: "center" },
  title: { fontSize: 23, fontWeight: "700", color: "#16272b" },
  status: { padding: 12, backgroundColor: "#e9f0f2", color: "#16272b" },
  button: { minHeight: 48, padding: 14, backgroundColor: "#164e63", borderRadius: 8, justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  disabled: { opacity: 0.45 },
  toggle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" },
  fixture: { padding: 12, gap: 12, borderWidth: 1, borderColor: "#164e63" },
});
