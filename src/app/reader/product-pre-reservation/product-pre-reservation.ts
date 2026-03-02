import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service'; // sửa đường dẫn nếu cần
import { Observable } from 'rxjs';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-product-pre-reservation',
  templateUrl: './product-pre-reservation.html',
  styleUrls: ['./product-pre-reservation.css'],
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    NgClass
  ]
})
export class ProductPreReservation implements OnInit {
  reservations: any[] = [];
  loading: boolean = false;
  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProductReservation();
  }

  loadProductReservation(){
    const token = localStorage.getItem('token') || '';
    this.loading = true;

    this.productService.getAllProductReservationByUser(token,this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.reservations = result.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadProductReservation();
  }


}
