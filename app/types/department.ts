export type Department = {
  _id: string;
  name: string;
};
export type DepartmentResponse = {
  id: string;
  name: string;
};
export type DepartmentRequest = {
  name: string;
};
export type DepartmentSummary = {
  id: string;
  name: string;
  commodity_count: number;
  commodity_count_empty: number;
  item_count: number;
  item_count_operational: number;
  item_count_decommissioned: number;
  item_count_non_compliant: number;
};