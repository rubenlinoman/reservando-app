import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'dasboard-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  private dashboardService = inject(DashboardService)
  public totalReservations: number = 0
  constructor() {}

  ngOnInit() {
    if (this.user().idTipoUsuario > 1) {
      this.dashboardService.getReservationsByOwner(this.user().idUsuario, this.user().idTipoUsuario).subscribe((reservations) => {
        this.totalReservations = reservations.length
      });
    } else {
      this.dashboardService.getReservationsByUser(this.user().idUsuario).subscribe((reservations) => {
        this.totalReservations = reservations.length
      });
    }
  }

}
