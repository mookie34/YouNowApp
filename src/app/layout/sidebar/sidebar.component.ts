import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})


export class SidebarComponent {
  menu = [
    { label: 'Dashboard', icon: '🏠', route: '/dashboard', exact: true },
    {label: 'Clientes', icon: '👥', route: '/customers' },
    { label: 'Productos', icon: '🛒', route: '/productos' },
    { label: 'Pedidos', icon: '📦', route: '/pedidos' },
    { label: 'Validar pagos', icon: '✅', route: '/validar-pagos' },
    { label: 'Domiciliarios', icon: '🚴‍♂️', route: '/domiciliarios' },
    { label: 'Conciliación', icon: '💲', route: '/conciliacion' },
    { label: 'Configuración', icon: '⚙️', route: '/configuracion' },
  ];
}
