import { Component, OnInit, computed, inject } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa el complemento dayGridPlugin
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { Reserva } from 'src/modules/shared/interfaces';
import { DatePipe } from '@angular/common';
import { end } from '@popperjs/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css']
})
export class CalendarPageComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());

  public reservationsByOwner: Reserva[] = [];

  // En el constructor, enlaza explícitamente el contexto de 'this' para handleEventClick
  constructor(private router: Router) {
    this.handleEventClick = this.handleEventClick.bind(this);
  }

  ngOnInit(): void {
    // Obtener reservas del usuario y luego inicializar y configurar FullCalendar
    this.dashboardService.getReservationsByOwner(this.user().idUsuario, this.user().idTipoUsuario).subscribe((reservations) => {
      this.reservationsByOwner = reservations;
      console.log('reservations', reservations);

      // Inicializar y configurar FullCalendar con las reservas obtenidas
      var calendarEl = document.getElementById('calendar');

      var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin], // Añade el complemento dayGridPlugin al arreglo de plugins
        initialView: 'dayGridMonth',
        displayEventTime: false,
        editable: true,
        events: this.getEventArray(reservations), // Convierte las reservas en un arreglo de eventos y las pasa a FullCalendar
        eventClick: this.handleEventClick
      });

      calendar.render();
    });
  }

  // Convierte las reservas en un arreglo de eventos para FullCalendar
  getEventArray(reservations: Reserva[]): any[] {
    return reservations.map((reserva) => {
      // Ajustar la fecha de fin para que sea el día siguiente al último día del evento
      // let fechaFin = new Date(reserva.fechaFin);
      // fechaFin.setDate(fechaFin.getDate() + 1);

      return {
        id: reserva.idReserva, // Asegúrate de incluir el ID de la reserva como el campo 'id'
        displayEventTime: false,
        title: reserva.nombreAlojamiento + ' - ' + reserva.idReserva + ' - ' + 'ID Reserva' + ' - ' + reserva.nombreHabitacion,
        start: reserva.fechaInicio,
        end: reserva.fechaFin // Utilizar la fecha de fin ajustada
      };
    });
  }

  // Función para manejar el clic en un evento
  handleEventClick(info) {
    // Obtener el ID de la reserva del evento clicado
    const idReserva = info.event.id;
    console.log('idReserva', idReserva);

    // Redirigir a la página de detalles de la reserva
    this.router.navigate(['/dashboard/reservas/detalle-reserva', idReserva]);
  }
}
