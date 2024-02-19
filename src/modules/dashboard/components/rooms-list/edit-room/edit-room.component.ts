import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from 'src/modules/dashboard/services/dashboard.service';
import { Alojamiento, Habitacion, TipoHabitacion } from 'src/modules/shared/interfaces';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css'
})
export class EditRoomComponent {
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser();
  public selectedFile: File | null = null;

  public editRoomForm: FormGroup;
  public roomTypes: TipoHabitacion[] = [];
  public type: number | null = null;

  public room: Habitacion | null = null;
  public accommodation: Alojamiento | null = null;

  public accommodations: Alojamiento[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dashboardService.getRoomById(data.idHabitacion).subscribe(async (response) => {
      this.room = response;

      this.dashboardService.getAccommodationsByUser(this.user.idUsuario, this.user.idTipoUsuario).subscribe((accommodations) => {
        this.accommodations = accommodations as Alojamiento[];
      });

      // Set values sin el campo imagen
      this.editRoomForm.patchValue({
        idHabitacion: this.room.idHabitacion,
        nombreHabitacion: this.room.nombreHabitacion,
        descripcion: this.room.descripcion,
        capacidad: this.room.capacidad,
        precio: this.room.precio,
        enOferta: this.room.enOferta,
        descuento: this.room.descuento,
        idTipoHabitacion: this.room.idTipoHabitacion
      });
    });

    this.editRoomForm = this.fb.group({
      idHabitacion: ['', [Validators.required]],
      nombreHabitacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      capacidad: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      enOferta: [''],
      descuento: [''],
      imagen: [''],
      idTipoHabitacion: ['', [Validators.required]]
    });

    // Obtener los tipos de alojamientos
    this.dashboardService.getRoomTypes().subscribe((resp) => {
      this.roomTypes = resp as TipoHabitacion[];
      // Buscar el tipo de habitacion correspondiente a la habitació actual
      const tipo = this.roomTypes.find((type) => type.idTipoHabitacion === this.room?.idTipoHabitacion);

      // Establecer el valor del mat-select si se encontró un tipo de habitación
      if (tipo) {
        this.editRoomForm.get('idTipoHabitacion')?.setValue(tipo.idTipoHabitacion);
      }
    });
  }

  /**
   * Método para validar un campo
   * @param field - Campo (string)
   * @returns devuelve un booleano
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.editRoomForm, field);
  }

  /**
   * Metodo para cargar la imagen
   * @param event - Evento
   */
  chargeImgFile(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  /**
   * Metodo para editar la habitación
   */
  editRoom() {
    this.dashboardService.editRoom(this.editRoomForm, this.selectedFile).subscribe({
      next: (resp: any) => {
        console.log('resp', resp);

        if (resp == 0) {
          Swal.fire('Error', 'Se ha producido un error editando la habitación', 'error');
          return;
        }
        if (resp == 1) {
          Swal.fire('Éxito', 'Habitación editada correctamente', 'success');
          return;
        }
      },
      error: (message: any) => {
        console.error(message);
        Swal.fire('Error', message, 'error');
      }
    });
  }
}
