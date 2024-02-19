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
import { EditAccommodationComponent } from './components/accommodations-list/edit-accommodation/edit-accommodation.component';
import { RoomsPageComponent } from './pages/rooms-page/rooms-page.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { NewRoomComponent } from './components/new-room/new-room.component';
import { EditRoomComponent } from './components/rooms-list/edit-room/edit-room.component';


@NgModule({
  declarations: [
    AccommodationsListComponent,
    AccommodationsPageComponent,
    DashboardLayoutComponent,
    EditAccommodationComponent,
    EditRoomComponent,
    HomePageComponent,
    NewAccommodationComponent,
    NewRoomComponent,
    ReservationsPageComponent,
    RoomsListComponent,
    RoomsPageComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
})
export class DashboardModule { }
