import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoAlojamiento } from 'src/modules/shared/interfaces';
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
   * Método para obtener los alojamientos por usuario
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

    console.log('newAccommodationForm', newAccommodationForm);


    let formData = new FormData();
    formData.append('imagen', imageFile!, imageFile!.name);

    for (let key in newAccommodationForm) {
      formData.append(key, newAccommodationForm[key]);
    }

    console.log('formData', formData);


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
   * Método para editar un alojamiento con imagen
   * @param form - Formulario
   * @param imageFile - Imagen (File)
   * @returns devuelve un Observable de tipo Alojamiento
   */
  editAccommodationWithImage(form: FormGroup, imageFile: any) {
    const url = `${this.apiUrl}/alojamiento`;

    const { imagen, ...editAccomodationForm } = form.value;

    let formData = new FormData();
    formData.append('imagen', imageFile!, imageFile!.name);

    for (let key in editAccomodationForm) {
      formData.append(key, editAccomodationForm[key]);
    }

    if (!this.token) {
      return of();
    }

    return this.http.patch<Alojamiento>(url, formData, { headers: this.headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  /**
   * Método para editar un alojamiento sin imagen
   * @param form - Formulario
   * @returns devuelve un Observable de tipo Alojamiento
   */
  editAccommodationWithoutImage(form: FormGroup): Observable<Alojamiento | boolean> {
    const url = `${this.apiUrl}/alojamiento`;


    const { imagen, ...editAccomodationForm } = form.value;

    let formData = new FormData();

    for (let key in editAccomodationForm) {
      formData.append(key, editAccomodationForm[key]);
    }

    if (!this.token) {
      return of();
    }

    return this.http.patch<Alojamiento>(url, formData, { headers: this.headers }).pipe(
      catchError((err) => {
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
}
