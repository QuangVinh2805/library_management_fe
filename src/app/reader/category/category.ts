import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../_services/category.service';
import { ProductService } from '../../_services/product.service';
import {NgForOf, NgIf} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
  imports: [NgForOf, NgIf]
})
export class Category implements OnInit {
  categories: any[] = [];
  page = 0;
  size = 12;
  totalPages = 0;
  totalItems = 0;
  categoryCounts: Record<number, number> = {};

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(){
    this.categoryService.getAllCategoryByStatus(this.page, this.size).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const result = res.data;

          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
          this.categories = result.data || [];

          this.categories.forEach(cat => {
            this.productService.getProductCountByCategory(cat.id).subscribe({
              next: (countRes: any) => {
                if (countRes && countRes.data !== undefined) {
                  this.categoryCounts[cat.id] = Number(countRes.data);
                }
              },
              error: (err) => console.error('Lỗi khi lấy số lượng sản phẩm', err)
            });
          });
        }
      },
      error: (err) => console.error('Lỗi khi lấy category', err)
    });
  }


  goToCategory(categoryId: number, categoryName: string) {
    this.router.navigate(['/reader/products-by-category', categoryId], { queryParams: { name: categoryName } });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadCategories();
  }
}
