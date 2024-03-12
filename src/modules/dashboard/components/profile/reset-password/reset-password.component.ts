import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from 'src/modules/dashboard/services/dashboard.service';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);

  public user = computed(() => this.authService.currentUser());

  public passChangeForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: [this.validatorsService.isFieldOneEqualFieldTwo('password', 'passwordConfirm')]
    }
  );

  constructor() {}


  /**
   * Metodo para cambiar la contraseña
   */
  async resetPassword(): Promise<void> {
    // Obtener el valor del campo password del formulario
    const newPassword = this.passChangeForm.get('password')?.value;

    this.dashboardService.resetPassword(this.user().email, newPassword).subscribe(() => {
      Swal.fire('Contraseña cambiada', 'Su contraseña ha sido cambiada con exito', 'success');
    });

  }

  // Método para extraer el email del token

  /**
   * Método para comprobar si el campo es valido
   * @param field - Campo del formulario
   * @returns Devuelve el estado del campo
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.passChangeForm, field);
  }
}
