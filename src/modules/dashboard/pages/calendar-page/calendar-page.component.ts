import { AuthService } from 'src/modules/auth/services/auth.service';
import { Calendar } from '@fullcalendar/core';
import { Component, OnInit, computed, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Reserva } from 'src/modules/shared/interfaces';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa el complemento dayGridPlugin
import esLocale from '@fullcalendar/core/locales/es';

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
        eventColor: '#1c76da',
        locale: esLocale, // Establece el idioma a español
        firstDay: 1, // Establece el primer día de la semana como lunes
        events: this.getEventArray(reservations), // Convierte las reservas en un arreglo de eventos y las pasa a FullCalendar
        eventClick: this.handleEventClick,
      });


      calendar.render();
    });
  }

  // Convierte las reservas en un arreglo de eventos para FullCalendar
  getEventArray(reservations: Reserva[]): any[] {
    return reservations.map((reserva) => {
      // Genera un color aleatorio en formato hexadecimal
      const color = '#' + Math.floor(Math.random()*16777215).toString(16);

      return {
        id: reserva.idReserva, // Asegúrate de incluir el ID de la reserva como el campo 'id'
        displayEventTime: false,
        title: 'ID ' +  reserva.idReserva + ' - ' + reserva.nombreAlojamiento +  ': ' + reserva.nombreHabitacion + ' -> Cliente: ' + reserva.idUsuario,
        start: reserva.fechaInicio,
        end: reserva.fechaFin, // Utilizar la fecha de fin ajustada
        color: color // Asigna el color aleatorio al evento
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
