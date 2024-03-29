// Angular import
import { Component, NgZone, computed, inject } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// Project import
import { AuthService } from '../../auth/services/auth.service';
import { ReservAndoConfig } from '../reservando-config';

@Component({
  selector: 'dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {

  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());


  // public props
  ReservAndoConfig;
  navCollapsed: boolean;
  navCollapsedMob = false;
  windowWidth: number;

  // Constructor
  constructor(
    private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy
  ) {
    this.ReservAndoConfig = ReservAndoConfig;

    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    if (current_url === baseHref + '/layout/theme-compact' || current_url === baseHref + '/layout/box') {
      this.ReservAndoConfig.isCollapse_menu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? ReservAndoConfig.isCollapse_menu : false;
  }

  public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  // navMobClick() {
  //   this.navCollapsedMob = !this.navCollapsedMob;
  // }


}
