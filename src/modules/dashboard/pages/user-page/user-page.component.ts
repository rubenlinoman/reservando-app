import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/modules/auth/interfaces';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EditUserPassComponent } from '../../edit-user-pass/edit-user-pass.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'dashboard-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  private dashboardService = inject(DashboardService);
  public readonly apiUrl = environment.apiUrl;

  public users: Usuario[] = [];
  private userRows: Usuario[] = [];

  public columns: TableHeader[] = [
    {
      columnDef: 'idUsuario',
      header: 'ID',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => `${element.idUsuario}`
    },
    {
      columnDef: 'idTipoUsuario',
      header: 'idTipoUsuario',
      hidden: true,
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => `${element.idTipoUsuario}`
    },
    {
      columnDef: 'nombre',
      header: 'Nombre',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => `${element.nombre}`
    },
    {
      columnDef: 'apellidos',
      header: 'Apellidos',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => `${element.apellidos}`
    },
    {
      columnDef: 'email',
      header: 'Email',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => `${element.email}`
    },
    {
      columnDef: 'password',
      header: 'Password',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => ``,
    },
    {
      columnDef: 'eliminar',
      header: '',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Usuario) => ``
    }
  ];

  public displayedColumns = this.columns.map((c) => c.columnDef);
  public dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild('empTbSort') empTbSort = new MatSort();

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dashboardService.getAllUsers().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.empTbSort.disableClear = true;
      this.dataSource.sort = this.empTbSort;
      this.userRows = users;
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
    this.dataSource = new MatTableDataSource(this.userRows);
    this.dataSource.paginator = this.paginator;
    this.empTbSort.disableClear = true;
    this.dataSource.sort = this.empTbSort;
  }

  /**
   * Método para confirmar la eliminación de un usuario
   * @param idUsuario - ID del usuario
   */
  confirmUserDelete(idUsuario: number, idTipoUsuario: number) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que quiere eliminar definitivamente el usuario?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(idUsuario, idTipoUsuario);
      } else if (result.isDenied) {
      }
    });
  }

  /**
   * Método para borrar un usuario
   * @param idUsuario - ID del usuario
   */
  async deleteUser(idUsuario: number, idTipoUsuario: number) {

    // Realizar las tres solicitudes de verificación en paralelo
    forkJoin([
      this.dashboardService.getAccommodationsByUser(idUsuario, idTipoUsuario),
      this.dashboardService.getReservationsByOwner(idUsuario, idTipoUsuario),
      this.dashboardService.getReservationsByUser(idUsuario)
    ]).subscribe({
      next: ([accommodations, reservationsByOwner, reservationsByUser]) => {
        // Verificar si el usuario tiene alojamientos o reservas asignadas
        if (accommodations.length > 0) {
          Swal.fire('¡Cuidado!', 'No se puede borrar el usuario porque tiene alojamientos', 'warning');
        } else if (reservationsByOwner.length > 0 || reservationsByUser.length > 0) {
          Swal.fire('¡Cuidado!', 'No se puede borrar el usuario porque tiene reservas', 'warning');
        } else {
          // Si no tiene alojamientos ni reservas, proceder con la eliminación del usuario
          this.dashboardService.deleteUser(idUsuario).subscribe({
            next: (confirmado: boolean) => {
              if (confirmado) {
                Swal.fire('Éxito', 'Éxito eliminando el usuario', 'success');
                this.userRows.splice(
                  this.userRows.findIndex(element => element.idUsuario === idUsuario),
                  1
                );
                this.buildDataSource();
              } else {
                Swal.fire('Error', 'Error eliminando el usuario de la base', 'error');
              }
            },
            error: (message: any) => {
              Swal.fire('Error', message, 'error');
            }
          });
        }
      },
      error: (message: any) => {
        Swal.fire('Error', message, 'error');
      }
    });
  }

    /**
   * Método que muestra el componente de cambio de contraseñas.
   * @param idUsuario - ID del usuario
   */
    showPassChange( idUsuario: number, email: string ) {

      const dialogRef = this.dialog.open( EditUserPassComponent, { data: {idUsuario: idUsuario, email: email} });

    }
}
