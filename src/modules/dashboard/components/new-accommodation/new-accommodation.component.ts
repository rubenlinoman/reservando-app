import { AuthService } from 'src/modules/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alojamiento, TipoAlojamiento } from 'src/modules/shared/interfaces';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-new-accommodation',
  templateUrl: './new-accommodation.component.html',
  styleUrl: './new-accommodation.component.css',
})
export class NewAccommodationComponent {
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser();
  public selectedFile: File | null = null;

  public showForm: boolean = true;

  public newAccommodationForm: FormGroup;

  public accommodationTypes: TipoAlojamiento[] = [];

  constructor() {
    this.newAccommodationForm = this.fb.group({
      nombreAlojamiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      capacidad: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      imagen: [''],
      idTipoAlojamiento: ['', [Validators.required]],
      idPropietario: [this.user?.idUsuario],
    });

    this.dashboardService.getAccommodationTypes()
      .subscribe((types) => {
        this.accommodationTypes = types as TipoAlojamiento[];
      });

  }

  /**
   * Método para validar un campo
   * @param field - Campo (string)
   * @returns devuelve un booleano
   */
  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.newAccommodationForm, field );
  }

  /**
   * Metodo para cargar la imagen
   * @param event - Evento
   */
  chargeImgFile(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  /**
   * Metodo para crear un nuevo alojamiento
   */
  newAccomodation() {
    this.dashboardService.newAccomodation(this.newAccommodationForm, this.selectedFile)
    .subscribe({
      next: (resp: any) => {
        if(resp === false) {
          Swal.fire('Error', 'Se ha producido un error al añadir el alojamiento', 'error');
          return;
        }
        if(resp === true) {
          return;
        }

        Swal.fire('Éxito', 'Nuevo alojamiento añadido', 'success');

        this.showForm = false;
        setTimeout( () => {
          this.newAccommodationForm.reset();
          this.showForm = true;
        })

      },
      error: (message: any) => {
        console.error(message);
        Swal.fire('Error', message, 'error')
      }
    });
  }

}
