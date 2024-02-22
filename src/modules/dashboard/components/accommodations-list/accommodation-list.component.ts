import { ChangeDetectorRef, Component, ViewChild, computed, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { Alojamiento } from 'src/modules/shared/interfaces/alojamiento.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/modules/auth/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AccommodationImagesComponent } from './accommodation-images/accommodation-images.component';
import { EditAccommodationComponent } from './edit-accommodation/edit-accommodation.component';
import { TipoAlojamiento } from 'src/modules/shared/interfaces';

@Component({
  selector: 'dashboard-accommodations-list',
  templateUrl: './accommodation-list.component.html',
  styleUrl: './accommodation-list.component.css'
})
export class AccommodationsListComponent {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  public readonly apiUrl = environment.apiUrl;
  public user = computed(() => this.authService.currentUser());

  public accommodationRows: Alojamiento[] = [];

  private accommodationTypes: TipoAlojamiento[] = [];

  public img: string = '';

  public columns: TableHeader[] = [
    {
      columnDef: 'idAlojamiento',
      header: 'id',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.idAlojamiento}`
    },
    {
      columnDef: 'nombreAlojamiento',
      header: 'Nombre',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.nombreAlojamiento}`
    },
    {
      columnDef: 'descripcion',
      header: 'Descripción',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.descripcion}`
    },
    {
      columnDef: 'capacidad',
      header: 'Capacidad',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.capacidad}`
    },
    {
      columnDef: 'direccion',
      header: 'Dirección',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.direccion}`
    },
    {
      columnDef: 'ciudad',
      header: 'Lugar',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.ciudad}`
    },
    {
      columnDef: 'idTipoAlojamiento',
      header: 'Tipo',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) =>
        `${this.accommodationTypes?.find((type) => type.idTipoAlojamiento == element.idTipoAlojamiento)?.nombreTipoAlojamiento}`
    },
    {
      columnDef: 'imagen',
      header: 'imagen',
      iconoTh: false,
      iconoTd: true,
      cell: (element: Alojamiento) => `<img src="${element.imagen}" alt="Imagen" width="50" height="50">`
    },
    {
      columnDef: 'editar',
      header: '',
      cell: (element: Alojamiento) => ``
    },
    {
      columnDef: 'eliminar',
      header: '',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => ``
    }
  ];

  public displayedColumns = this.columns.map((c) => c.columnDef);
  public dataSource: MatTableDataSource<Alojamiento>;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild('empTbSort') empTbSort = new MatSort();

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();

    this.dashboardService.getAccommodationTypes().subscribe((types) => {
      this.accommodationTypes = types as TipoAlojamiento[];
    });
  }

  /**
   * Método que se ejecuta cuando se inicializa el componente
   */
  async ngAfterViewInit() {
    this.dashboardService.getAccommodationsByUser(this.user().idUsuario, this.user().idTipoUsuario).subscribe((accommodationslist: any) => {
      this.dataSource = new MatTableDataSource(accommodationslist);
      this.dataSource.paginator = this.paginator;
      this.empTbSort.disableClear = true;
      this.dataSource.sort = this.empTbSort;
      this.accommodationRows = accommodationslist;
    });
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
    this.dataSource = new MatTableDataSource(this.accommodationRows);
    this.dataSource.paginator = this.paginator;
    this.empTbSort.disableClear = true;
    this.dataSource.sort = this.empTbSort;
  }

  /**
   * Método para confirmar la eliminación de un alojamiento
   * @param idAlojamiento - ID del alojamiento
   */
  confirmAccommodationDelete(idAlojamiento: number) {
    // Obtener las habitaciones asociadas al alojamiento
    this.dashboardService.getRoomsByAccommodationId(idAlojamiento).subscribe({
      next: (rooms: any) => {
        // Verificar si hay habitaciones asociadas
        if (rooms && rooms.length > 0) {
          // Si hay habitaciones asociadas, mostrar un mensaje de advertencia
          Swal.fire('Advertencia', 'No se puede eliminar el alojamiento porque tiene habitaciones', 'warning');
        } else {
          // Si no hay habitaciones asociadas, mostrar la confirmación de eliminación
          Swal.fire({
            title: 'Confirmación',
            text: '¿Seguro que quiere eliminar definitivamente el alojamiento?',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              // Si se confirma la eliminación, llamar al método para eliminar el alojamiento
              this.deleteAccommodation(idAlojamiento);
            } else if (result.isDenied) {
              // Si se niega la eliminación, no hacer nada
            }
          });
        }
      },
      error: (error: any) => {
        // Manejar cualquier error que ocurra al obtener las habitaciones
        console.error('Error obteniendo las habitaciones:', error);
        Swal.fire('Error', 'Ha ocurrido un error obteniendo las habitaciones', 'error');
      }
    });
  }


  /**
   * Método para eliminar un alojamiento
   * @param idAlojamiento - ID del alojamiento
   */
  async deleteAccommodation(idAlojamiento: number) {
    // Eliminar de la base de datos
    await this.dashboardService.deleteAccommodation(idAlojamiento).subscribe({
      next: (confirmado: Boolean) => {
        if (confirmado) {
          Swal.fire('Éxito', 'Exito eliminando el alojamiento', 'success');
          this.accommodationRows.splice(
            this.accommodationRows.findIndex((element) => element.idAlojamiento == idAlojamiento),
            1
          );
          this.buildDataSource();
        } else {
          Swal.fire('Error', 'Error eliminando el alojamiento de la base de datos', 'error');
        }
      },
      error: (message: any) => {
        Swal.fire('Error', message, 'error');
      }
    });
  }

  /**
   * Método para mostrar la imagen en un dialog
   * @param archivo - Archivo
   */
  showImage(imagen: string) {
    const dialogRef = this.dialog.open(AccommodationImagesComponent, {
      data: { imagen: imagen }
    });
  }

  /**
   * Método para editar un alojamiento
   * @param idAlojamiento - ID del alojamiento (number)
   */
  editContent(idAlojamiento: number) {
    const dialogRef = this.dialog.open(EditAccommodationComponent, {
      data: { idAlojamiento: idAlojamiento }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== false && result !== undefined) {
        // Buscar el alojamiento en la lista
        const index = this.accommodationRows.findIndex((element) => element.idAlojamiento == result.idAlojamiento);

        // Verificar si se encontro
        if (index !== -1) {
          // Actualizar solo los campos modificados
          this.accommodationRows[index].nombreAlojamiento = result.nombreAlojamiento;
          this.accommodationRows[index].descripcion = result.descripcion;
          this.accommodationRows[index].capacidad = result.capacidad;
          this.accommodationRows[index].direccion = result.direccion;
          this.accommodationRows[index].ciudad = result.ciudad;
          this.accommodationRows[index].idTipoAlojamiento = result.idTipoAlojamiento;

          // Si la imagen no está vacía, actualizarla
          if (result.imagen !== '') {
            // Obtener la información actualizada del alojamiento, incluida la imagen
            this.dashboardService.getAccommodationById(result.idAlojamiento).subscribe((updatedAccommodation: Alojamiento) => {
              // Actualizar la imagen del alojamiento en la lista
              this.accommodationRows[index].imagen = updatedAccommodation.imagen;
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
}
