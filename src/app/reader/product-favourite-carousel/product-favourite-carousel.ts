import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ProductService} from '../../_services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-favourite-carousel',
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './product-favourite-carousel.html',
  styleUrl: './product-favourite-carousel.css',
})
export class ProductFavouriteCarousel implements OnInit {

  books: any[] = [];
  visibleBooks: any[] = [];
  loading = true;
  slideIndex = 0;
  slideSize = 6;
  private apiBaseUrl = "http://localhost:8177";

  constructor(private productService: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.productService.getTopFavouriteProduct().subscribe({
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
    const el = document.querySelector('#favouriteBooksCarousel') as HTMLElement;
    if (!el) return;
    el.classList.remove('slide-fade');
    void el.offsetWidth;
    el.classList.add('slide-fade');
  }

  handleAction(book: any, action: string): void {
    console.log(`Hành động "${action}" cho sách: ${book.productName}`);
    alert(`Đã nhấn ${action} cho sách: ${book.productName}`);
  }

  scroll(direction: 'left' | 'right'): void {
    const container = document.querySelector('.books-list-track') as HTMLElement;
    if (!container) return;
    const scrollAmount = 150;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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

