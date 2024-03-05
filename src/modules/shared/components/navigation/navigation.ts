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
        id: 'mis-reservas',
        title: 'Mis reservas',
        type: 'collapse',
        icon: 'bi bi-calendar-check',
        children: [
          {
            id: 'listado-reservas',
            title: 'Listado reservas',
            type: 'item',
            url: '/dashboard/reservas/listado-reservas',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'nueva-reserva',
            title: 'Nueva reserva',
            type: 'item',
            url: '/dashboard/reservas/nueva-reserva',
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
    type: 'propietario',
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
    id: 'usuarios',
    title: 'Usuarios',
    type: 'admin',
    icon: 'icon-navigation',
    children: [
      {
        id: 'gestion-usuarios',
        title: 'Gestión de Usuarios',
        type: 'collapse',
        icon: 'bi bi-people',
        children: [
          {
            id: 'listado-usuarios',
            title: 'Listado de Usuarios',
            type: 'item',
            url: '/dashboard/usuarios/listado',
            icon: 'bi bi-list-ul'
          },
          {
            id: 'crear-usuario',
            title: 'Crear Usuario',
            type: 'item',
            url: '/dashboard/usuarios/crear',
            icon: 'bi bi-person-plus'
          }
        ]
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
