CREATE TABLE allowance_windows (
  id TEXT PRIMARY KEY NOT NULL,
  household_id TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity >= 0)
);

CREATE TABLE import_sources (
  id TEXT PRIMARY KEY NOT NULL,
  household_id TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE TABLE import_jobs (
  id TEXT PRIMARY KEY NOT NULL,
  household_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  window_id TEXT NOT NULL REFERENCES allowance_windows(id),
  units INTEGER NOT NULL CHECK (units > 0),
  state TEXT NOT NULL CHECK (state IN ('pending', 'running', 'succeeded', 'failed', 'canceled')),
  generation INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  token TEXT,
  lease_until INTEGER NOT NULL DEFAULT 0,
  dispatch_after INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX dispatchable_jobs ON import_jobs(state, dispatch_after);
CREATE INDEX expired_jobs ON import_jobs(state, lease_until);

CREATE TABLE usage_reservations (
  job_id TEXT PRIMARY KEY NOT NULL REFERENCES import_jobs(id),
  window_id TEXT NOT NULL REFERENCES allowance_windows(id),
  units INTEGER NOT NULL CHECK (units > 0),
  state TEXT NOT NULL CHECK (state IN ('reserved', 'consumed', 'released'))
);
CREATE INDEX window_usage ON usage_reservations(window_id, state);

CREATE TABLE import_results (
  job_id TEXT PRIMARY KEY NOT NULL REFERENCES import_jobs(id),
  content TEXT NOT NULL
);
