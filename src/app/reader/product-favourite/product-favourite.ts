import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Router } from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-product-favourite',
  templateUrl: './product-favourite.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./product-favourite.css']
})
export class ProductFavourite implements OnInit {

  products: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  isLoading = false;
  errorMessage = '';
  token = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';

    if (!this.token) {
      this.errorMessage = 'Không tìm thấy token. Vui lòng đăng nhập lại.';
      return;
    }

    this.loadFavouriteProducts();
  }

  loadFavouriteProducts(): void {
    this.isLoading = true;

    this.productService.getAllFavouriteProductByToken(this.token,this.page, this.size)
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            const result = response.data;
            this.totalPages = result.totalPages || 0;
            this.totalItems = result.totalItems || 0;
            this.page = result.currentPage || 0;
            this.products = result.data || [];
          } else {
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Không thể tải danh sách sản phẩm yêu thích.';
          this.isLoading = false;
        }
      });
  }

  goToDetail(hashId: string): void {
    this.router.navigate(['/reader/product-detail', hashId]);
  }

  borrowBook(hashId: string, event: Event) {
    event.stopPropagation();

    this.router.navigate(['/reader/product-reservation'], {
      queryParams: { hashId: hashId }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadFavouriteProducts();
  }
}
