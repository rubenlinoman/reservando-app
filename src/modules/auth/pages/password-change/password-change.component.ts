import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { ActivatedRoute, Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import Swal from 'sweetalert2';

@Component({
  selector: 'auth-password-change',
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);
  private router = inject(Router);

  private token: string;

  public passChangeForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: [this.validatorsService.isFieldOneEqualFieldTwo('password', 'passwordConfirm')]
    }
  );

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el valor del token
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('Token:', this.token);
    });
  }

  /**
   * Metodo para cambiar la contraseña
   */
  async passChange(): Promise<void> {
    // Extraer el email del token
    const emailFromToken = this.getEmailFromToken(this.token);

    // Obtener el valor del campo password del formulario
    const newPassword = this.passChangeForm.get('password')?.value;

    // Verificar si el email se extrajo correctamente
    if (emailFromToken) {
      try {
        // Enviar solicitud al backend para cambiar la contraseña con el token y el correo electrónico
        await this.authService.passChange(this.token, emailFromToken, newPassword).toPromise();

        // Mostrar el SweetAlert de éxito
        await Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada con éxito',
          text: '¡Tu contraseña ha sido cambiada con éxito!',
          confirmButtonText: 'Ir al inicio de sesión',
          allowOutsideClick: false, // Evita que se cierre haciendo clic fuera del SweetAlert
        });

        // Después de hacer clic en "Ir al inicio de sesión", redirigir al login
        this.router.navigate(['/auth/login']);
      } catch (error) {
        Swal.fire('Error', error.message || 'Error al cambiar la contraseña', 'error');
      }
    } else {
      console.error('Error al extraer el email del token.');
    }
  }

  // Método para extraer el email del token
  private getEmailFromToken(token: string): string | null {
    try {
      // Decodificar el token
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken.email;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  /**
   * Método para comprobar si el campo es valido
   * @param field - Campo del formulario
   * @returns Devuelve el estado del campo
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.passChangeForm, field);
  }
}
