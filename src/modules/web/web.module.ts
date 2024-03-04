import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';

import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ImageDetailsComponent } from './pages/details-page/image-details/image-details.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SharedModule } from '../shared/shared.module';
import { BookingRoomComponent } from './pages/details-page/booking-room/booking-room.component';


@NgModule({
  declarations: [
    AccommodationPageComponent,
    BookingRoomComponent,
    DetailsPageComponent,
    HomePageComponent,
    ImageDetailsComponent,
    LayoutPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    WebRoutingModule,
  ]
})
export class WebModule { }
