// src/modules/web/pages/details-page/details-page.component.ts
import { ChangeDetectorRef, Component, Renderer2, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alojamiento, Habitacion, TipoHabitacion } from 'src/modules/shared/interfaces';
import { WebService } from '../../services/web.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ImageDetailsComponent } from './image-details/image-details.component';

import * as bootstrap from 'bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'web-details-page',
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent {
  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public readonly apiUrl = environment.apiUrl;

  public datePipe = new DatePipe('es-ES', 'GTM+2');

  public accommodation: Alojamiento;
  public rooms: Habitacion[] = [];

  public roomTypesOfAccommodation: TipoHabitacion[] = [];

  public availableRoomsForm: FormGroup;

  private _fechaInicio: string;
  private _fechaFin: string;

  public columns: TableHeader[] = [
    {
      columnDef: 'nombreTipoHabitacion',
      header: 'Nombre',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.nombreTipoHabitacion}`
    },
    {
      columnDef: 'capacidad',
      header: 'Capacidad',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.capacidad}`
    },
    {
      columnDef: 'precio',
      header: 'Precio',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.precio}`
    },
    {
      columnDef: 'cantidadDisponible',
      header: 'Cantidad',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.cantidadDisponible}`
    }
  ];

  public displayedColumns = this.columns.map((c) => c.columnDef);
  public dataSource: MatTableDataSource<Habitacion>;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.availableRoomsForm = this.fb.group({
      fechaInicio: [tomorrow.toISOString().split('T')[0]], // Valor predeterminado: mañana
      fechaFin: [tomorrow.toISOString().split('T')[0]] // Valor predeterminado: mañana
    });

    const id = this.route.snapshot.params['id'];
    this.webService.getAccommodationById(id).subscribe((accommodation) => {
      this.accommodation = accommodation;
    });

    // Obtener las habitaciones disponibles en fecha actual
    const values = this.availableRoomsForm.value;
    this._fechaInicio = values.fechaInicio;
    this._fechaFin = values.fechaFin;

    // Obtener las habitaciones disponibles del día actual al iniciar el componente
    this.webService.getAvailableRooms(this._fechaInicio, this._fechaFin, id).subscribe((rooms) => {
      this.rooms = rooms;
      console.log('Habitaciones disponibles today:', this.rooms);

      this.buildDataSource();
    });

    // Obtener las habitaciones del alojamiento
    this.webService.getRoomsByAccommodationId(id).subscribe((rooms) => {
      this.rooms = rooms;
    });

    // Obtener los tipos de habitaciones del alojamiento
    this.webService.getRoomTypesByAccommodationId(id).subscribe((roomTypes) => {
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

  searchDates() {
    const id = this.route.snapshot.params['id'];
    const fechaInicio = this.availableRoomsForm.get('fechaInicio')?.value;
    const fechaFin = this.availableRoomsForm.get('fechaFin')?.value;

    // Formateamos las fechas usando el DatePipe
    const formattedFechaInicio = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
    const formattedFechaFin = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');

    this.webService.getAvailableRooms(formattedFechaInicio, formattedFechaFin, id).subscribe((rooms) => {
      this.rooms = rooms;
      console.log('Habitaciones disponibles selección:', this.rooms);
      this.buildDataSource();
    });
  }
}
