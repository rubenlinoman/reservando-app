import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from 'src/modules/dashboard/services/dashboard.service';
import { EstadoReserva } from 'src/modules/shared/interfaces';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';

@Component({
  selector: 'dashboard-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrl: './edit-reservation.component.css',
})
export class EditReservationComponent {
  public fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser();

  public editReservationForm: FormGroup;
  public reservationStatus: EstadoReserva[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dashboardService.getReservationStatus().subscribe((status) => {
      this.reservationStatus = status as EstadoReserva[];
    });
  }
}
