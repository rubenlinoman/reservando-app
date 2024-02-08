import { AuthService } from 'src/modules/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoAlojamiento } from 'src/modules/shared/interfaces';
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

  public newAccomodationForm: FormGroup;

  public accomodationTypes: TipoAlojamiento[] = []

  constructor() {
    this.newAccomodationForm = this.fb.group({
      nombreAlojamiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      capacidad: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      imagen: [''],
      tipoAlojamiento: ['', [Validators.required]],
      idPropietario: [this.user?.idUsuario],
    });

    this.dashboardService.getAccommodationTypes()
      .subscribe((types) => {
        this.accomodationTypes = types as TipoAlojamiento[];
      })

  }

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.newAccomodationForm, field );
  }

  chargeImgFile(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  /**
   * Metodo para crear un nuevo alojamiento
   */
  newAccomodation() {
    this.dashboardService.newAccomodation(this.newAccomodationForm)
      .subscribe({
        next: (resp) => {
          if (!resp) {
            Swal.fire('Error', 'Se ha producido un error creando el alojamiento', 'error');
          } else {
            Swal.fire('success', 'Alojamiento creado con éxito', 'success');
          }
        },
        error: (message: any) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }

}
