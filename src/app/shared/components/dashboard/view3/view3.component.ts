import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgForOf} from '@angular/common';
import {DataService} from '../../../../core/services/dataservice/data-service.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/authservice/authservice.service';

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

  constructor(private http: HttpClient, private dataService: DataService, private router: Router) {}

  private ordersUrl = 'http://localhost:8080/orders';

  ngOnInit() {
    const url: string = this.ordersUrl;
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.filteredOrders = response; // Inicialmente, no hay filtros
        this.filteredOrders.sort((a, b) => a.id - b.id);
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
      case 'warehouseName': return order.warehouse.name;
      case 'storeName': return order.store.name;
      case 'productName': return order.productName;
      case 'quantity': return order.quantity;
      default: return '';
    }
  }

  viewRoute(order: any) {
    this.dataService.sendData({ value1: order.warehouse.location, value2: order.store.location });
    this.router.navigate(['/dashboard/maps']).then(r => console.log('Navegación a /dashboard/maps:', r));
  }

  deliverOrder(order: any) {
    this.http.put(`${this.ordersUrl}/${order.id}/delivered`, {}, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Orden entregada:', response);
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al entregar la orden:', error);
      }
    );
  }
}
