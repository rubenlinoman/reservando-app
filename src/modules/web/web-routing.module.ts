import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';
import { DetailsPageComponent } from './pages/reservation-page/details-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { BookingRoomComponent } from './pages/reservation-page/booking-room/booking-room.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'alojamiento', component: AccommodationPageComponent },
      { path: 'detalles/:id', component: DetailsPageComponent },
      { path: 'reservar', component: BookingRoomComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
