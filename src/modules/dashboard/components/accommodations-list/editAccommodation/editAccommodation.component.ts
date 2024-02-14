// src/modules/dashboard/components/accommodations-list/editAccommodation/editAccommodation.component.ts
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from 'src/modules/dashboard/services/dashboard.service';
import { Alojamiento, TipoAlojamiento } from 'src/modules/shared/interfaces';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-edit-accommodation',
  templateUrl: './editAccommodation.component.html',
  styleUrl: './editAccommodation.component.css'
})
export class EditAccommodationComponent {
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser();
  public selectedFile: File | null = null;

  public editAccomodationForm: FormGroup;
  public accommodationTypes: TipoAlojamiento[] = [];
  public type: number | null = null;

  public accommodation: Alojamiento | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dashboardService.getAccommodationById(data.idAlojamiento).subscribe(async (response) => {
      this.accommodation = response;

      // Set values sin el campo imagen
      this.editAccomodationForm.patchValue({
        idAlojamiento: this.accommodation.idAlojamiento,
        nombreAlojamiento: this.accommodation.nombreAlojamiento,
        descripcion: this.accommodation.descripcion,
        capacidad: this.accommodation.capacidad,
        ciudad: this.accommodation.ciudad,
        idTipoAlojamiento: this.accommodation.idTipoAlojamiento,
        idPropietario: this.user?.idUsuario
      });
    });

    this.editAccomodationForm = this.fb.group({
      idAlojamiento: ['', [Validators.required]],
      nombreAlojamiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      capacidad: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      imagen: [''],
      idTipoAlojamiento: ['', [Validators.required]],
      idPropietario: [this.user?.idUsuario]
    });

    // Obtener los tipos de alojamientos
    this.dashboardService.getAccommodationTypes().subscribe((resp) => {
      this.accommodationTypes = resp as TipoAlojamiento[];
      // Buscar el tipo de alojamiento correspondiente al alojamiento actual
      const tipo = this.accommodationTypes.find((type) => type.idTipoAlojamiento === this.accommodation?.idTipoAlojamiento);

      // Establecer el valor del mat-select si se encontró un tipo de alojamiento
      if (tipo) {
        this.editAccomodationForm.get('idTipoAlojamiento')?.setValue(tipo.idTipoAlojamiento);
      }
    });
  }

  /**
   * Método para validar un campo
   * @param field - Campo (string)
   * @returns devuelve un booleano
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.editAccomodationForm, field);
  }

  /**
   * Metodo para cargar la imagen
   * @param event - Evento
   */
  chargeImgFile(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  /**
   * Metodo para editar el alojamiento
   */
  editContent() {

    // Verificar si se ha seleccionado una nueva imagen
    if (this.selectedFile) {
      this.dashboardService.editAccommodationWithImage(this.editAccomodationForm, this.selectedFile).subscribe({
        next: (resp: any) => {
          if (resp == 0) {
            Swal.fire('Error', 'Se ha producido un error editando el alojamiento', 'error');
            return;
          }
          if (resp == 1) {
            Swal.fire('Éxito', 'Alojamiento editado correctamente', 'success');
            return;
          }
        },
        error: (message: any) => {
          Swal.fire('Error', message, 'error');
        }
      });
    } else {
      this.dashboardService.editAccommodationWithoutImage(this.editAccomodationForm).subscribe({
        next: (resp: any) => {
          if (resp == 0) {
            Swal.fire('Error', 'Se ha producido un error editando el alojamiento', 'error');
            return;
          }
          if (resp == 1) {
            Swal.fire('Éxito', 'Alojamiento editado correctamente', 'success');
            return;
          }
        },
        error: (message: any) => {
          Swal.fire('Error', message, 'error');
        }
      });
    }
  }
}
