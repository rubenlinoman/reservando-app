import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccommodationListComponent } from './components/accommodation-list/accommodation-list.component';
import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { DefaultComponent } from 'src/app/demo/default/default.component';
import { ElementColorComponent } from 'src/app/demo/elements/element-color/element-color.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NewAccommodationComponent } from './components/new-accommodation/new-accommodation.component';
import { ReservationPageComponent } from './pages/reservation-page/reservation-page.component';
import { TypographyComponent } from 'src/app/demo/elements/typography/typography.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { NewRoomComponent } from './components/new-room/new-room.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'color', component: ElementColorComponent },
      { path: 'default', component: DefaultComponent} ,
      { path: 'inicio', component: HomePageComponent},
      { path: 'alojamientos', component: AccommodationPageComponent, children: [
        { path: 'listado-alojamientos', component: AccommodationListComponent},
        { path: 'nuevo-alojamiento', component: NewAccommodationComponent},
        { path: '**', redirectTo: 'listado-alojamientos'},
      ]},
      { path: 'habitaciones', component: RoomPageComponent, children: [
        { path: 'listado-habitaciones', component: RoomListComponent},
        { path: 'nueva-habitacion', component: NewRoomComponent},
        { path: '**', redirectTo: 'listado-alojamientos'},
      ]},
      { path: 'reservas', component: ReservationPageComponent, children: [
        { path: 'listado-reservas', component: ReservationListComponent},
        { path: '**', redirectTo: 'listado-reservas'},
      ]},
      { path: 'typography', component: TypographyComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
