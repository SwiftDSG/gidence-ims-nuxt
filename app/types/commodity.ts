export type Commodity = {
  _id: string;
  department_id: string;
  category_id: string;
  name: string;
  code: string;
  specification: {
    label: string;
    value: string;
  }[];
};
export type CommodityResponse = {
  id: string;
  department_id: string;
  department_name: string;
  category_id: string;
  category_name: string;
  quantity: number;
  name: string;
  code: string;
  specification: {
    label: string;
    value: string;
  }[];
};
export type CommodityRequest = {
  department_id: string;
  category_id: string;
  name: string;
  specification: {
    label: string;
    value: string;
  }[];
};