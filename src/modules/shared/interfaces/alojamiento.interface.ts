export interface Alojamiento {
  idAlojamiento: number;
  nombreAlojamiento: string;
  descripcion: string;
  capacidad: number;
  direccion: string;
  ciudad: string;
  imagen: string;
  idTipoAlojamiento: number;
  idPropietario: number;
  precio?: string;
  enOferta?: boolean;
}
