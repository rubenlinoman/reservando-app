import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/modules/auth/interfaces';
import { EstadoReserva, Habitacion, Reserva, TipoAlojamiento, TipoHabitacion } from 'src/modules/shared/interfaces';
import { Alojamiento } from 'src/modules/shared/interfaces/alojamiento.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private token = localStorage.getItem('token');
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor() {}

  /**
   * Método para obtener todos los alojamientos
   * @returns devuelve un Observable de tipo Alojamiento
   */
  getAllAccommodations(): Observable<Alojamiento[]> {
    const url = `${this.apiUrl}/alojamiento`;
    if (!this.token) {
      return of([]);
    }
    return this.http.get<Alojamiento[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener los alojamientos por usuario (o todos si es admin)
   * @param idUsuario - ID del usuario (number)
   * @param idTipoUsuario - ID del tipo de usuario (number)
   * @returns devuelve un Observable de tipo Alojamiento
   */
  getAccommodationsByUser(idUsuario: number, idTipoUsuario: number): Observable<Alojamiento[]> {
    const url = `${this.apiUrl}/alojamiento/${idUsuario}/${idTipoUsuario}`;

    if (!this.token) {
      return of([]);
    }

    return this.http.get<Alojamiento[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener los alojamientos por ID
   * @param idAlojamiento - ID del alojamiento (number)
   * @returns devuelve un Observable de tipo Alojamiento
   */
  getAccommodationById(idAlojamiento: number): Observable<Alojamiento> {
    const url = `${this.apiUrl}/alojamiento/${idAlojamiento}`;

    if (!this.token) {
      return of();
    }

    return this.http.get<Alojamiento>(url, { headers: this.headers }).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para crear un nuevo alojamiento
   * @param form - Formulario
   * @param imageFile - Imagen (File)
   * @returns devuelve un Observable de tipo Alojamiento
   */
  newAccomodation(form: FormGroup, imageFile: any): Observable<Alojamiento> {
    const url = `${this.apiUrl}/alojamiento`;

    const { imagen, ...newAccommodationForm } = form.value;

    let formData = new FormData();
    formData.append('imagen', imageFile!, imageFile!.name);

    for (let key in newAccommodationForm) {
      formData.append(key, newAccommodationForm[key]);
    }

    if (!this.token) {
      return of();
    }

    return this.http.post<Alojamiento>(url, formData, { headers: this.headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para obtener los tipos de alojamientos
   * @returns devuelve un Observable de tipo TipoAlojamiento
   */
  getAccommodationTypes(): Observable<TipoAlojamiento[]> {
    const url = `${this.apiUrl}/alojamiento/tipos`;

    if (!this.token) {
      return of([]);
    }

    return this.http.get<TipoAlojamiento[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener todas las habitaciones
   * @returns devuelve un Observable de tipo Habitacion
   */
  getAllRooms(): Observable<Habitacion[]> {
    const url = `${this.apiUrl}/habitacion`;
    if (!this.token) {
      return of([]);
    }
    return this.http.get<Habitacion[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener una habitacion por ID
   * @param idHabitacion - ID de la habitacion (number)
   * @returns devuelve un Observable de tipo Habitacion
   */
  getRoomById(idHabitacion: number): Observable<Habitacion> {
    const url = `${this.apiUrl}/habitacion/${idHabitacion}`;

    if (!this.token) {
      return of();
    }

    return this.http.get<Habitacion>(url, { headers: this.headers }).pipe(
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

    if (!this.token) {
      return of();
    }

    return this.http.get<Habitacion[]>(url, { headers: this.headers }).pipe(
      catchError(() => {
        return of();
      })
    );
  }

  /**
   * Método para obtener los tipos de habitaciones
   * @returns devuelve un Observable de tipo TipoHabitacion
   */
  getRoomTypes(): Observable<TipoHabitacion[]> {
    const url = `${this.apiUrl}/habitacion/tipos/todos`;

    if (!this.token) {
      return of([]);
    }

    return this.http.get<TipoHabitacion[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para editar un alojamiento
   * @param form - Formulario
   * @param imageFile  - Imagen
   * @returns devuelve un Observable de tipo Alojamiento
   */
  editAccommodation(form: FormGroup, imageFile: any) {
    const url = `${this.apiUrl}/alojamiento`;

    // Extraer la imagen del formulario
    const imagen = form.get('imagen')?.value;

    // Crear un FormData para la solicitud
    const formData = new FormData();

    // Agregar la imagen al FormData si se proporciona
    if (imageFile && imagen) {
      formData.append('imagen', imageFile, imageFile.name);
    }

    // Agregar los otros campos del formulario al FormData
    const editAccommodationForm = { ...form.value };
    delete editAccommodationForm.imagen; // Eliminar la imagen del objeto editRoomForm
    for (const key in editAccommodationForm) {
      formData.append(key, editAccommodationForm[key]);
    }

    // Enviar la solicitud PATCH al backend
    return this.http.patch<Alojamiento>(url, formData, { headers: this.headers }).pipe(
      catchError((err) => {
        console.error(err);

        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para editar una reserva
   * @param form - Formulario
   * @returns devuelve un Observable de tipo Reserva
   */
  editReservation(form: FormGroup) {
    const url = `${this.apiUrl}/reserva`;
    return this.http.patch<Reserva>(url, form.value, { headers: this.headers }).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para eliminar un alojamiento
   * @param idAlojamiento - ID del alojamiento (number)
   * @returns devuelve un Observable de tipo Boolean
   */
  deleteAccommodation(idAlojamiento: number) {
    if (!this.token) {
      return of(false);
    }

    return this.http.delete<boolean>(`${this.apiUrl}/alojamiento/${idAlojamiento}`, { headers: this.headers });
  }

  /**
   * Método para crear un nuevo alojamiento
   * @param form - Formulario
   * @param imageFile - Imagen (File)
   * @returns devuelve un Observable de tipo Alojamiento
   */
  newRoom(form: FormGroup, imageFile: any): Observable<Habitacion> {
    const url = `${this.apiUrl}/habitacion`;

    const { imagen, ...newRoomForm } = form.value;

    let formData = new FormData();
    formData.append('imagen', imageFile!, imageFile!.name);

    for (let key in newRoomForm) {
      formData.append(key, newRoomForm[key]);
    }

    if (!this.token) {
      return of();
    }

    return this.http.post<Habitacion>(url, formData, { headers: this.headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para editar una habitación
   * @param form - Formulario
   * @param imageFile  - Imagen
   * @returns devuelve un Observable de tipo Habitacion
   */
  editRoom(form: FormGroup, imageFile: any) {
    const url = `${this.apiUrl}/habitacion`;

    // Extraer la imagen del formulario
    const imagen = form.get('imagen')?.value;

    // Crear un FormData para la solicitud
    const formData = new FormData();

    // Agregar la imagen al FormData si se proporciona
    if (imageFile && imagen) {
      formData.append('imagen', imageFile, imageFile.name);
    }

    // Agregar los otros campos del formulario al FormData
    const editRoomForm = { ...form.value };
    delete editRoomForm.imagen; // Eliminar la imagen del objeto editRoomForm
    for (const key in editRoomForm) {
      formData.append(key, editRoomForm[key]);
    }

    // Enviar la solicitud PATCH al backend
    return this.http.patch<Habitacion>(url, formData, { headers: this.headers }).pipe(
      catchError((err) => {
        console.error(err);

        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para eliminar una habitacion
   * @param idHabitacion - ID de la habitacion (number)
   * @returns devuelve un Observable de tipo Boolean
   */
  deleteRoom(idHabitacion: number) {
    if (!this.token) {
      return of(false);
    }

    return this.http.delete<boolean>(`${this.apiUrl}/habitacion/${idHabitacion}`, { headers: this.headers });
  }

  /**
   * Método para obtener las reservas de un propietario (o todas si es admin)
   * @param idPropietario - ID del propietario
   * @param idTipoUsuario - ID del tipo de usuario
   * @returns devuelve un Observable de tipo Reserva
   */
  getReservationsByOwner(idPropietario: number, idTipoUsuario: number): Observable<Reserva[]> {
    const url = `${this.apiUrl}/reserva/propietario/${idPropietario}/${idTipoUsuario}`;

    if (!this.token) {
      return of([]);
    }

    return this.http.get<Reserva[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener las reservas de un usuario (cliente)
   * @param idUsuario - ID del usuario
   * @returns devuelve un Observable de tipo Reserva
   */
  getReservationsByUser(idUsuario: number): Observable<Reserva[]> {
    const url = `${this.apiUrl}/reserva/usuario/${idUsuario}`;

    if (!this.token) {
      return of([]);
    }

    return this.http.get<Reserva[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener todas las reservas
   * @returns - Observable de tipo EstadoReserva
   */
  getReservationStatus(): Observable<EstadoReserva[]> {
    const url = `${this.apiUrl}/reserva/estados`;

    if (!this.token) {
      return of([]);
    }

    return this.http.get<EstadoReserva[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para obtener una reserva
   * @param idReserva - ID de la reserva
   * @returns devuelve un Observable de tipo Reserva
   */
  getReservationById(idReserva: number): Observable<Reserva> {
    const url = `${this.apiUrl}/reserva/${idReserva}`;

    if (!this.token) {
      return of();
    }

    return this.http.get<Reserva>(url, { headers: this.headers }).pipe(
      catchError(() => {
        return of();
      })
    );
  }

    /**
   * Método para obtener un usuario
   * @param idUsuario - ID del usuario
   * @returns devuelve un Observable de tipo Usuario
   */
    getUserById(idUsuario: number): Observable<Usuario> {
      const url = `${this.apiUrl}/usuario/${idUsuario}`;

      if (!this.token) {
        return of();
      }

      return this.http.get<Usuario>(url, { headers: this.headers }).pipe(
        catchError(() => {
          return of();
        })
      );
    }

  /**
   * Método para cargar una imagen
   * @param imagen - Imagen
   * @returns devuelve un Observable de tipo any
   */
  chargeImage(imagen: any): Observable<any> {
    const url = `${this.apiUrl}/usuario/imagen`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let formData = new FormData();

    formData.append('imagen', imagen!, imagen!.name);

    return this.http.post(url, formData, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error.error.message);
      })
    );
  }

  /**
   * Método para actualizar la información del usuario
   * @param actualizar - Objeto con los datos a actualizar
   * @param idUsuario - ID del usuario
   * @returns devuelve un Observable de tipo any
   */
  updateProfileInfo(actualizar: object, idUsuario: number): Observable<any> {
    const url = `${this.apiUrl}/usuario`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('actualizar', actualizar);


    return this.http.patch(url, { ...actualizar, idUsuario }, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para cambiar la contraseña
   * @param email - Email del usuario
   * @param newPassword - Nueva contraseña
   * @returns devuelve un Observable de tipo boolean
   */
  resetPassword(email: string, newPassword: string) {
    const url = `${this.apiUrl}/usuario/reset-password`;

    const passChangeRequest = { email, newPassword };

    return this.http.patch(url, passChangeRequest)
      .pipe(
        catchError(err => throwError(() => err.error.message))
    );
  }

  /**
   * Método para obtener todos los usuarios
   * @returns devuelve un Observable de tipo Usuario
   */
  getAllUsers(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/usuario`;
    if (!this.token) {
      return of([]);
    }
    return this.http.get<Usuario[]>(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
   * Método para borrar un usuario
   * @param id - ID del usuario
   * @returns devuelve un Observable de tipo any
   */
  deleteUser(id: number) {
    const url = `${this.apiUrl}/usuario/${id}`;
    if (!this.token) {
      return of([]);
    }
    return this.http.delete(url, { headers: this.headers }).pipe(catchError((error) => of(undefined)));
  }

  /**
 * Método para actualizar el campo Pass en el _admin de Usuarios
 * @param idUsuario - ID del usuario
 * @param mail - Mail del usuario
 * @param password - Nueva contraseña
 * @returns Observable que emite un valor 1 indicando si se ha actualizado correctamente
 */
  updateUserPass( idUsuario: number, email: string, password: string ): Observable<any> {
    const url = `${ this.apiUrl }/usuario/editarPass`;

    if( !this.token ) {
      return of(false);
    };

    const updateUserPass = { idUsuario: idUsuario, email: email, password: password };
    console.log(updateUserPass);

    return this.http.patch(url, updateUserPass , { headers: this.headers } )
      .pipe(
        catchError(err => {
          return throwError(() => err.error.message)
        })
      );
  }
}
