import { Component,OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { ProductService } from '../../_services/product.service';

@Component({
  selector: 'app-product-search',
  imports: [NgForOf, NgIf],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css',
})
export class ProductSearch implements OnInit {

  keyword = '';
  products: any[] = [];
  loading = true;

  page = 0;
  size = 12;
  totalPages = 0;
  totalItems = 0;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.page = 0;
      this.searchProducts();
    });
  }

  searchProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getSearchAllProductByStatus(this.keyword, this.page, this.size)
      .subscribe({
        next: (res: any) => {
          const result = res.data;

          this.products = result.data || [];
          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Lỗi tải dữ liệu';
          this.loading = false;
        }
      });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.searchProducts();
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



}
