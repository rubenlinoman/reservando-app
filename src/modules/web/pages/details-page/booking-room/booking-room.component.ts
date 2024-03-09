import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'src/modules/web/services/web.service';

import { Alojamiento, Habitacion } from 'src/modules/shared/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import Swal from 'sweetalert2';
import { ReservaData } from 'src/modules/web/interfaces/reservaData.interface';

@Component({
  selector: 'web-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrl: './booking-room.component.css'
})
export class BookingRoomComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);
  private webService = inject(WebService);

  public fechaInicio: string;
  public fechaFin: string;
  public idAlojamiento: number;
  public alojamiento: Alojamiento;
  public selectedRooms: Habitacion[];
  duracionEstancia: number; // Variable para almacenar la duración de la estancia en días
  isMakingReservation: boolean = false;

  public user = computed(() => this.authService.currentUser());

  public showForm: boolean = true;
  public registerForm: FormGroup = this.fb.group(
    {
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
      tipoUsuario: [1]
    },
    {
      validators: [
        this.validatorsService.isFieldOneEqualFieldTwo('password', 'password2'),
        this.validatorsService.isFieldOneEqualFieldTwo('email', 'email2')
      ]
    }
  );

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.fechaInicio = state['fechaInicio'];
      this.fechaFin = state['fechaFin'];
      this.idAlojamiento = +state['idAlojamiento'];
      this.selectedRooms = state['selectedRooms'];

      // Almacena los datos en el localStorage
      localStorage.setItem('fechaInicio', this.fechaInicio);
      localStorage.setItem('fechaFin', this.fechaFin);
      localStorage.setItem('idAlojamiento', this.idAlojamiento.toString());
      localStorage.setItem('selectedRooms', JSON.stringify(this.selectedRooms));
    } else {
      // Recupera los datos del localStorage si no están en el estado de la navegación
      this.fechaInicio = localStorage.getItem('fechaInicio');
      this.fechaFin = localStorage.getItem('fechaFin');
      this.idAlojamiento = parseInt(localStorage.getItem('idAlojamiento'));
      this.selectedRooms = JSON.parse(localStorage.getItem('selectedRooms'));
    }

    this.webService.getAccommodationById(this.idAlojamiento).subscribe((alojamiento) => {
      this.alojamiento = alojamiento;
    });

    // Llama al método calcularDuracionEstancia después de asignar las fechas de inicio y fin
    this.calcularDuracionEstancia();
  }

  /**
   * Método para comprobar si el campo es valido
   * @param field - Campo del formulario
   * @returns Devuelve el estado del campo
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  /**
   * Método para registrar un usuario
   */
  register() {
    this.authService.registerUser(this.registerForm).subscribe({
      next: () => this.router.navigateByUrl('/dashboard/default'),
      error: (message) => {
        Swal.fire('Error', message, 'error');
      }
    });
  }

  /**
   * Método para devolver la fecha con el día de la semana
   * @param dateString - Fecha
   * @returns devuelve el dia de la semana
   */
  getFormattedDate(dateString: string): string {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    return `${dayOfWeek}, ${date.toLocaleDateString()}`;
  }

  /**
   * Método para calcular la duración de la estancia
   */
  calcularDuracionEstancia(): void {
    const fechaInicioDate = new Date(this.fechaInicio);
    const fechaFinDate = new Date(this.fechaFin);
    // Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = fechaFinDate.getTime() - fechaInicioDate.getTime();

    // Convertir la diferencia de milisegundos a días
    this.duracionEstancia = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  }

  /**
   * Método para devolver el texto en singulular o plural dependiendo de la duración de la estancia
   * @returns devuelve un string
   */
  getDuracionEstanciaText(): string {
    if (this.duracionEstancia === 1) {
      return 'noche';
    } else {
      return 'noches';
    }
  }

  /**
   * Método para devolver los detalles de las reservas
   * @returns devuelve un string
   */
  getSelectedRoomsDetails(): string[] {
    const details: string[] = [];
    for (const room of this.selectedRooms) {
      // Verifica si availableRoomTypes está presente y no está vacío
      if (room.availableRoomTypes && room.availableRoomTypes.length > 0) {
        const roomName = room.availableRoomTypes[0].nombreHabitacion;
        const quantity = room.selectedRoom.quantity;
        const detail = `${quantity} x ${roomName}`;
        details.push(detail);
      }
    }
    return details;
  }

  /**
   * Método para devolver el desglose de los precios
   * @returns devuelve un string
   */
  getTotalPriceDetails(): { details: string[]; totalPrice: number } {
    const priceDetails: string[] = [];
    let totalPrice = 0;
    for (const room of this.selectedRooms) {
      // Verifica si availableRoomTypes está presente y no está vacío
      if (room.availableRoomTypes && room.availableRoomTypes.length > 0) {
        const roomName = room.availableRoomTypes[0].nombreHabitacion;
        const quantity = room.selectedRoom.quantity;
        const price = parseFloat(room.availableRoomTypes[0].precio); // Convierte el precio a número
        totalPrice += quantity * price; // Incrementa el precio total
        const detail = `${quantity} x ${roomName} - ${quantity * price} €`;
        priceDetails.push(detail);
      }
    }
    return { details: priceDetails, totalPrice: totalPrice };
  }

  /**
   * Método para hacer la reserva
   */
  checkUserAndMakeReservation() {
    console.log('user:', this.user());

    if (!this.user()) {
      if (this.registerForm.invalid) {
        Swal.fire('Warning', 'Por favor, rellene todos los campos', 'warning');
        this.showForm = false;
        setTimeout(() => {
          this.showForm = true;
        });
        return;
      } else {
        this.authService.registerUserInReservation(this.registerForm).subscribe({
          next: (response) => {
            // Una vez registrado, obtenemos el idUsuario de la respuesta
            const userId = response.user.idUsuario;

            // Hacemos la reserva con el idUsuario obtenido
            this.makeReservation(userId);

            this.showForm = false;
            setTimeout(() => {
              this.registerForm.reset();
              this.showForm = true;
            });
          },
          error: (message) => {
            console.error('Error al registrar:', message);
            Swal.fire('Error', message.message, 'error');
          }
        });
      }
    } else {
      // Si el usuario está logeado, simplemente hacemos la reserva
      this.makeReservation(this.user().idUsuario); // Utilizamos el idUsuario actual
    }
  }

  /**
   * Método para hacer la reserva
   * @param userId - ID del usuario
   */
  makeReservation(idUsuario: number): void {
    this.isMakingReservation = true; // Mostrar el spinner

    let successfulReservations = 0;
    const totalRooms = this.selectedRooms.reduce((total, room) => total + room.selectedRoom.quantity, 0);

    for (const room of this.selectedRooms) {
      for (let i = 0; i < room.selectedRoom.quantity; i++) {
        const reservaData: ReservaData = {
          idUsuario: idUsuario,
          idAlojamiento: this.idAlojamiento,
          idHabitacion: room.availableRoomTypes[i].idHabitacion,
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          idEstadoReserva: 1
        };

        this.webService.createReservation(reservaData).subscribe({
          next: (response) => {
            successfulReservations++;
            if (successfulReservations === totalRooms) {
              Swal.fire('Éxito', 'Reserva realizada correctamente', 'success').then(() => {
                // Redirigir a la página de inicio o a la ruta deseada
                window.location.href = '/';
              });

              this.showForm = false;
              setTimeout(() => {
                this.registerForm.reset();
                this.showForm = true;
                this.isMakingReservation = false; // Ocultar el spinner cuando se complete el proceso
              });
            }
          },
          error: (error) => {
            if (error.error.message.includes('Ya existe una reserva para esta habitación en las fechas especificadas')) {
              Swal.fire('Error', 'Ya existe una reserva para esta habitación en las fechas especificadas.', 'error');
            } else {
              Swal.fire('Error', 'Ocurrió un error al realizar la reserva. Por favor, inténtelo de nuevo más tarde.', 'error');
            }

            this.isMakingReservation = false; // Asegurarse de ocultar el spinner en caso de error
          }
        });
      }
    }
  }
}
