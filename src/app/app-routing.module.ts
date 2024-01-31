import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from 'src/modules/auth/guards';


const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('../modules/auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('../modules/dashboard/dashboard.module').then( m => m.DashboardModule)
  },
  {
    path: '',
    loadChildren: () => import('../modules/web/web.module').then( m => m.WebModule)
  },
  {
    path: '**',
    loadChildren: () => import('../modules/web/web.module').then( m => m.WebModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
