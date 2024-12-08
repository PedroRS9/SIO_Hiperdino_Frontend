import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DataService} from '../../../core/services/dataservice/data-service.service';
import {FormsModule} from '@angular/forms';

let L: any; // Declarar Leaflet como variable global

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule]
})
export class MapsComponent implements AfterViewInit, OnInit {
  private map: any;
  origin: string = "";
  destination: string = "";

  startPoint: [number, number] = [28.139585890118067, -15.435252487877555];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private httpClient: HttpClient, private dataService: DataService) {}

  async ngOnInit() {
    this.dataService.data$.subscribe(data => {
      if (data) {
        this.origin = data.value1;
        this.destination = data.value2;
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      L = await import('leaflet');
      await import('leaflet-routing-machine');

      this.map = L.map('map').setView(this.startPoint, 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      if(this.origin && this.destination) {
        await this.setRoute();
      }
    }
  }

  async setRoute(): Promise<void> {
    const startLocationOnMap = await this.searchLocationOnMap(this.origin);
    const endLocationOnMap = await this.searchLocationOnMap(this.destination);
    this.putMarkerOnMap([startLocationOnMap[0].lat, startLocationOnMap[0].lon], [endLocationOnMap[0].lat, endLocationOnMap[0].lon]);
    this.map.setView(new L.LatLng(startLocationOnMap[0].lat, startLocationOnMap[0].lon), 16);
  }

  async searchLocationOnMap(location: string): Promise<any> {
    return new Promise((resolve) => {
      this.httpClient.get(this.buildUrl(location)).subscribe(
        (response: any) => {
          if (response && response.length > 0) {
            resolve(response);
          } else {
            console.error('No se encontraron coordenadas para la ubicación proporcionada.');
          }
        },
        (error) => {
          console.error('Error en la geocodificación:', error);
        }
      );
    });
  }

  private buildUrl(location: string) {
    return `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
  }

  putMarkerOnMap(startPoint: [number, number], endPoint: [number, number]): void {
    this.removeMarkersAndPolylines();
    L.Routing.control({
      waypoints: [
        L.latLng(startPoint[0], startPoint[1]),
        L.latLng(endPoint[0], endPoint[1]),
      ],
      routeWhileDragging: true,
    }).addTo(this.map);
  }

  private removeMarkersAndPolylines() {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    // remove also the route
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline) {
        this.map.removeLayer(layer);
      }
    });
  }
}
