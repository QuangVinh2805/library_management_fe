import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistical-management',
  templateUrl: './statistical-management.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./statistical-management.css']
})
export class StatisticalManagement implements OnInit {

  currentYear: number = new Date().getFullYear();
  statistics: any[] = [];
  loading: boolean = false;
  chart: any;
  productStatistics: any[] = [];
  productChart: any;


  constructor(private productService: ProductService,
              private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadProductStatistics();
  }

  loadStatistics() {
    this.loading = true;

    this.productService.getBorrowStatistics(this.currentYear).subscribe({
      next: (res) => {
        this.loading = false;

        const rawData = res?.data || [];

        const fullYearData: number[] = new Array(12).fill(0);

        rawData.forEach((item: any) => {
          fullYearData[item.month - 1] = item.borrowCount;
        });

        this.statistics = fullYearData.map((count, index) => ({
          month: index + 1,
          borrowCount: count
        }));

        this.renderChart(fullYearData);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error load statistics", err);
      }
    });
  }

  loadProductStatistics() {
    this.loading = true;

    this.productService.getProductCountByMonth().subscribe({
      next: (res) => {
        this.loading = false;

        const rawData: any[] = res?.data || [];

        const fullYearData: number[] = new Array(12).fill(0);

        rawData.forEach((item: any) => {
          const [year, month] = item.month.split('-').map(Number);
          if (year === this.currentYear) {
            fullYearData[month - 1] = item.total; // BE trả về 'total'
          }
        });

        this.productStatistics = fullYearData.map((count, index) => ({
          month: index + 1,
          total: count
        }));

        this.renderProductChart(fullYearData);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error load product statistics", err);
      }
    });
  }


  onYearChange() {
    this.loadStatistics();
  }

  renderChart(data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('borrowChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        datasets: [{
          label: 'Số lượt mượn',
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderProductChart(data: number[]) {
    if (this.productChart) {
      this.productChart.destroy();
    }

    const ctx = document.getElementById('productChart') as HTMLCanvasElement;

    this.productChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        datasets: [{
          label: 'Số lượng sách',
          data: data,
          borderWidth: 1,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)'
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }


}
