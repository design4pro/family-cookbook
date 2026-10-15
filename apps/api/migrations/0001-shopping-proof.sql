CREATE TABLE household_members (
  household_id TEXT NOT NULL,
  member_id TEXT NOT NULL UNIQUE,
  PRIMARY KEY (household_id, member_id)
);

CREATE TABLE shopping_lists (
  id TEXT PRIMARY KEY NOT NULL,
  household_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE UNIQUE INDEX one_active_shopping_list
  ON shopping_lists(household_id) WHERE active = 1;

CREATE TABLE shopping_items (
  id TEXT PRIMARY KEY NOT NULL,
  list_id TEXT NOT NULL REFERENCES shopping_lists(id),
  revision INTEGER NOT NULL CHECK (revision >= 0),
  purchased INTEGER NOT NULL CHECK (purchased IN (0, 1)),
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE TABLE shopping_operations (
  household_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  list_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  expected_revision INTEGER NOT NULL,
  desired_state INTEGER NOT NULL CHECK (desired_state IN (0, 1)),
  status TEXT NOT NULL CHECK (status IN ('accepted', 'conflict', 'unavailable')),
  revision INTEGER,
  purchased INTEGER CHECK (purchased IN (0, 1)),
  PRIMARY KEY (household_id, member_id, operation_id),
  CHECK (
    (status = 'unavailable' AND revision IS NULL AND purchased IS NULL)
    OR (status IN ('accepted', 'conflict') AND revision IS NOT NULL AND purchased IS NOT NULL)
  )
);
