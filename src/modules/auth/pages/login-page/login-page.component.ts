import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'auth-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm: FormGroup = this.fb.group({
    email: ['rubenlinomandado@gmail.com', [Validators.required, Validators.email]],
    password: ['abc123.', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
    .subscribe({
      next: () => this.router.navigate(['/admin/default']),
      error: (message) => {
        Swal.fire('Error', message, 'error');
      }
    });
  }
}
