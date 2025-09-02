export type Verification = {
  _id: string;
  item_id: string; // ID of the item being verified
  user_id: string; // ID of the user performing the verification
  decision: {
    operational: number; // Duration in days
  } | "decommissioned"; // Decision made by the user
  note?: string;
  create_date: number;
};
export type VerificationResponse = {
  id: string;
  item_id: string; // ID of the item being verified
  item_name: string;
  user_id: string; // ID of the user performing the verification
  user_name: string;
  decision: Verification["decision"];
  note?: string;
  create_date: number;
};
export type VerificationRequest = {
  item_id: string; // ID of the item being verified
  decision: Verification["decision"];
  note?: string;
};