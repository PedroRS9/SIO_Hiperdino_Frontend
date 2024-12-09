import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-view1',
  standalone: true,
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css'],
  imports: [HttpClientModule]
})
export class View1Component implements OnInit {
  public inventories: any[] = [];
  
  // Propiedades para mostrar métricas en el dashboard
  public totalMaxStock: number = 0;
  public totalOccupied: number = 0;
  public totalCapacity: number = 0;
  public percentageOccupied: number = 0;
  public percentageFree: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const url: string = 'http://localhost:8080/inventories';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.inventories = response ?? []; 
        this.calcularMétricas();
        this.createChart();
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }

  calcularMétricas(): void {
    this.totalMaxStock = this.inventories.reduce((sum, item) => sum + item.product.maxStock, 0);
    this.totalOccupied = this.inventories.reduce((sum, val) => sum + val.quantity, 0);
    this.totalCapacity = this.inventories.reduce((sum, val) => sum + val.product.maxStock, 0);
    this.percentageOccupied = (this.totalOccupied / this.totalCapacity) * 100;
    this.percentageFree = 100 - this.percentageOccupied;
  }

  sumMaxStock(): void {
    let totalMaxStock = 0;
    for (let item of this.inventories) {
      totalMaxStock += item.product.maxStock;
    }
    console.log('La suma de todos los valores maxStock es:', totalMaxStock);
  }

  createChart(): void {
    Chart.register(...registerables);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [{
          label: 'Órdenes Procesadas',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    const ctx2 = document.getElementById('storageChart') as HTMLCanvasElement;
    new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: ['Ocupado', 'Libre'],
        datasets: [{
          data: [this.percentageOccupied, this.percentageFree],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Porcentaje de Almacenamiento Ocupado'
          }
        }
      }
    });
  }
}
