import { Component, Inject, signal } from '@angular/core';
import type { Location } from '../models/location';
import { GoogleMap } from '@angular/google-maps';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-sucursal',
  imports: [GoogleMap],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  latitud!: number;
  longitud!: number;

  // Función asincrona para obtener la ubicación del usuario y plasmarla en el mapa.
  async ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      try{
        const { latitud, longitud } = await this.solicitarUbicacion();
        this.center.set({ lat: latitud, lng: longitud });
      } catch (error) {
        console.error('No se pudo obtener la ubicación del usuario:', error);
      }
    }
  }

  // Función para solicitar la ubicacion actual del usuario
  solicitarUbicacion(): Promise<{ latitud: number, longitud: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error al obtener ubicación:', error.message);
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocalización no soportada'));
      }
    });
  }

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 })
  zoom = signal(13)

  $locations = signal<Location[]>([
    {
      id: 1,
      name: 'Sucursal Centro',
      description: 'Av. Independencia 367 Centro, Av. Gabriel Leyva 275, 81200 Los Mochis Sin. México',
      latitude: 25.7899682,
      longitude: -108.9942564,
    },
    {
      id: 2,
      name: 'Sucursal Campus Los Mochis',
      description: 'Blvd Canuto Ibarra Guerrero 906-Sur, Residencial del Country, Campestre II Primera Secc 81248 Los Mochis, Sin. México',
      latitude: 25.7919351,
      longitude: -109.0111866,
    },
    {
      id: 3,
      name: 'Sucursal Campeon Los Mochis',
      description: 'Description 3',
      latitude: 0,
      longitude: 0,
    },
    {
      id: 4,
      name: 'Sucursal Sur',
      description: 'Description 4',
      latitude: 0,
      longitude: 0,
    },
  ]);
}
