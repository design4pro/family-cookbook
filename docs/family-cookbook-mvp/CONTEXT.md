# Family cookbook

A private shared collection of family recipes used by people with separate accounts. This glossary records vocabulary from the accepted household, experience and payment contracts. The final implementation specification defines the behavior.

## Language

**Household**:
The group sharing a private family cookbook, comprising up to five people in total.
_Avoid_: Shared account

**Cookbook**:
The private collection of recipes shared within a household.
_Avoid_: Public recipe catalog

**Member**:
A person participating in the household through their own account; the payer also counts toward the household size.
_Avoid_: Device, seat purchase

**Payer**:
The single person paying for the household's shared service.
_Avoid_: Every member as a separate subscriber

**Source**:
An original recipe photograph or recording retained separately from editable recipe instructions.
_Avoid_: AI reconstruction

**Recipe draft**:
A candidate recipe awaiting a household member's review and explicit save; it is not yet a source for cookbook answers.
_Avoid_: Approved recipe

**Approved recipe**:
A recipe explicitly reviewed and saved by a household member; approval may preserve marked unknown quantities or times.
_Avoid_: AI-verified recipe

**Shopping list**:
The household's shared active list of recipe-derived and manually entered shopping items.
_Avoid_: Pantry inventory

**Purchased state**:
Whether a shopping item is marked as bought; members can change this state without an internet connection.
_Avoid_: Stock quantity

**Pending shopping change**:
A member's locally saved purchased-state change that has not yet received a final synchronization outcome. It remains visibly pending until accepted or reconciled with the shared list.
_Avoid_: Shared purchase confirmation

**Family plan**:
The paid household service shared by up to five people, with one payer and the same feature set under monthly or annual billing.
_Avoid_: Per-member subscription

**Sample**:
One-time quota-limited access used to try the household service without a payment card or trial countdown.
_Avoid_: Automatically renewing trial

**Archive**:
The household's access state after paid service expires, preserving existing recipes, sources, reading, cooking and export while restricting new creation and AI. Existing shopping items remain checkable.
_Avoid_: Deleted cookbook

**Cookbook administrator**:
The household member responsible for membership and administrative succession. This role does not imply authorship of all recipes or payment responsibility.
_Avoid_: Owner of all family content

**Administrator handover**:
An explicit transfer of cookbook administration accepted by an existing member; it leaves content attribution and subscriptions unchanged.
_Avoid_: Subscription transfer

**Payer replacement**:
A new member's explicit purchase for the same household after the old payer's entitlement expires, preserving the book and existing allowance history.
_Avoid_: Card transfer
