import { User } from "../../features/user/interfaces/user";

export interface LoginResponse {
  token: string;
  user: User;
}
