export type Vendor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};
export type VendorResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};
export type VendorRequest = {
  name: string;
  email: string;
  phone: string;
  address: string;
};