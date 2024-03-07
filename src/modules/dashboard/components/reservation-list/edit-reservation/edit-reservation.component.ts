import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from 'src/modules/dashboard/services/dashboard.service';
import { EstadoReserva, Reserva } from 'src/modules/shared/interfaces';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrl: './edit-reservation.component.css'
})
export class EditReservationComponent {
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser();

  public editReservationForm: FormGroup;
  public reservationStatus: EstadoReserva[] = [];
  public reservation: Reserva | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('idReserva', data.idReserva);
    this.dashboardService.getReservationById(data.idReserva).subscribe(async (response) => {
      console.log('response', response);
      this.reservation = response;

      this.editReservationForm.patchValue({
        idReserva: this.reservation?.idReserva,
        fechaInicio: this.reservation?.fechaInicio,
        fechaFin: this.reservation?.fechaFin,
        idEstadoReserva: this.reservation?.idEstadoReserva
      });

    });

    this.editReservationForm = this.fb.group({
      idReserva: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      idEstadoReserva: ['', [Validators.required]],
    });

    this.dashboardService.getReservationStatus().subscribe((status) => {
      this.reservationStatus = status as EstadoReserva[];

      if (this.data.reserva) {
        const reservationStatus = this.reservationStatus.find((s) => s.idEstadoReserva === this.data.reserva.idEstadoReserva);

        if (reservationStatus) {
          this.editReservationForm.get('idEstadoReserva')?.setValue(reservationStatus);
        }
      }
    });
  }

  /**
   * Método para validar un campo
   * @param field - Campo (string)
   * @returns devuelve un booleano
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.editReservationForm, field);
  }

  /**
   * Método para editar una reserva
   */
  editReservation() {
    // Obtener la fecha de fin del formulario
    const fechaFin = new Date(this.editReservationForm.get('fechaFin')?.value);

    // Formatear la fecha de fin al formato 'YYYY-MM-DD'
    const formattedDayFin = ('0' + fechaFin.getDate()).slice(-2);
    const formattedMonthFin = ('0' + (fechaFin.getMonth() + 1)).slice(-2);
    const formattedYearFin = fechaFin.getFullYear();
    const formattedDateFin = `${formattedYearFin}-${formattedMonthFin}-${formattedDayFin}`;

    // Obtener la fecha de inicio del formulario
    const fechaInicio = new Date(this.editReservationForm.get('fechaInicio')?.value);

    // Formatear la fecha de inicio al formato 'YYYY-MM-DD'
    const formattedDayInicio = ('0' + fechaInicio.getDate()).slice(-2);
    const formattedMonthInicio = ('0' + (fechaInicio.getMonth() + 1)).slice(-2);
    const formattedYearInicio = fechaInicio.getFullYear();
    const formattedDateInicio = `${formattedYearInicio}-${formattedMonthInicio}-${formattedDayInicio}`;

    // Comprobar si la fecha de fin es posterior a la fecha de inicio
    if (fechaFin <= fechaInicio) {
      Swal.fire('Warning', 'La fecha de fin debe ser posterior a la fecha de inicio', 'warning');
      return;
    }

    // Actualizar las fechas en el formulario con los valores formateados
    this.editReservationForm.get('fechaFin')?.setValue(formattedDateFin);
    this.editReservationForm.get('fechaInicio')?.setValue(formattedDateInicio);

    // Llamar al servicio para editar la reserva
    this.dashboardService.editReservation(this.editReservationForm).subscribe({
      next: (resp: any) => {
        if (resp == 0) {
          Swal.fire('Error', 'Se ha producido un error editando la reserva', 'error');
          return;
        }
        if (resp == 1) {
          Swal.fire('Éxito', 'Reserva editada correctamente', 'success');
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
