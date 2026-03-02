import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../_services/product.service';
import {ToastrService} from 'ngx-toastr';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-all',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './product-all.html',
  styleUrl: './product-all.css',
})
export class ProductAll implements OnInit {

  products: any[] = [];
  loading = true;

  page = 0;
  size = 12;
  totalPages = 0;
  totalItems = 0;

  isLoading = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,

  ) {}


  ngOnInit() {
    this.loadProducts();
  }


  loadProducts() {
    this.loading = true;

    this.productService.getAllProductByStatus(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.products = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToDetail(hashId: string) {
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
    this.loadProducts();
  }

}
