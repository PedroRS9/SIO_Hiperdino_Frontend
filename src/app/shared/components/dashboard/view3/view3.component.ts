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
  public sortColumn: string = ''; // Columna por la que se ordena
  public sortDirection: 'asc' | 'desc' = 'asc'; // Dirección de la ordenación

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

  sort(column: string): void {
    if (this.sortColumn === column) {
      // Si la columna ya está seleccionada, cambia la dirección
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una nueva columna, selecciona esta y ordena ascendente
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.filteredOrders.sort((a, b) => {
      const valueA = this.getColumnValue(a, column);
      const valueB = this.getColumnValue(b, column);

      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });
  }

  private getColumnValue(order: any, column: string): any {
    switch (column) {
      case 'id': return order.id;
      case 'warehouseName': return order.warehouseName;
      case 'storeName': return order.storeName;
      case 'productName': return order.productName;
      case 'quantity': return order.quantity;
      default: return '';
    }
  }
}
