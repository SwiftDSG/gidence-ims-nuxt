export type UserRole = "admin" | "user";
export type User = {
  _id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
};
export type UserResponse = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
};
export type UserRequest = {
  role: UserRole;
  name: string;
  email: string;
  password: string;
};