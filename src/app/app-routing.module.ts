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
    path: 'admin',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('../modules/admin/admin.module').then( m => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
