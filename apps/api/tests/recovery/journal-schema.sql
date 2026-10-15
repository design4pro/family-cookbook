CREATE TABLE deletion_journal (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL UNIQUE,
  requested_at INTEGER NOT NULL,
  active_purged_at INTEGER
);
CREATE TABLE recovery_control (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  phase TEXT NOT NULL CHECK (phase IN ('closed', 'verified')),
  epoch INTEGER NOT NULL,
  replayed_sequence INTEGER NOT NULL
);
INSERT INTO recovery_control VALUES (1, 'closed', 0, 0);
CREATE TABLE proof_audits (phase TEXT PRIMARY KEY, payload TEXT NOT NULL);
