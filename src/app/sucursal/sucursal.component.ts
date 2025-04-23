import { Component, signal } from '@angular/core';
import type { Location } from '../models/location';

@Component({
  selector: 'app-sucursal',
  imports: [],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent {
  $locations = signal<Location[]>([
    {
      id: 1,
      name: 'Sucursal Centro Los Mochis',
      description: 'Description 1',
      latitude: 0,
      longitude: 0,
    },
  ]);
}
