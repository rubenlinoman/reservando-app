import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { DashboardService } from '../services/dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-edit-user-pass',
  templateUrl: './edit-user-pass.component.html',
  styleUrl: './edit-user-pass.component.css',
})
export class EditUserPassComponent {
  private idUsuario: number;
  private email: string;
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  public passChangeForm: FormGroup;
  private dashboardService = inject(DashboardService);

  // Definir hide como verdadero por defecto para ocultar la contraseña
  hide: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<EditUserPassComponent>
  ) {
    this.idUsuario = data['idUsuario'];
    this.email = data['email'];
    this.passChangeForm = this.fb.group({
      email: [{ value: this.email, disabled: true }, [Validators.required]],
      password: ['', [Validators.required]],
    });

  }


  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.passChangeForm, field );
  }

  /**
   * Método para actualizar la contraseña de un usuario registrado
   */
  passChange() {
    const { password } = this.passChangeForm.value;

    this.dashboardService.updateUserPass( this.idUsuario, this.email, password ).subscribe({
      next: (result: boolean) => {
        if (result) {
          // La contraseña se actualizó con éxito
          Swal.fire('Éxito', 'La contraseña ha sido actualizada', 'success');
          // Cierra el diálogo después de que la contraseña se actualiza con éxito
          this.dialogRef.close(true);
        } else {
          // No se pudo actualizar la contraseña
          Swal.fire('Error', 'No se ha podido actualizar la contraseña', 'error');
        }
      },
      error: (message: any) =>{
        Swal.fire('Error', 'No se ha podido actualizar la contraseña del usuario', 'error');
      }
    });

  }
}
