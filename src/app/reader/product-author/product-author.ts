import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../_services/product.service';

@Component({
  selector: 'app-product-author',
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './product-author.html',
  styleUrl: './product-author.css',
})
export class ProductAuthor implements OnInit {
  authorId!: number;
  authorName = '';
  page = 0;
  size = 12;
  totalPages = 0;
  totalItems = 0;
  products: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.authorId = Number(id);
        this.authorName = this.route.snapshot.queryParamMap.get('name') || '';
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAllProductByAuthorId(this.authorId,this.page, this.size).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          const result = res.data;

          this.products = result.data || [];
          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
        } else {
          this.products = [];
          this.errorMessage = res.message || 'Không có sản phẩm';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi tải sản phẩm';
        console.error(err);
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
