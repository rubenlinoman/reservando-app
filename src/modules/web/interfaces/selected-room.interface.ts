import { Habitacion } from "src/modules/shared/interfaces";

export interface SelectedRoom {
  nombreTipoHabitacion: string;
  idTipoHabitacion: number;
  cantidadDisponible: number;
  precio: string;
  capacidad: number;
  selectedRoom: {
      quantity: number;
      totalPrice: number;
  };
  selectedRoomTypes: Habitacion[];
}
