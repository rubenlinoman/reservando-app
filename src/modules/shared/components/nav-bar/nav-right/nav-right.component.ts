// Angular import
import { Component, inject } from '@angular/core';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  private authService = inject(AuthService);

  /**
   * Metodo que llama al logout
   */
  onLogout() {
    this.authService.logout();
  }
}
