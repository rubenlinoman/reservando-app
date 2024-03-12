import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/modules/auth/interfaces';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from 'src/modules/dashboard/services/dashboard.service';
import { Alojamiento, Habitacion, Reserva } from 'src/modules/shared/interfaces';

@Component({
  selector: 'dashboard-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.css',
})
export class ReservationDetailsComponent {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  public readonly apiUrl = environment.apiUrl;

  public reservation: Reserva = {} as Reserva;
  public accommodation: Alojamiento = {} as Alojamiento;
  public room: Habitacion = {} as Habitacion;

  public client: Usuario;

  constructor(private route: ActivatedRoute) {
    const idReserva = this.route.snapshot.paramMap.get('idReserva');
    this.dashboardService.getReservationById(+idReserva).subscribe((reserva) => {
      this.reservation = reserva;
      console.log('reservation', this.reservation);

      const idUsuario = this.reservation.idUsuario;
      console.log('idUsuario', idUsuario);

      this.dashboardService.getUserById(idUsuario).subscribe((usuario) => {
        this.client = usuario;
        console.log('client', this.client);

      });

      const idAlojamiento = this.reservation.idAlojamiento;
      this.dashboardService.getAccommodationById(idAlojamiento).subscribe((alojamiento) => {
        this.accommodation = alojamiento;

        const idHabitacion = this.reservation.idHabitacion;
        this.dashboardService.getRoomById(idHabitacion).subscribe((habitacion) => {
          this.room = habitacion;
        });
      });
    })
  }

  ngAfterViewInit() {
  }

  /**
   * Método para calcular el número de noches
   * @param startDateStr - Fecha de inicio (string)
   * @param endDateStr - Fecha de fin (string)
   * @returns devuelve el número de noches
   */
  calculateNights(startDateStr: string, endDateStr: string): number {
    // Convertir las cadenas de texto a objetos Date
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calcular la diferencia en milisegundos
    const difference = endDate.getTime() - startDate.getTime();

    // Convertir la diferencia de milisegundos a días y redondear al número entero más cercano
    const nights = Math.round(difference / (1000 * 60 * 60 * 24));

    return nights;
  }



}
