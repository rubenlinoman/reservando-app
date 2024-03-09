import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alojamiento, Habitacion, TipoHabitacion } from 'src/modules/shared/interfaces';
import { ChangeDetectorRef, Renderer2, ViewChild, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { WebService } from '../../services/web.service';

import * as bootstrap from 'bootstrap';

import { BookingRoomComponent } from './booking-room/booking-room.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'web-details-page',
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent {
  public readonly apiUrl = environment.apiUrl;
  private webService = inject(WebService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  public datePipe = new DatePipe('es-ES', 'GTM+2');

  public accommodation: Alojamiento;
  public rooms: Habitacion[] = [];

  private idAlojamiento = this.route.snapshot.params['id'];

  public roomTypesOfAccommodation: TipoHabitacion[] = [];
  public availableRoomTypes: Habitacion[] = [];
  public selectedRooms: Habitacion[] = [];

  public availableRoomsForm: FormGroup;

  private _fechaInicio: string;
  private _fechaFin: string;

  public columns: TableHeader[] = [
    {
      columnDef: 'nombreTipoHabitacion',
      header: 'Tipo de habitación',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => {
        return `<div>${element.nombreTipoHabitacion}</div>
                <div class="text-success">
                  <i class="bi bi-house-door"></i> ${element.cantidadDisponible} habitaciones disponibles
                </div>`;
      }
    },
    {
      columnDef: 'capacidad',
      header: 'Número de personas',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.capacidad}`
    },
    {
      columnDef: 'precio',
      header: 'Precio de hoy',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.precio}`
    },
    {
      columnDef: 'seleccionarHabitaciones',
      header: 'Seleccionar habitaciones',
      iconoTh: false,
      iconoTd: true,
      cell: (element: Habitacion) => ``
    }
  ];

  public displayedColumns = this.columns.map((c) => c.columnDef);
  public dataSource: MatTableDataSource<Habitacion>;
  @ViewChild('roomSelect') roomSelect: MatSelect;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.availableRoomsForm = this.fb.group({
      fechaInicio: [today.toISOString().split('T')[0]], // Valor predeterminado: mañana
      fechaFin: [tomorrow.toISOString().split('T')[0]] // Valor predeterminado: mañana
    });

    this.webService.getAccommodationById(this.idAlojamiento).subscribe((accommodation) => {
      this.accommodation = accommodation;
    });

    // Obtener las habitaciones disponibles en fecha actual
    const values = this.availableRoomsForm.value;
    this._fechaInicio = values.fechaInicio;
    this._fechaFin = values.fechaFin;

    // Obtener las habitaciones disponibles del día actual al iniciar el componente
    this.chargeRooms();

    this.webService
      .getAvailableRoomsByAccommodationAndRoomTypeId(this._fechaInicio, this._fechaFin, this.idAlojamiento, 4)
      .subscribe((availableRoomTypes) => {
        this.rooms.forEach((room) => {
          room.availableRoomTypes = availableRoomTypes;
        });
      });

    // Obtener las habitaciones del alojamiento
    this.webService.getRoomsByAccommodationId(this.idAlojamiento).subscribe((rooms) => {
      this.rooms = rooms;
    });

    // Obtener los tipos de habitaciones del alojamiento
    this.webService.getRoomTypesByAccommodationId(this.idAlojamiento).subscribe((roomTypes) => {
      this.roomTypesOfAccommodation = roomTypes;
    });
  }

  ngAfterViewInit() {
    // Agregar listeners para los botones de carousel
    const nextButton = document.querySelector('.carousel-control-next');
    const prevButton = document.querySelector('.carousel-control-prev');

    this.renderer.listen(nextButton, 'click', () => {
      const carousel = document.querySelector('#carouselRoom');
      const carouselInstance = new bootstrap.Carousel(carousel);
      carouselInstance.next();
    });

    this.renderer.listen(prevButton, 'click', () => {
      const carousel = document.querySelector('#carouselRoom');
      const carouselInstance = new bootstrap.Carousel(carousel);
      carouselInstance.prev();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  chargeRooms() {
    this.webService.getAvailableRooms(this._fechaInicio, this._fechaFin, this.idAlojamiento).subscribe((rooms) => {
      // Mapear las habitaciones y asignarles el idTipoHabitacion adecuado
      this.rooms = rooms.map((room) => ({ ...room, idTipoHabitacion: room.idTipoHabitacion }));

      // Inicializar la propiedad selectedRoom de cada habitación
      this.rooms.forEach((room) => {
        room.selectedRoom = { quantity: 1, totalPrice: +room.precio }; // Inicializar como una habitación individual con cantidad 1
      });

      // Construir el dataSource
      this.buildDataSource();

      // Obtener las habitaciones disponibles por tipo
      this.rooms.forEach((room) => {
        this.webService
          .getAvailableRoomsByAccommodationAndRoomTypeId(this._fechaInicio, this._fechaFin, this.idAlojamiento, room.idTipoHabitacion)
          .subscribe((availableRoomTypes) => {
            room.availableRoomTypes = availableRoomTypes;
          });
      });
    });
  }

  /**
   * Método para construir el datasource
   */
  buildDataSource() {
    this.dataSource = new MatTableDataSource(this.rooms);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Método para mostrar la imagen en un dialog
   * @param archivo - Archivo
   */
  showImage(imagen: string) {
    const dialogRef = this.dialog.open(ImageDetailsComponent, {
      data: { imagen: imagen }
    });
  }

  /**
   * Método para buscar las habitaciones disponibles
   */
  searchDates() {
    const fechaInicio = this.availableRoomsForm.get('fechaInicio')?.value;
    const fechaFin = this.availableRoomsForm.get('fechaFin')?.value;

    // Formateamos las fechas usando el DatePipe
    this._fechaInicio = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
    this._fechaFin = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');

    if (this._fechaInicio && this._fechaFin) {
      console.log('Fecha de inicio:', this._fechaInicio);
      console.log('Fecha de fin:', this._fechaFin);

      this.chargeRooms();
    }

    // this.chargeRooms();
  }

  /**
   * Método para seleccionar una habitación
   * @param room - Habitación
   * @param $event - Evento
   */
  roomSelected(room: Habitacion, $event: any) {
    if ($event !== null && $event !== undefined) {
      const quantity = $event.quantity;

      const totalPrice = $event.totalPrice;

      const existingRoomIndex = this.selectedRooms.findIndex((selectedRoom) => selectedRoom.idTipoHabitacion === room.idTipoHabitacion);

      if (existingRoomIndex !== -1) {
        // Si la habitación ya está en selectedRooms, actualiza su cantidad
        this.selectedRooms[existingRoomIndex].selectedRoom = { quantity, totalPrice };
      } else {
        // Si la habitación no está en selectedRooms, agrégala
        room.selectedRoom = { quantity, totalPrice };

        this.selectedRooms.push(room);
      }
    } else {
      // Buscar y eliminar la habitación previamente seleccionada
      const index = this.selectedRooms.findIndex((selectedRoom) => selectedRoom.idTipoHabitacion === room.idTipoHabitacion);

      if (index !== -1) {
        this.selectedRooms.splice(index, 1);
      }
    }
  }

  /**
   * Método para redirigir a la página de reservas
   */
  bookingRoom() {
    this.router.navigate(['/reservar'], {
      state: {
        fechaInicio: this._fechaInicio,
        fechaFin: this._fechaFin,
        idAlojamiento: this.idAlojamiento,
        selectedRooms: this.selectedRooms
      }
    });
  }

  /**
   * Método para hacer scroll a la sección de reservas
   */
  scrollToReservas() {
    const reservasElement = this.el.nativeElement.querySelector('#reservas');
    if (reservasElement) {
      reservasElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
