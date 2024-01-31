import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'
import { ValidatorsService } from 'src/modules/shared/services/validators.service';


@Component({
  selector: 'auth-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);
  private router = inject(Router);

  public loginForm: FormGroup = this.fb.group({
    email: ['rubenlinomandado@gmail.com', [Validators.required, Validators.email]],
    password: ['abc123.', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
    .subscribe({
      next: () => this.router.navigate(['/dashboard/default']),
      error: (message) => {
        Swal.fire('Error', message, 'error');
      }
    });
  }

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.loginForm, field );
  }
}
