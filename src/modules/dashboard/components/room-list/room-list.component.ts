import { ChangeDetectorRef, Component, ViewChild, computed, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { Alojamiento, Habitacion, TipoHabitacion } from 'src/modules/shared/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { RoomImagesComponent } from './room-images/room-images.component';
import { EditRoomComponent } from './edit-room/edit-room.component';

@Component({
  selector: 'dashboard-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public readonly apiUrl = environment.apiUrl;
  public user = computed(() => this.authService.currentUser());

  public roomRows: Habitacion[] = [];

  public accommodationList: Alojamiento[] = [];
  private roomTypes: TipoHabitacion[] = [];

  public selectedChip: boolean[] = [];

  public columns: TableHeader[] = [
    {
      columnDef: 'idHabitacion',
      header: 'id',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.idHabitacion}`
    },
    {
      columnDef: 'nombreAlojamiento',
      header: 'Nombre',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.nombreHabitacion}`
    },
    {
      columnDef: 'descripcion',
      header: 'Descripción',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.descripcion}`
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
      columnDef: 'enOferta',
      header: 'En oferta',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => {
        return element.enOferta ? 'Sí' : 'No';
      }
    },
    {
      columnDef: 'descuento',
      header: 'Descuento',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => `${element.descuento}`
    },
    {
      columnDef: 'idTipoHabitacion',
      header: 'Tipo',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) =>
        `${this.roomTypes?.find((type) => type.idTipoHabitacion == element.idTipoHabitacion)?.nombreTipoHabitacion}`
    },
    {
      columnDef: 'imagen',
      header: 'imagen',
      iconoTh: false,
      iconoTd: true,
      cell: (element: Habitacion) => `<img src="${element.imagen}" alt="Imagen" width="50" height="50">`
    },
    {
      columnDef: 'editar',
      header: '',
      cell: (element: Habitacion) => ``
    },
    {
      columnDef: 'eliminar',
      header: '',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Habitacion) => ``
    }
  ];

  public displayedColumns = this.columns.map((c) => c.columnDef);
  public dataSource: MatTableDataSource<Habitacion>;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild('empTbSort') empTbSort = new MatSort();

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();

    const currentUserType = this.user().idTipoUsuario;

    // Si el usuario es administrador
    if (currentUserType === 3) {
      // Obtenemos todas las habitaciones de la base de datos
      forkJoin([
        this.dashboardService.getAllRooms(),
        this.dashboardService.getRoomTypes()
      ]).subscribe({
        next: ([rooms, roomTypes]) => {
          // Asignamos las habitaciones a roomRows
          this.roomRows = rooms as Habitacion[];
          this.roomTypes = roomTypes as TipoHabitacion[];
          this.buildDataSource();
        }
      });
    } else {
      // Si el usuario es un usuario normal
      forkJoin([
        this.dashboardService.getAccommodationsByUser(this.user().idUsuario, this.user().idTipoUsuario),
        this.dashboardService.getRoomTypes()
      ]).subscribe({
        next: ([accommodations, roomTypes]) => {
          this.accommodationList = accommodations as Alojamiento[];
          this.roomTypes = roomTypes as TipoHabitacion[];

          this.selectFirstAccommodation();
        }
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
    this.dataSource = new MatTableDataSource(this.roomRows);
    this.dataSource.paginator = this.paginator;
    this.empTbSort.disableClear = true;
    this.dataSource.sort = this.empTbSort;
  }

  /**
   * Método para seleccionar un alojamiento y mostrar sus habitaciones
   * @param accommodation - Alojamiento
   */
  clickChip(accommodation: Alojamiento): void {

    this.dashboardService.getRoomsByAccommodationId(accommodation.idAlojamiento).subscribe((resp) => {
      this.roomRows = resp as Habitacion[]; // Asignamos las habitaciones a roomRows
      this.dataSource = new MatTableDataSource(this.roomRows);
    });
  }

  private selectFirstAccommodation() {
    if (this.accommodationList && this.accommodationList.length > 0) {
      this.clickChip(this.accommodationList[0]);

      this.accommodationList.forEach((accommodation, index) => {
        this.selectedChip[index] = index === 0;
      });
    }
  }

  /**
   * Método para confirmar la eliminación de una habitación
   * @param idHabitacion - ID de la habitación
   */
  confirmRoomDelete(idHabitacion: number) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que quiere eliminar definitivamente la habitación?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRoom(idHabitacion);
      } else if (result.isDenied) {
      }
    });
  }

    /**
   * Método para mostrar la imagen en un dialog
   * @param archivo - Archivo
   */
    showImage(imagen: string) {
      const dialogRef = this.dialog.open(RoomImagesComponent, {
        data: { imagen: imagen }
      });
    }

    /**
     * Método para editar el contenido de una habitación
     * @param idHabitacion - ID de la habitación
     */
    editRoom(idHabitacion: number) {
      const dialogRef = this.dialog.open(EditRoomComponent, {
        data: { idHabitacion: idHabitacion },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== false && result !== undefined) {

          // Buscar el alojamiento en la lista
          const index = this.roomRows.findIndex((element) => element.idHabitacion == result.idHabitacion);

          // Verificar si se encontro
          if (index !== -1) {
            // Actualizar solo los campos modificados
            this.roomRows[index].nombreHabitacion = result.nombreHabitacion;
            this.roomRows[index].descripcion = result.descripcion;
            this.roomRows[index].capacidad = result.capacidad;
            this.roomRows[index].precio = result.precio;
            this.roomRows[index].enOferta = result.enOferta;
            this.roomRows[index].descuento = result.descuento;
            this.roomRows[index].idTipoHabitacion = result.idTipoHabitacion;

            // Si la imagen no está vacía, actualizarla
            if (result.imagen !== '') {
              // Obtener la información actualizada del alojamiento, incluida la imagen
              this.dashboardService.getRoomById(result.idHabitacion).subscribe((updatedRoom: Habitacion) => {
                // Actualizar la imagen del alojamiento en la lista
                this.roomRows[index].imagen = updatedRoom.imagen;
                // Reconstruir el dataSource
                this.buildDataSource();
              });
            } else {
              // Reconstruir el dataSource
              this.buildDataSource();
            }
          }
        }
      });
    }

  /**
   * Método para eliminar una habitación
   * @param idHabitacion - ID de la habitación
   */
  async deleteRoom(idHabitacion: number) {

    // Eliminar de la base de datos
    await this.dashboardService.deleteRoom(idHabitacion).subscribe({
      next: (confirmado: Boolean) => {
        if (confirmado) {
          Swal.fire('Éxito', 'Exito eliminando la imagen', 'success');
          this.roomRows.splice(
            this.roomRows.findIndex((element) => element.idHabitacion == idHabitacion),
            1
          );

          this.buildDataSource();
        } else {
          Swal.fire('Error', 'Error eliminando la imagen de la base', 'error');
        }
      },
      error: (message: any) => {
        Swal.fire('Error', message, 'error');
      }
    });
  }

}
