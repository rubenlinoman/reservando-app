import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard-home',
    title: 'Inicio',
    type: 'cliente',
    icon: 'icon-navigation',
    children: [
      {
        id: 'inicio',
        title: 'Mi ReservAndo',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/inicio',
        icon: 'bi bi-house-door',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'alojamientos',
    title: 'Alojamientos',
    type: 'propietario',
    icon: 'icon-navigation',
    children: [
      {
        id: 'mis-alojamientos',
        title: 'Mis alojamientos',
        type: 'collapse',
        icon: 'bi bi-houses',
        children: [
          {
            id: 'listado-alojamientos',
            title: 'Listado alojamientos',
            type: 'item',
            url: '/dashboard/alojamientos/listado-alojamientos',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'nuevo-alojamiento',
            title: 'Nuevo alojamiento',
            type: 'item',
            url: '/dashboard/alojamientos/nuevo-alojamiento',
            target: false,
            breadcrumbs: false
          }
        ]
      }
    ]
  },
  {
    id: 'habitaciones',
    title: 'Habitaciones',
    type: 'propietario',
    icon: 'icon-navigation',
    children: [
      {
        id: 'mis-habitaciones',
        title: 'Mis habitaciones',
        type: 'collapse',
        icon: 'bi bi-door-closed',
        children: [
          {
            id: 'listado-habitaciones',
            title: 'Listado habitaciones',
            type: 'item',
            url: '/dashboard/habitaciones/listado-habitaciones',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'nueva-habitacion',
            title: 'Nueva habitacion',
            type: 'item',
            url: '/dashboard/habitaciones/nueva-habitacion',
            target: false,
            breadcrumbs: false
          }
        ]
      }
    ]
  },
  {
    id: 'booking',
    title: 'Booking',
    type: 'cliente',
    icon: 'icon-navigation',
    children: [
      {
        id: 'booking',
        title: 'Reservas',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/reservas',
        icon: 'bi bi-list-ul',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'disponibilidad',
    title: 'Disponibilidad',
    type: 'propietario',
    icon: 'icon-navigation',
    children: [
      {
        id: 'calendario',
        title: 'Calendario',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/calendario',
        icon: 'bi bi-calendar3',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'usuarios',
    title: 'Usuarios',
    type: 'admin',
    icon: 'icon-navigation',
    children: [
      {
        id: 'listado-usuarios',
        title: 'Listado de Usuarios',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/usuarios',
        icon: 'bi bi-people',
        breadcrumbs: false
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
