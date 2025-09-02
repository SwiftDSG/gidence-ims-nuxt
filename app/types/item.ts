export type ItemStatus = "decommissioned" | "operational";

export type Item = {
  _id: string;
  commodity_id: string;
  vendor_id?: string;
  code: string;
  state: ItemStatus;
  create_date: number;
};
export type ItemResponse = {
  id: string;
  commodity_id: string;
  commodity_name: string;
  vendor_id?: string;
  vendor_name?: string;
  code: string;
  state: ItemStatus;
  create_date: number;
};