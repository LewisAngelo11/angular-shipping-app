import { Component, Inject, signal, viewChild, viewChildren } from '@angular/core';
import type { Location } from '../models/location';
import { GoogleMap, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-sucursal',
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow, HeaderComponent, FooterComponent],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent {

  infoWindow = viewChild.required(MapInfoWindow);
  markerReference = viewChildren(MapAdvancedMarker);

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

  goToPlace(location: Location, position: number){
    const markers = this.markerReference();
    const markerRef = markers[position];

    this.openInfoWindow(location, markerRef)
  }

  // Funcion para abrir la pestaña de infrmación del marker seleccionado
  openInfoWindow(location: Location, marker: MapAdvancedMarker) {
    console.log('Marker clicked:', location)
    const contenido = `
      <p><i class='bx bx-package' style="font-size: 40px; margin: 10px 10px;"></i></p>
      <h2 class="font-bold text-xl" style="margin: 10px 10px">${location.name}</h2>
      <p style="margin: 10px 10px">${location.description}</p>
      `;
    this.infoWindow().open(marker, false, contenido);
  }

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 })
  zoom = signal(14)

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
      description: 'Adolfo López Mateos, Blvd. Juan de Dios Bátiz y, 81200 Los Mochis, Sin.',
      latitude: 25.801682,
      longitude: -108.985904,
    },
    {
      id: 4,
      name: 'Sucursal Norte',
      description: 'Plaza Viñedos, Blvd. Antonio Rosales 2211, Viñedos, 81228 Los Mochis, Sin.',
      latitude: 25.81678452,
      longitude: -108.98279517,
    },
    {
      id: 5,
      name: 'Sucursal Sur',
      description: 'Blvrd Pedro Anaya No. 805 Poniente, Ejido Francisco Villa, 81278 Los Mochis, Sin.',
      latitude: 25.7620389,
      longitude: -108.995824,
    },
  ]);
}