import { useEffect, useRef, useState } from "react";
import { openWebPending } from "../shopping/pending.web";
import type { Item, PendingItem, Scope } from "../shopping/pending-state";
import { SyncSession } from "../shopping/sync-state";

const initialItem: Item = { listId: "list-1", itemId: "milk", revision: 1, purchased: false };
const initialScope: Scope = { accountId: "alice", householdId: "home-a" };
type Queue = Awaited<ReturnType<typeof openWebPending>>;

export default function WebShoppingProof() {
  const runtime = useRef<{ queue: Queue; session: SyncSession } | null>(null);
  const identity = useRef<Scope | null>(initialScope);
  const [account, setAccount] = useState("alice");
  const [state, setState] = useState<PendingItem | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("Opening local storage…");
  const [error, setError] = useState("");
  const [online, setOnline] = useState(true);
  const generation = useRef(0);

  async function refresh() {
    const scope = identity.current;
    const captured = generation.current;
    const rows = scope && runtime.current ? await runtime.current.queue.read(scope) : [];
    if (captured === generation.current) setState(rows[0] ?? null);
  }

  useEffect(() => {
    let disposed = false;
    let queue: Queue | undefined;
    void (async () => {
      try {
        queue = await openWebPending();
        if (disposed) { queue.close(); return; }
        const session = new SyncSession(queue);
        session.activate(identity.current);
        runtime.current = { queue, session };
        await refresh();
        if (!disposed) { setReady(true); setMessage("Local storage ready."); }
      } catch { if (!disposed) setError("Local storage unavailable. Changes cannot be saved."); }
    })();
    const connectivity = () => setOnline(navigator.onLine);
    connectivity();
    window.addEventListener("online", connectivity);
    window.addEventListener("offline", connectivity);
    return () => {
      disposed = true;
      runtime.current?.session.activate(null);
      queue?.close();
      window.removeEventListener("online", connectivity);
      window.removeEventListener("offline", connectivity);
    };
  }, []);

  async function action(task: () => Promise<void>) {
    const captured = generation.current;
    setError("");
    try { await task(); }
    catch (cause) {
      if (captured === generation.current) setError(`Action failed; no new save confirmed. ${cause instanceof Error ? cause.message : String(cause)}`);
    }
    finally { await refresh().catch(() => setError("Local storage cannot be read. Changes are not confirmed.")); }
  }

  const item = state?.item ?? initialItem;
  const checked = state?.next?.purchased ?? state?.flight?.purchased ?? item.purchased;

  async function check() {
    setSaving(true);
    setMessage("");
    await action(async () => {
      await runtime.current!.session.check(item, !checked, crypto.randomUUID());
      setMessage("Saved on this browser; pending synchronization.");
    });
    setSaving(false);
  }

  async function sync() {
    setSyncing(true);
    await action(() => runtime.current!.session.sync(async (scope, command, signal) => {
      await refresh();
      // Test transport only. T07/T24 replace fixture identities with authenticated credentials.
      const response = await fetch("/proof-check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, command }), signal,
      });
      if (!response.ok) throw new Error("Synchronization unavailable. Pending intent retained.");
      return response.json();
    }));
    setSyncing(false);
  }

  async function switchAccount(next: string | null) {
    generation.current++;
    identity.current = next ? { ...initialScope, accountId: next } : null;
    setAccount(next ?? "signed out");
    setState(null);
    setMessage("");
    if (next) runtime.current!.session.activate(identity.current);
    await action(() => next ? Promise.resolve() : runtime.current!.session.logout());
  }

  return <main style={{ maxWidth: 680, margin: "32px auto", padding: 24, fontFamily: "system-ui", lineHeight: 1.5 }}>
    <h1>Web pending checks proof</h1>
    <p>Isolated fixture for T04. No real account or server mutation. Offline reload requires an available application shell.</p>
    <p>Account: <strong data-testid="account">{account}</strong>. Network: <span data-testid="network">{online ? "online" : "offline"}</span>.</p>
    <fieldset disabled={!ready || saving} style={{ padding: 16 }}>
      <legend>Shopping fixture</legend>
      <label style={{ display: "block", padding: 12 }}>
        <input type="checkbox" checked={checked} disabled={!identity.current || state?.unavailable} onChange={() => void check()} /> Milk
      </label>
      <p>Revision: <span data-testid="revision">{item.revision}</span></p>
      <p>Pending ID: <code data-testid="next">{state?.next?.operationId ?? "none"}</code></p>
      <p>In-flight ID: <code data-testid="flight">{state?.flight?.operationId ?? "none"}</code></p>
      <p data-testid="notice">{state?.notice}</p>
      <button disabled={!identity.current || syncing} onClick={() => void sync()}>Retry synchronization</button>{" "}
      <button disabled={!identity.current} onClick={() => void action(() => runtime.current!.queue.observe(identity.current!, { ...initialItem, revision: 7 }))}>Fetch snapshot revision 7</button>
    </fieldset>
    <fieldset disabled={!ready || saving} style={{ marginTop: 16, padding: 16 }}>
      <legend>Fixture identity</legend>
      <button onClick={() => void switchAccount("alice")}>Use Alice</button>{" "}
      <button onClick={() => void switchAccount("bob")}>Use Bob</button>{" "}
      <button onClick={() => void switchAccount(null)}>Sign out</button>
    </fieldset>
    <p role="status">{message}</p>
    {error && <p role="alert">{error}</p>}
  </main>;
}
