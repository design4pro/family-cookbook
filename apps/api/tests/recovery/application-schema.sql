CREATE TABLE recovery_manifest (id INTEGER PRIMARY KEY CHECK (id = 1), payload TEXT NOT NULL);
CREATE TABLE recovery_sessions (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, revoked INTEGER NOT NULL);
