import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router      = inject( Router );

  if ( authService.authStatus() === AuthStatus.authenticated ) {
    router.navigateByUrl('/admin/default');
    return false;
  }

  return true;

  // const apiUrl = environment.apiUrl;
  // const url = `${ apiUrl }/auth/check-token`;
  // const token = localStorage.getItem('token');
  // const router = inject( Router );
  // const http = inject(HttpClient);

  // if ( !token ) {
  //   return true;
  // };

  // const headers = new HttpHeaders()
  //   .set('Authorization', `Bearer ${ token }`);

  // return http.get(url, { headers })
  //   .pipe(
  //     map( (resp: any) => {
  //       return router.createUrlTree(['/admin/default']);
  //     } ),
  //     // Error
  //     catchError( (error: any) => {
  //       return of(true)
  //     } )
  //   )
};
