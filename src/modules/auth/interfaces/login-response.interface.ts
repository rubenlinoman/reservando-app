import { Usuario } from "./user.interface";

export interface LoginResponse {
  user: Usuario;
  token: string;
}
