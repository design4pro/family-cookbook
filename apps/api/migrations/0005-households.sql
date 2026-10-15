-- A household is the single cookbook boundary; billing ownership is separate.
CREATE TABLE households (
  id TEXT PRIMARY KEY NOT NULL,
  administrator_id TEXT REFERENCES user(id) ON DELETE SET NULL,
  closed INTEGER NOT NULL DEFAULT 0 CHECK (closed IN (0, 1))
);

CREATE TABLE household_invitations (
  id TEXT PRIMARY KEY NOT NULL,
  household_id TEXT NOT NULL REFERENCES households(id),
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  issued_by TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_by TEXT,
  revoked INTEGER NOT NULL DEFAULT 0 CHECK (revoked IN (0, 1))
);
CREATE INDEX household_pending_invitations ON household_invitations(household_id, revoked, expires_at);
CREATE INDEX member_import_jobs ON import_jobs(household_id, member_id, state);

CREATE TRIGGER household_member_capacity BEFORE INSERT ON household_members
WHEN EXISTS (SELECT 1 FROM households WHERE id = NEW.household_id)
BEGIN
  SELECT RAISE(ABORT, 'Household unavailable') WHERE
    (SELECT closed FROM households WHERE id = NEW.household_id) = 1
    OR (SELECT COUNT(*) FROM household_members WHERE household_id = NEW.household_id) >= 5;
END;

-- Fence work at removal, so rejoining cannot revive a previously authorized job.
CREATE TRIGGER household_member_removed AFTER DELETE ON household_members
BEGIN
  UPDATE import_jobs SET state = 'canceled', generation = generation + 1, token = NULL, lease_until = 0
    WHERE household_id = OLD.household_id AND member_id = OLD.member_id AND state IN ('pending', 'running');
  UPDATE usage_reservations SET state = 'released' WHERE state = 'reserved' AND job_id IN
    (SELECT id FROM import_jobs WHERE household_id = OLD.household_id AND member_id = OLD.member_id AND state = 'canceled');
  UPDATE household_invitations SET revoked = 1
    WHERE household_id = OLD.household_id AND issued_by = OLD.member_id AND consumed_by IS NULL;
  UPDATE households SET closed = 1, administrator_id = NULL WHERE id = OLD.household_id
    AND NOT EXISTS (SELECT 1 FROM household_members WHERE household_id = OLD.household_id);
END;
