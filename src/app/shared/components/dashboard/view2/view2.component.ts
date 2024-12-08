import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view2',
  standalone: true,
  templateUrl: './view2.component.html',
  styleUrls: ['./view2.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class View2Component implements OnInit {
  
  public inventories: any[] = []; // Datos originales
  public filteredInventories: any[] = []; // Datos filtrados
  public uniqueStores: string[] = []; // Lista única de tiendas
  public filterText: string = ''; // Texto del filtro
  public sortColumn: string = ''; // Columna por la que se ordena
  public sortDirection: 'asc' | 'desc' = 'asc'; // Dirección de la ordenación

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const url: string = 'http://localhost:8080/inventories'; // Cambia la URL si es necesario
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.inventories = response;
        this.filteredInventories = response; // Inicialmente, no hay filtros
        this.uniqueStores = this.getUniqueStores(); // Genera la lista de tiendas únicas
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }

  applyFilter(): void {
    const lowerCaseFilter = this.filterText.toLowerCase();
    this.filteredInventories = this.inventories.filter(inventory =>
      inventory.product.name.toLowerCase().includes(lowerCaseFilter) || // Filtra por nombre del producto
      inventory.store.name.toLowerCase().includes(lowerCaseFilter) ||  // Filtra por nombre de la tienda
      inventory.store.location.toLowerCase().includes(lowerCaseFilter) // Filtra por ubicación
    );
  }

  getUniqueStores(): string[] {
    return [...new Set(this.inventories.map(inv => inv.store.name))]; // Extrae nombres únicos de tiendas
  }

  filterByStore(store: string): void {
    this.filteredInventories = this.inventories.filter(inv => inv.store.name === store);
  }

  clearFilter(): void {
    this.filteredInventories = [...this.inventories]; // Resetea la lista filtrada a la original
    this.filterText = ''; // Limpia el texto del filtro
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
    this.filteredInventories.sort((a, b) => {
      const valueA = this.getColumnValue(a, column);
      const valueB = this.getColumnValue(b, column);

      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });
  }

  private getColumnValue(inventory: any, column: string): any {
    switch (column) {
      case 'id': return inventory.id;
      case 'product': return inventory.product.name;
      case 'price': return inventory.product.price;
      case 'quantity': return inventory.quantity;
      case 'store': return inventory.store.name;
      default: return '';
    }
  }
}
