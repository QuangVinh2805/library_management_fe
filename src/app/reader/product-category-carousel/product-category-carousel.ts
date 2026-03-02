import { Component, Input, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ProductService } from '../../_services/product.service';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-category-carousel',
  imports: [NgForOf, NgIf],
  templateUrl: './product-category-carousel.html',
  styleUrl: './product-category-carousel.css',
})
export class ProductCategoryCarousel implements OnInit {

  @Input() categoryId!: number;
  books: any[] = [];
  visibleBooks: any[] = [];
  loading = true;
  slideIndex = 0;
  slideSize = 6;
  private apiBaseUrl = "http://localhost:8177";

  constructor(private productService: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.categoryId != null) {
      this.loadBooksByCategory(this.categoryId);
    } else {
      console.warn("categoryId chưa được truyền vào component Product");
    }
  }

  loadBooksByCategory(categoryId: number) {
    this.loading = true;
    this.productService.getAllProductCarouselByCategoryId(categoryId).subscribe({
      next: (res) => {
        this.books = res.data || [];
        this.updateVisibleBooks();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getImage(path: string): string {
    return this.apiBaseUrl + path;
  }

  updateVisibleBooks() {
    const total = this.books.length;
    let result: any[] = [];
    for (let i = 0; i < this.slideSize; i++) {
      if (total === 0) break;
      const index = (this.slideIndex + i) % total;
      result.push(this.books[index]);
    }
    this.visibleBooks = result;
  }


  nextSlide() {
    if (this.books.length === 0) return;
    this.slideIndex = (this.slideIndex + 1) % this.books.length;
    this.updateVisibleBooks();
    this.triggerAnimation();
  }

  prevSlide() {
    if (this.books.length === 0) return;
    this.slideIndex = (this.slideIndex - 1 + this.books.length) % this.books.length;
    this.updateVisibleBooks();
    this.triggerAnimation();
  }

  triggerAnimation() {
    const el = document.querySelector('#categoryBooksCarousel') as HTMLElement;
    if (!el) return;
    el.classList.remove('slide-fade');
    void el.offsetWidth;
    el.classList.add('slide-fade');
  }

  borrowBook(hashId: string, event: Event) {
    event.stopPropagation();

    this.router.navigate(['/reader/product-reservation'], {
      queryParams: { hashId: hashId }
    });
  }

  goToDetail(hashId: string) {
    this.router.navigate(['/reader/product-detail', hashId]);
  }
}
