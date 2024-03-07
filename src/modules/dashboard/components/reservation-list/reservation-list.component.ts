import { ChangeDetectorRef, Component, ViewChild, computed, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { EstadoReserva, Reserva } from 'src/modules/shared/interfaces';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EditReservationComponent } from './edit-reservation/edit-reservation.component';

@Component({
  selector: 'dashboard-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  public readonly apiUrl = environment.apiUrl;
  public datePipe = new DatePipe('es-ES', 'GTM+2');

  public user = computed(() => this.authService.currentUser());

  public reservationRows: Reserva[] = [];

  private reservationStatus: EstadoReserva[] = [];

  public columns: TableHeader[] = [
    {
      columnDef: 'idReserva',
      header: 'id',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) => `${element.idReserva}`
    },
    {
      columnDef: 'nombreUsuario',
      header: 'Nombre del huesped',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) => `${element.nombreUsuario} ${element.apellidosUsuario}`
    },
    {
      columnDef: 'nombreAlojamiento',
      header: 'Alojamiento',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) => `${element.nombreAlojamiento}`
    },
    {
      columnDef: 'nombreHabitacion',
      header: 'Habitación',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) => `${element.nombreHabitacion}`
    },
    {
      columnDef: 'idEstadoReserva',
      header: 'Estado',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) =>
        `${this.reservationStatus?.find((type) => type.idEstadoReserva == element.idEstadoReserva)?.nombreEstadoReserva}`
    },
    {
      columnDef: 'fechaInicio',
      header: 'Fecha entrada',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) => `${this.datePipe.transform(element.fechaInicio, 'shortDate')}`
    },
    {
      columnDef: 'fechaFin',
      header: 'Fecha salida',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Reserva) => `${this.datePipe.transform(element.fechaFin, 'shortDate')}`
    },
    {
      columnDef: 'editar',
      header: '',
      cell: (element: Reserva) => ``
    },
    {
      columnDef: 'ver',
      header: '',
      cell: (element: Reserva) => ``
    }
  ];

  public displayedColumns = this.columns.map((c) => c.columnDef);
  public dataSource: MatTableDataSource<Reserva>;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild('empTbSort') empTbSort = new MatSort();

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.dashboardService.getReservationStatus().subscribe((status) => {
      this.reservationStatus = status as EstadoReserva[];
    });
  }

  ngAfterViewInit() {
    if (this.user().idTipoUsuario > 1) {
      this.dashboardService.getReservationsByOwner(this.user().idUsuario, this.user().idTipoUsuario).subscribe((reservations) => {
        this.dataSource = new MatTableDataSource(reservations);
        this.dataSource.paginator = this.paginator;
        this.empTbSort.disableClear = true;
        this.dataSource.sort = this.empTbSort;
        this.reservationRows = reservations;
      });
    } else {
      this.dashboardService.getReservationsByUser(this.user().idUsuario).subscribe((reservations) => {
        this.dataSource = new MatTableDataSource(reservations);
        this.dataSource.paginator = this.paginator;
        this.empTbSort.disableClear = true;
        this.dataSource.sort = this.empTbSort;
        this.reservationRows = reservations;
      });
    }
  }

  /**
   * Metodo para filtrar
   * @param event - Evento de filtro
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método para construir el datasource
   */
  buildDataSource() {
    this.dataSource = new MatTableDataSource(this.reservationRows);
    this.dataSource.paginator = this.paginator;
    this.empTbSort.disableClear = true;
    this.dataSource.sort = this.empTbSort;
  }

  /**
   * Método que lanza el componente de edición de reserva
   * @param idReserva - ID de la reserva
   */
  editReservation(idReserva: number) {
    const dialogRef = this.dialog.open(EditReservationComponent, {
      data: { idReserva: idReserva }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== false && result !== undefined) {
        // Buscar el alojamiento en la lista
        const index = this.reservationRows.findIndex((element) => element.idReserva == result.idReserva);

        // Verificar si se encontro
        if (index !== -1) {
          // Actualizar solo los campos modificados
          this.reservationRows[index].fechaInicio = result.fechaInicio;
          this.reservationRows[index].fechaFin = result.fechaFin;
          this.reservationRows[index].idEstadoReserva = result.idEstadoReserva;

          this.buildDataSource();
        }
      }
    });
  }
}
