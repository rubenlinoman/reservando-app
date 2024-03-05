export interface Reserva {
  idReserva?: number;
  idUsuario: number;
  nombreUsuario: string;
  apellidosUsuario: string;
  idTipoUsuario: number;
  idAlojamiento: number;
  nombreAlojamiento: string;
  idPropietario?: number;
  idHabitacion: number;
  nombreHabitacion: string;
  nombreEstadoReserva: string;
  fechaInicio: string;
  fechaFin: string;
  idEstadoReserva: number;
}
