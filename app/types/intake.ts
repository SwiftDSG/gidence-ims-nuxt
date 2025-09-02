import type { CommodityRequest } from "./commodity";
import type { VendorRequest } from "./vendor";

export type Intake = {
  _id: string;
  department_id: string;
  commodity: {
    new?: CommodityRequest;
    existing?: string;
  };
  vendor?: {
    new?: VendorRequest;
    existing?: string;
  }
  decision?: {
    accepted?: string; // ID of the user who accepted the intake
    rejected?: [string, string]; // ID of the user who rejected the intake and the reason for rejection
  }
  create_date: number;
  decision_date?: number;
};
export type IntakeResponse = {
  id: string;
  department_id: string;
  commodity: Intake["commodity"];
  vendor?: Intake["vendor"];
  decision?: Intake["decision"];
  create_date: number;
  decision_date?: number;
};
export type IntakeRequest = {
  department_id: string;
  commodity: Intake["commodity"];
  vendor?: Intake["vendor"];
};