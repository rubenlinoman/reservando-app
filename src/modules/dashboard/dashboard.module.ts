import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ReservationsPageComponent } from './pages/reservations-page/reservations-page.component';
import { SharedModule } from '../shared/shared.module';
import { AccommodationsPageComponent } from './pages/accommodations-page/accommodations-page.component';
import { AccommodationsListComponent } from './components/accommodations-list/accommodation-list.component';
import { NewAccommodationComponent } from './components/new-accommodation/new-accommodation.component';
import { EditAccommodationComponent } from './components/accommodations-list/editAccommodation/editAccommodation.component';


@NgModule({
  declarations: [
    AccommodationsListComponent,
    AccommodationsPageComponent,
    DashboardLayoutComponent,
    EditAccommodationComponent,
    HomePageComponent,
    NewAccommodationComponent,
    ReservationsPageComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
})
export class DashboardModule { }
