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
   * Método para crear un nuevo alojamiento
   * @param form - Formulario
   * @returns devuelve un Observable de tipo Alojamiento
   */
  newAccomodation(form: FormGroup): Observable<Alojamiento | boolean> {
    const url = `${this.apiUrl}/alojamiento`;

    const body = {
      ...form.value
    };

    if (!this.token) {
      return of(false);
    }

    return this.http.post<Alojamiento>(url, body, { headers: this.headers }).pipe(
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
    };

    return this.http.get<TipoAlojamiento[]>(url, { headers: this.headers })
      .pipe(
        catchError(error => of(undefined))
      );
  }
}
