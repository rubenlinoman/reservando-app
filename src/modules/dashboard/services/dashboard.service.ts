import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Alojamiento } from 'src/modules/shared/interfaces/alojamiento.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private token = localStorage.getItem('token');
  private headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.token}`);

  constructor() { }

  /**
   * Metodo para obtener los alojamientos
   * @returns Devuelve un Observable de tipo Alojamiento
   */
  getAccommodationsByUser(idUsuario: number): Observable<Alojamiento[]> {
    const url = `${this.apiUrl}/alojamiento/${idUsuario}`;

    if (!this.token) {
      return of([]);
    };

    return this.http.get<Alojamiento[]>(url, { headers: this.headers })
      .pipe(
        catchError(error => of(undefined))
      );
  }
}
