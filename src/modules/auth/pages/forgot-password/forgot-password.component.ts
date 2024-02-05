import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private readonly baseUrl = environment.baseUrl;

  public forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.forgotPasswordForm, field );
  }

  /**
   * Método para reestablecer la contraseña
   */
  passwordRecovery() {
    const { email } = this.forgotPasswordForm.value;

    this.authService.passwordRecovery(email, this.baseUrl)
      .subscribe({
        next: response => {
          if (!response) {
            Swal.fire('Error', 'No se pudo reestablecer la contraseña', 'error');
          } else {
            Swal.fire({
              title: '¡Correo enviado!',
              text: 'Se ha enviado un correo para reestablecer la contraseña',
              icon: 'success',
              showConfirmButton: true,
              showDenyButton: false,
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                // this.forgotPasswordForm.reset();
                console.log('El correo ha sido enviado');
              }
            })
          }
        }
      })
  }
}
