import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AccommodationListComponent } from './components/accommodation-list/accommodation-list.component';
import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { EditAccommodationComponent } from './components/accommodation-list/edit-accommodation/edit-accommodation.component';
import { EditReservationComponent } from './components/reservation-list/edit-reservation/edit-reservation.component';
import { EditRoomComponent } from './components/room-list/edit-room/edit-room.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NewAccommodationComponent } from './components/new-accommodation/new-accommodation.component';
import { NewRoomComponent } from './components/new-room/new-room.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReservationDetailsComponent } from './components/reservation-list/reservation-details/reservation-details.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationPageComponent } from './pages/reservation-page/reservation-page.component';
import { ResetPasswordComponent } from './components/profile/reset-password/reset-password.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';


@NgModule({
  declarations: [
    AccommodationListComponent,
    AccommodationPageComponent,
    CalendarPageComponent,
    DashboardLayoutComponent,
    EditAccommodationComponent,
    EditReservationComponent,
    EditRoomComponent,
    HomePageComponent,
    NewAccommodationComponent,
    NewRoomComponent,
    ProfileComponent,
    ReservationDetailsComponent,
    ReservationListComponent,
    ReservationPageComponent,
    ResetPasswordComponent,
    RoomListComponent,
    RoomPageComponent,
    UserProfilePageComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    FullCalendarModule
  ],
})
export class DashboardModule { }
