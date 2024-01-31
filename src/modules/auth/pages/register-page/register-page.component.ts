import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'auth-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm: FormGroup = this.fb.group(
    {
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
      tipoUsuario: ['', Validators.required]
    },
    {
      validators: [
        this.validatorsService.isFieldOneEqualFieldTwo('pass', 'pass2'),
        this.validatorsService.isFieldOneEqualFieldTwo('mail', 'mail2')
      ]
    }
  );

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.registerForm, field );
  }

  register() {

    this.authService.registerUser(this.registerForm)
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard/default'),
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      });
  }
}
