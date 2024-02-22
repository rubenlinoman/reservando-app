import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SharedModule } from '../shared/shared.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';


@NgModule({
  declarations: [
    AccommodationPageComponent,
    DetailsPageComponent,
    HomePageComponent,
    LayoutPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    WebRoutingModule,
  ]
})
export class WebModule { }
