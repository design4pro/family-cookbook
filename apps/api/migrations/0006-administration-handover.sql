ALTER TABLE households ADD COLUMN administration_claimable INTEGER NOT NULL DEFAULT 0 CHECK (administration_claimable IN (0, 1));

CREATE TABLE household_reauthentication (
  session_id TEXT PRIMARY KEY NOT NULL REFERENCES session(id) ON DELETE CASCADE,
  household_id TEXT NOT NULL REFERENCES households(id),
  expires_at INTEGER NOT NULL
);
CREATE TABLE household_handovers (
  id TEXT PRIMARY KEY NOT NULL,
  household_id TEXT NOT NULL UNIQUE REFERENCES households(id),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  CHECK (sender_id != recipient_id)
);
CREATE TABLE household_administration_claimants (
  household_id TEXT NOT NULL REFERENCES households(id),
  member_id TEXT NOT NULL,
  PRIMARY KEY (household_id, member_id)
);
CREATE TABLE household_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id TEXT NOT NULL REFERENCES households(id),
  member_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('handover_requested', 'administrator_changed', 'administrator_deleted')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE INDEX member_household_notifications ON household_notifications(household_id, member_id, id);

CREATE TRIGGER handover_requested AFTER INSERT ON household_handovers
BEGIN
  INSERT INTO household_notifications (household_id, member_id, kind)
    VALUES (NEW.household_id, NEW.recipient_id, 'handover_requested');
END;

CREATE TRIGGER administration_membership_removed AFTER DELETE ON household_members
BEGIN
  DELETE FROM household_handovers WHERE household_id = OLD.household_id AND (sender_id = OLD.member_id OR recipient_id = OLD.member_id);
  DELETE FROM household_administration_claimants WHERE household_id = OLD.household_id AND member_id = OLD.member_id;
  DELETE FROM household_notifications WHERE household_id = OLD.household_id AND member_id = OLD.member_id;
  DELETE FROM household_reauthentication WHERE household_id = OLD.household_id
    AND session_id IN (SELECT id FROM session WHERE userId = OLD.member_id);
END;

-- Snapshot eligibility before the profile and its membership disappear. A NULL
-- administrator alone is not sufficient evidence that a household can be claimed.
CREATE TRIGGER administration_profile_deleted BEFORE DELETE ON user
BEGIN
  INSERT INTO household_administration_claimants (household_id, member_id)
    SELECT h.id, m.member_id FROM households h JOIN household_members m ON m.household_id = h.id
    WHERE h.administrator_id = OLD.id AND h.closed = 0 AND m.member_id != OLD.id;
  DELETE FROM household_members WHERE member_id = OLD.id;
  UPDATE households SET administrator_id = NULL, administration_claimable = 1
    WHERE administrator_id = OLD.id AND closed = 0;
END;

-- Role changes and per-member notifications share the same commit. Old requests,
-- grants and invitation links cannot revive when a former administrator returns.
CREATE TRIGGER administration_changed AFTER UPDATE OF administrator_id ON households
WHEN OLD.administrator_id IS NOT NEW.administrator_id
BEGIN
  DELETE FROM household_handovers WHERE household_id = NEW.id;
  DELETE FROM household_reauthentication WHERE household_id = NEW.id;
  DELETE FROM household_administration_claimants WHERE household_id = NEW.id AND NEW.administrator_id IS NOT NULL;
  UPDATE household_invitations SET revoked = 1 WHERE household_id = NEW.id AND consumed_by IS NULL AND issued_by = OLD.administrator_id;
  INSERT INTO household_notifications (household_id, member_id, kind)
    SELECT NEW.id, member_id, CASE WHEN NEW.administrator_id IS NULL THEN 'administrator_deleted' ELSE 'administrator_changed' END
    FROM household_members WHERE household_id = NEW.id AND NEW.closed = 0;
END;
