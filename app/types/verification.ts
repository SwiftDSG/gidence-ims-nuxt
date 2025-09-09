export type VerificationDecision = {
  operational: number; // Duration in days
} | "decommissioned";
export type Verification = {
  _id: string;
  item_id: string; // ID of the item being verified
  user_id: string; // ID of the user performing the verification
  decision: VerificationDecision;
  note?: string;
  create_date: number;
};
export type VerificationResponse = {
  id: string;
  item_id: string; // ID of the item being verified
  item_name: string;
  user_id: string; // ID of the user performing the verification
  user_name: string;
  decision: VerificationDecision;
  note?: string;
  create_date: number;
};
export type VerificationRequest = {
  item_id: string; // ID of the item being verified
  decision: VerificationDecision;
  note?: string;
};