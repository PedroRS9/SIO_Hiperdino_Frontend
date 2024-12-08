import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-view3',
  imports: [HttpClientModule, NgForOf],
  templateUrl: './view3.component.html',
  standalone: true,
  styleUrl: './view3.component.css'
})
export class View3Component implements OnInit{
  public filteredOrders: any[] = []; // Datos filtrados

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const url: string = 'http://localhost:8080/orders'; // Cambia la URL si es necesario
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.filteredOrders = response; // Inicialmente, no hay filtros
        console.log(this.filteredOrders);
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }
}
