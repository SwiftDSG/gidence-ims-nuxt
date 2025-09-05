export type UserRole = {
  user: string
} | "admin";
export type User = {
  _id: string;
  role: UserRole;
  name: string;
  username: string;
  password: string;
};
export type UserResponse = {
  id: string;
  role: UserRole;
  name: string;
  username: string;
};
export type UserRequest = {
  role: UserRole;
  name: string;
  username: string;
  password: string;
};