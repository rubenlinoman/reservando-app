// Angular import
import { Component, computed, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  private authService = inject(AuthService);
  public readonly apiUrl = environment.apiUrl;

  public user = computed(() => this.authService.currentUser());

  /**
   * Metodo que llama al logout
   */
  onLogout() {
    this.authService.logout();
  }

}
