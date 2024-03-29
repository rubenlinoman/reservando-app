export interface Habitacion {
  idHabitacion: number;
  nombreHabitacion: string;
  descripcion: string;
  capacidad: number;
  precio: string;
  enOferta: boolean;
  descuento: string;
  imagen?: string;
  idAlojamiento: number;
  idTipoHabitacion: number;
  cantidadDisponible?: number;
  nombreTipoHabitacion?: string;
  availableRoomTypes?: Habitacion[];
  selectedRoom?: {
    quantity: number;
    totalPrice: number;
  };
  selectedRoomTypes?: Habitacion[];
}
