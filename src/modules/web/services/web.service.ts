import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Alojamiento } from 'src/modules/shared/interfaces';

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
   * Método para obtener los alojamientos por ID
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
}
