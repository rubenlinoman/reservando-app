import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebService } from '../../services/web.service';
import { Alojamiento } from 'src/modules/shared/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'web-accommodation-page',
  templateUrl: './accommodation-page.component.html',
  styleUrls: ['./accommodation-page.component.css']
})
export class AccommodationPageComponent {
  public accommodations: Alojamiento[] = [];
  public readonly apiUrl = environment.apiUrl;
  public dataSource: MatTableDataSource<Alojamiento>;
  public obs: Observable<any>;
  public searchText: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private webService: WebService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.webService.getAllAccommodationsNoTokenCheck().subscribe((accommodations) => {
      this.accommodations = accommodations;
      this.dataSource = new MatTableDataSource(this.accommodations);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
      // Esta llamada asegura que la vista se actualice con los cambios
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  /**
   * Metodo para filtrar
   * @param event - Evento de filtro
   */
  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
