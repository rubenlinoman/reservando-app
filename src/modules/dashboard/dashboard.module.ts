import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ReservationsPageComponent } from './pages/reservations-page/reservations-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    HomePageComponent,
    ReservationsPageComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
})
export class DashboardModule { }
