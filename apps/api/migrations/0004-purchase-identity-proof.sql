-- Billing references survive profile deletion; their production retention policy belongs to O02.
CREATE TABLE billing_payers (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT UNIQUE REFERENCES user(id) ON DELETE SET NULL
);

-- Designation is a server-owned household operation, not a checkout request field.
CREATE TABLE billing_households (
  household_id TEXT PRIMARY KEY NOT NULL,
  payer_user_id TEXT REFERENCES user(id) ON DELETE SET NULL
);

CREATE TABLE billing_purchase_intents (
  id TEXT PRIMARY KEY NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  organization_id TEXT NOT NULL,
  payer_id TEXT NOT NULL REFERENCES billing_payers(id),
  household_id TEXT NOT NULL REFERENCES billing_households(household_id)
);

CREATE TABLE billing_purchase_bindings (
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  organization_id TEXT NOT NULL,
  subscription_id TEXT NOT NULL,
  intent_id TEXT NOT NULL UNIQUE REFERENCES billing_purchase_intents(id),
  payer_id TEXT NOT NULL REFERENCES billing_payers(id),
  household_id TEXT NOT NULL REFERENCES billing_households(household_id),
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  PRIMARY KEY (environment, organization_id, subscription_id)
);

CREATE TABLE billing_entitlements (
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  household_id TEXT NOT NULL REFERENCES billing_households(household_id),
  organization_id TEXT NOT NULL,
  subscription_id TEXT NOT NULL,
  paid_through INTEGER NOT NULL,
  PRIMARY KEY (environment, household_id),
  FOREIGN KEY (environment, organization_id, subscription_id)
    REFERENCES billing_purchase_bindings(environment, organization_id, subscription_id)
);
