export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  imagen?: string;
  idTipoUsuario: number;
}
