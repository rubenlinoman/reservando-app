import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Alojamiento, Habitacion, TipoHabitacion } from 'src/modules/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Método para obtener todos los alojamientos sin verificar el token
   * @returns devuelve un Observable de tipo Alojamiento[]
   */
  getAllAccommodationsNoTokenCheck(): Observable<Alojamiento[]> {
    const url = `${this.apiUrl}/alojamiento/home`;
    return this.http.get<Alojamiento[]>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener los alojamientos:', error);
        return of([]);
      })
    );
  }

  /**
   * Método para obtener un alojamiento por ID
   * @param idAlojamiento - ID del alojamiento (number)
   * @returns devuelve un Observable de tipo Alojamiento
   */
  getAccommodationById(idAlojamiento: number): Observable<Alojamiento> {
    const url = `${this.apiUrl}/alojamiento/${idAlojamiento}`;

    return this.http.get<Alojamiento>(url).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para obtener las habitaciones de un alojamiento
   * @param idAlojamiento - ID del alojamiento (number)
   * @returns devuelve un Observable de tipo Habitacion
   */
  getRoomsByAccommodationId(idAlojamiento: number): Observable<Habitacion[]> {
    const url = `${this.apiUrl}/habitacion/alojamiento/${idAlojamiento}`;

    return this.http.get<Habitacion[]>(url).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para obtener los tipos de habitaciones de un alojamiento
   * @param idAlojamiento - ID del alojamiento (number)
   * @returns devuelve un Observable de tipo TipoHabitacion
   */
  getRoomTypesByAccommodationId(idAlojamiento: number): Observable<TipoHabitacion[]> {
    const url = `${this.apiUrl}/alojamiento/tipos-habitacion/${idAlojamiento}`;

    return this.http.get<TipoHabitacion[]>(url).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para obtener las habitaciones disponibles
   * @param fechaInicio - Fecha de inicio (string)
   * @param fechaFin - Fecha de fin (string)
   * @param idAlojamiento - ID del alojamiento
   * @returns devuelve un Observable de tipo Habitacion
   */
  getAvailableRooms(fechaInicio: string, fechaFin: string, idAlojamiento: number): Observable<Habitacion[]> {
    const url = `${this.apiUrl}/habitacion/disponibles/tipos/${fechaInicio}/${fechaFin}/${idAlojamiento}`;

    return this.http.get<Habitacion[]>(url).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para obtener las habitaciones disponibles por tipo de habitación y alojamiento
   * @param fechaInicio - Fecha de inicio (string)
   * @param fechaFin - Fecha de fin (string)
   * @param idAlojamiento - ID del alojamiento
   * @param idTipoHabitacion - ID del tipo de habitación
   * @returns devuelve un Observable de tipo Habitacion
   */
  getAvailableRoomsByAccommodationAndRoomTypeId(
    fechaInicio: string,
    fechaFin: string,
    idAlojamiento: number,
    idTipoHabitacion: number
  ): Observable<Habitacion[]> {
    const url = `${this.apiUrl}/habitacion/disponibles/tipos/${fechaInicio}/${fechaFin}/${idAlojamiento}/${idTipoHabitacion}`;

    return this.http.get<Habitacion[]>(url).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para crear una nueva reserva
   * @param reservaData - Datos de la reserva
   * @returns devuelve un Observable de tipo any
   */
  createReservation(reservaData: any): Observable<any> {
    console.log('Reserva:', reservaData);

    return this.http.post<any>(`${this.apiUrl}/reserva`, reservaData);
  }
}
