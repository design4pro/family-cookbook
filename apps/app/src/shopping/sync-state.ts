import type { Command, Item, Outcome, PendingQueue, Scope } from "./pending-state";

export type SendCheck = (scope: Readonly<Scope>, command: Command, signal: AbortSignal) => Promise<Outcome>;

export class SyncSession {
  private scope: Scope | null = null;
  private generation = 0;
  private controller = new AbortController();
  private running: Promise<void> | null = null;

  constructor(private readonly queue: PendingQueue) {}

  // Authentication supplies this identity; never infer it from a queued command.
  activate(scope: Scope | null) {
    this.generation++;
    this.controller.abort();
    this.controller = new AbortController();
    this.scope = scope ? { ...scope } : null;
  }

  check(item: Item, purchased: boolean, operationId: string) {
    if (!this.scope) return Promise.reject(new Error("Sign in before changing an item."));
    return this.queue.check(this.scope, item, purchased, operationId);
  }

  logout() {
    const scope = this.scope;
    this.activate(null); // Fence dispatch synchronously, before any storage await.
    return scope ? this.queue.clear(scope, true) : Promise.resolve();
  }

  revoke() {
    const scope = this.scope;
    this.activate(null);
    return scope ? this.queue.clear(scope) : Promise.resolve();
  }

  sync(send: SendCheck): Promise<void> {
    if (this.running) return this.running;
    const scope = this.scope;
    if (!scope) return Promise.resolve();
    const generation = this.generation;
    const signal = this.controller.signal;
    const current = () => generation === this.generation;
    this.running = (async () => {
      while (current()) {
        const command = await this.queue.claim(scope);
        if (!command || !current()) return;
        // The transport must bind credentials to this captured scope, not read a mutable global session.
        const outcome = await send(scope, command, signal);
        if (!current()) return;
        if (outcome.status === "forbidden") { await this.revoke(); return; }
        await this.queue.settle(scope, command, outcome);
      }
    })().finally(() => { this.running = null; });
    return this.running;
  }
}
