import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { Alojamiento, TipoAlojamiento, TipoHabitacion } from 'src/modules/shared/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-new-room',
  templateUrl: './new-room.component.html',
  styleUrl: './new-room.component.css'
})
export class NewRoomComponent {
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser();
  public selectedFile: File | null = null;

  public newRoomForm: FormGroup;

  public roomTypes: TipoHabitacion[] = [];

  public accommodations: Alojamiento[] = [];

  constructor() {
    this.newRoomForm = this.fb.group({
      nombreHabitacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      capacidad: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      imagen: [''],
      idAlojamiento: ['', [Validators.required]],
      idTipoHabitacion: ['', [Validators.required]],
    });

    this.dashboardService.getRoomTypes()
      .subscribe((types) => {
        this.roomTypes = types as TipoHabitacion[];
      });

    this.dashboardService.getAccommodationsByUser(this.user.idUsuario, this.user.idTipoUsuario)
      .subscribe((accommodations) => {
        this.accommodations = accommodations as Alojamiento[];
      });

  }

  /**
   * Método para validar un campo
   * @param field - Campo (string)
   * @returns devuelve un booleano
   */
  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.newRoomForm, field );
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
  newRoom() {
    this.dashboardService.newRoom(this.newRoomForm, this.selectedFile)
    .subscribe({
      next: (resp: any) => {
        if(resp === false) {
          Swal.fire('Error', 'Se ha producido un error al añadir la habitación', 'error');
          return;
        }
        if(resp === true) {
          return;
        }

        Swal.fire('Éxito', 'Nueva habitación añadida', 'success');

        setTimeout( () => {
          this.newRoomForm.reset();
        })

      },
      error: (message: any) => {
        console.error(message);
        Swal.fire('Error', message, 'error')
      }
    });
  }
}
