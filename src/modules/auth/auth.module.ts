import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PasswordChangeComponent } from './pages/password-change/password-change.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    ForgotPasswordComponent,
    LoginPageComponent,
    PasswordChangeComponent,
    RegisterPageComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthModule {}
