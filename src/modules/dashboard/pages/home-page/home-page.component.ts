import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { Reserva } from 'src/modules/shared/interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'dasboard-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements AfterViewInit {
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  private dashboardService = inject(DashboardService);
  public totalReservations: Reserva[] = [];

  constructor() {}

  async ngAfterViewInit() {
    try {
      if (this.user().idTipoUsuario > 1) {
        const reservations = await firstValueFrom(this.dashboardService.getReservationsByOwner(this.user().idUsuario, this.user().idTipoUsuario));
        this.totalReservations = reservations;
      } else {
        const reservations = await firstValueFrom(this.dashboardService.getReservationsByUser(this.user().idUsuario));
        this.totalReservations = reservations;
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }
}
