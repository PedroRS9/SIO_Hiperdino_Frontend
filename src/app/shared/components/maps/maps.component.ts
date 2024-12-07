import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

let L: any; // Declarar Leaflet como variable global

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements AfterViewInit {
  private map: any;

  // Variables para coordenadas (pueden ser configuradas dinámicamente)
  startPoint: [number, number] = [28.139585890118067, -15.435252487877555];
  endPoint: [number, number] = [28.129059491654008, -15.449580303219944];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      // Cargar Leaflet y Leaflet Routing Machine dinámicamente
      L = await import('leaflet');
      await import('leaflet-routing-machine');

      // Inicializar el mapa
      this.map = L.map('map').setView(this.startPoint, 13);

      // Agregar capa base
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Agregar la ruta al mapa
      L.Routing.control({
        waypoints: [
          L.latLng(this.startPoint[0], this.startPoint[1]), // Punto A
          L.latLng(this.endPoint[0], this.endPoint[1]),    // Punto B
        ],
        routeWhileDragging: true, // Permite arrastrar puntos en el mapa
      }).addTo(this.map);
    }
  }

  // Método para actualizar las coordenadas dinámicamente
  updateRoute(start: [number, number], end: [number, number]): void {
    this.startPoint = start;
    this.endPoint = end;

    if (this.map) {
      this.map.setView(this.startPoint, 13); // Recentrar el mapa en el nuevo punto de inicio

      // Agregar nueva ruta al mapa
      L.Routing.control({
        waypoints: [
          L.latLng(this.startPoint[0], this.startPoint[1]), // Nuevo punto A
          L.latLng(this.endPoint[0], this.endPoint[1]),    // Nuevo punto B
        ],
        routeWhileDragging: true,
      }).addTo(this.map);
    }
  }

  parseCoordinates(input: string): [number, number] {
    const [lat, lng] = input.split(',').map(coord => parseFloat(coord.trim()));
    return [lat, lng];
  }
  
}
