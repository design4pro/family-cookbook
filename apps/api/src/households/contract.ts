export interface Household {
  id: string;
  administratorId: string | null;
  payerId: string | null;
  members: { id: string; email: string }[];
  invitations: { id: string; email: string; expiresAt: number }[];
  handover: { id: string; senderId: string; recipientId: string; expiresAt: number } | null;
  canClaimAdministration: boolean;
  notifications: { id: number; kind: "handover_requested" | "administrator_changed" | "administrator_deleted"; createdAt: number }[];
}

export interface HouseholdSnapshot { userId: string; household: Household | null }
