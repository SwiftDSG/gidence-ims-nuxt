export type TableColor = "success" | "warning" | "error" | "primary" | "secondary";
export type TableConfig = {
  color?: TableColor;
  condition?: {
    threshold: number;
    true: TableColor;
    false: TableColor;
  }
}
export type TableOption = {
  // Each property, should have a same length, including header, data and config, each index represents a column
  header: string[];
  data: (number | string)[][];
  config: TableConfig[];
};