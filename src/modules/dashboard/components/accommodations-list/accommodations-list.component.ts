import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, computed, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { TableHeader } from 'src/modules/shared/interfaces/table-header.interface';
import { Alojamiento } from 'src/modules/shared/interfaces/alojamiento.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Component({
  selector: 'dashboard-accommodations-list',
  templateUrl: './accommodations-list.component.html',
  styleUrl: './accommodations-list.component.css',
})
export class AccommodationsListComponent {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  public columns: TableHeader[] = [
    {
      columnDef: 'idAlojamiento',
      header: 'id',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.idAlojamiento}`,
    },
    {
      columnDef: 'nombreAlojamiento',
      header: 'Nombre',
      iconoTh: false,
      iconoTd: false,
      cell: (element: Alojamiento) => `${element.nombreAlojamiento}`,
    },
  ];

  public displayedColumns = this.columns.map(c => c.columnDef);
  public dataSource: MatTableDataSource<Alojamiento>;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild('empTbSort') empTbSort = new MatSort();

  constructor() {
    this.dashboardService.getAccommodationsByUser(this.user().idUsuario).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.empTbSort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
