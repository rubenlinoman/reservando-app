import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthStatus, CheckTokenResponse, LoginResponse } from '../interfaces';
import { Usuario } from '../interfaces/user.interface';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<Usuario | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  /**
   * Método para establecer la autenticación
   * @param user - Objeto de tipo Usuario
   * @param token  - Token (string)
   * @returns devuelve un boolean
   */
  private setAuthentication(user: Usuario, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  /**
   * Método para iniciar sesión
   * @param email - Email del usuario (string)
   * @param password - Password del usuario (string)
   * @returns devuelve un Observable de tipo boolean
   */
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  registerUser(form: FormGroup): Observable<boolean> {
    const { password2: _, email2: _a, tipoUsuario: tipoUsuarioStr, ...sendForm } = form.value;
    const tipoUsuarioInt = Number(tipoUsuarioStr);

    return this.http
      .post<CheckTokenResponse>(`${this.apiUrl}/auth/register`, {
        idTipoUsuario: tipoUsuarioInt,
        ...sendForm
      })
      .pipe(
        map(({ user, token }) => this.setAuthentication(user, token)),
        catchError((err) => throwError(() => err.error.message))
      );
  }

  /**
   * Método para comprobar el estado de la autenticación
   * @returns devuelve un Observable de tipo boolean
   */
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  /**
   * Método para cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  /**
   * Método para reestablecer la contraseña
   * @param email - Email del usuario (string)
   * @param baseUrl - Url base (string)
   * @returns
   */
  passwordRecovery(email: string, baseUrl: string) {
    const url = `${this.apiUrl}/auth/password-recovery`;
    const passRecoveryRequest = { email: email, baseUrl: baseUrl };

    return this.http.post(url, passRecoveryRequest)
      .pipe(
        catchError(err => throwError(() => err.error.message))
    )
  }

  /**
   * Método para cambiar la contraseña
   * @param token - Token de verificación (string)
   * @param email - Email del usuario (string)
   * @param newPassword - Nueva contraseña (string)
   * @returns Devuelve un Observable de tipo boolean
   */
  passChange(token: string, email: string, newPassword: string) {
    const url = `${this.apiUrl}/auth/password-change`;

    const passChangeRequest = { token, email, newPassword };

    return this.http.patch(url, passChangeRequest)
      .pipe(
        catchError(err => throwError(() => err.error.message))
    );
  }
}
