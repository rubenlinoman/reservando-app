import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // const router      = inject( Router );

  // if ( authService.authStatus() === AuthStatus.authenticated ) {
  //   return true;
  // }

  // // if ( authService.authStatus() === AuthStatus.checking ) {
  // //   return false;
  // // }

  // // const url = state.url;
  // // localStorage.setItem('url', url);
  // router.navigateByUrl('/auth/login');
  // return false;

  const apiUrl = environment.apiUrl;
  const url = `${apiUrl}/auth/check-token`;
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const http = inject(HttpClient);

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return http.get(url, { headers }).pipe(
    map((resp: any) => {
      if (resp.user.idTipoUsuario < 0 || resp.user.idTipoUsuario > 5) {
        return router.createUrlTree(['/']);
      } else {
        return true;
      }
    }),
    // Error
    catchError(() => {
      return of(router.createUrlTree(['/']));
    })
  );
};
