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
    type: 'group',
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
            title: 'Listado alojamiento',
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
    id: 'tarifas-disponibilidad',
    title: 'Tarifas y disponibilidad',
    type: 'admin',
    icon: 'icon-navigation',
    children: [
      {
        id: 'gestion-tarifas-disponibilidad',
        title: 'Gestión',
        type: 'collapse',
        icon: 'bi bi-calendar',
        children: [
          {
            id: 'calendario',
            title: 'Calendario',
            type: 'item',
            url: '/dashboard/calendario',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'tarifas',
            title: 'Planes de tarifas',
            type: 'item',
            url: '/dashboard/tarifas',
            target: true,
            breadcrumbs: false
          }
        ]
      }
    ]
  },
  {
    id: 'booking',
    title: 'Booking',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'reservas',
        title: 'Reservas',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/reservas',
        icon: 'bi bi-list-ul'
      },
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'ti ti-brand-chrome'
      },
      {
        id: 'document',
        title: 'Document',
        type: 'item',
        classes: 'nav-item',
        url: 'https://codedthemes.gitbook.io/berry-angular/',
        icon: 'ti ti-vocabulary',
        target: true,
        external: true
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
