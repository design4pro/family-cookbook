// Emit reviewed code for the authenticated Cloudflare connector. No credentials are read.
const [phase, run] = process.argv.slice(2);
if (!["seed", "inspect", "dispatch", "duplicates", "verify"].includes(phase)) throw new Error("Unknown proof phase");
if (phase !== "seed" && !/^t05-[0-9a-f-]+$/.test(run ?? "")) throw new Error("Supply the exact run ID returned by seed");

async function remoteProof(phase, requestedRun) {
  const root = "/accounts/6cfdf3b5143cddc631383a4c14736c3a";
  const database = `${root}/d1/database/7bfd0285-35e1-41ea-a78a-013d90c203c8`;
  const queue = `${root}/queues/a6ff17e10b07451da948d4252ab9736e`;
  async function request(method, path, body) {
    const response = await cloudflare.request({ method, path, body });
    if (!response.success || (Array.isArray(response.result) && response.result.some(row => row.success === false))) {
      throw new Error(JSON.stringify(response.errors));
    }
    return response.result;
  }
  const identity = await request("GET", database);
  const queueIdentity = await request("GET", queue);
  if (identity.name !== "family-cookbook-t05-proof" || queueIdentity.queue_name !== "family-cookbook-t05-proof") {
    throw new Error("Refusing to use resources outside T05");
  }
  const run = requestedRun ?? `t05-${crypto.randomUUID()}`;
  const modes = ["success", "failure", "revoke", "delete", "lost-ack", "enqueue-failure"];
  const inputs = modes.map(mode => ({ mode, request: {
    id: `${run}-${mode}`, householdId: `${run}-${mode}-home`, memberId: `${run}-${mode}-member`,
    sourceId: `${run}-${mode}-source`, windowId: `${run}-${mode}-window`, units: 1,
  } }));
  const query = async (sql, ...params) => (await request("POST", `${database}/query`, { sql, params }))[0].results;
  const push = messages => request("POST", `${queue}/messages/batch`, {
    messages: messages.map(body => ({ body, content_type: "json" })),
  });
  if (phase === "seed") {
    const batch = inputs.flatMap(({ request: input }) => [
      { sql: "INSERT INTO household_members VALUES (?, ?)", params: [input.householdId, input.memberId] },
      { sql: "INSERT INTO import_sources VALUES (?, ?, 0)", params: [input.sourceId, input.householdId] },
      { sql: "INSERT INTO allowance_windows VALUES (?, ?, 1)", params: [input.windowId, input.householdId] },
    ]);
    await request("POST", `${database}/query`, { batch });
    await push([{ action: "create", ...inputs.at(-1) }]);
    return { run, phase, submitted: "enqueue-failure", inputs };
  }
  if (phase === "dispatch") {
    await push([{ action: "reconcile" }, ...inputs.slice(0, -1).map(input => ({ action: "create", ...input }))]);
    return { run, phase, submitted: 6 };
  }
  if (phase === "duplicates") {
    await push(Array.from({ length: 6 }, () => ({ jobId: `${run}-success`, generation: 0 })));
    return { run, phase, submitted: 6 };
  }
  const jobs = await query("SELECT id, state, attempts, generation FROM import_jobs WHERE id LIKE ? ORDER BY id", `${run}-%`);
  const usage = await query("SELECT job_id, state, units FROM usage_reservations WHERE job_id LIKE ? ORDER BY job_id", `${run}-%`);
  const results = await query("SELECT job_id FROM import_results WHERE job_id LIKE ? ORDER BY job_id", `${run}-%`);
  const deliveries = await query("SELECT job_id, message_id, attempt, outcome FROM proof_deliveries WHERE job_id LIKE ? ORDER BY id", `${run}-%`);
  const sources = await query("SELECT id, deleted FROM import_sources WHERE id LIKE ? ORDER BY id", `${run}-%`);
  if (phase === "verify") {
    if (jobs.length !== 6 || usage.length !== 6 || results.length !== 3) throw new Error("Unexpected row counts");
    for (const { mode, request: input } of inputs) {
      const expected = mode === "failure" ? "failed" : ["revoke", "delete"].includes(mode) ? "canceled" : "succeeded";
      const job = jobs.find(job => job.id === input.id);
      const reservation = usage.find(row => row.job_id === input.id);
      if (job.state !== expected || reservation.units !== 1 || reservation.state !== (expected === "succeeded" ? "consumed" : "released")) {
        throw new Error(`Settlement mismatch: ${mode}`);
      }
    }
    if (jobs.find(job => job.id === `${run}-failure`).attempts !== 3) throw new Error("Retry bound not exercised");
    if (deliveries.filter(row => row.job_id === `${run}-success` && row.outcome === "ack").length < 7) throw new Error("Duplicate delivery not observed");
    if (!deliveries.some(row => row.job_id === `${run}-lost-ack` && row.attempt >= 2 && row.outcome === "ack")) throw new Error("Redelivery not observed");
    if (!deliveries.some(row => row.outcome === "enqueue-failed")) throw new Error("Enqueue failure not observed");
    if (sources.find(row => row.id === `${run}-delete-source`).deleted !== 1) throw new Error("Source was recreated");
  }
  return { run, phase, passed: phase === "verify", jobs, usage, results, deliveries, sources };
}
console.log(`async () => (${remoteProof.toString()})(${JSON.stringify(phase)}, ${JSON.stringify(run)})`);
