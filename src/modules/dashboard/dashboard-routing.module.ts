import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccommodationsListComponent } from './components/accommodations-list/accommodation-list.component';
import { AccommodationsPageComponent } from './pages/accommodations-page/accommodations-page.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { DefaultComponent } from 'src/app/demo/default/default.component';
import { ElementColorComponent } from 'src/app/demo/elements/element-color/element-color.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NewAccommodationComponent } from './components/new-accommodation/new-accommodation.component';
import { ReservationsPageComponent } from './pages/reservations-page/reservations-page.component';
import { TypographyComponent } from 'src/app/demo/elements/typography/typography.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'color', component: ElementColorComponent },
      { path: 'default', component: DefaultComponent} ,
      { path: 'inicio', component: HomePageComponent},
      { path: 'alojamientos', component: AccommodationsPageComponent, children: [
        { path: 'listado-alojamientos', component: AccommodationsListComponent},
        { path: 'nuevo-alojamiento', component: NewAccommodationComponent},
        { path: '**', redirectTo: 'listado-alojamientos'},
      ]},
      { path: 'reservas', component: ReservationsPageComponent},
      { path: 'typography', component: TypographyComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
