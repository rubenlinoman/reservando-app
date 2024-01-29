import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LayoutPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    WebRoutingModule,
  ]
})
export class WebModule { }
