import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../_services/category.service';
import {ProductService} from '../../_services/product.service';
import {AuthorService} from '../../_services/author.service';
import {NgForOf, NgIf} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-author',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './author.html',
  styleUrl: './author.css',
})
export class Author implements OnInit {
  authors: any[] = [];
  page = 0;
  size = 12;
  totalPages = 0;
  totalItems = 0;
  authorCounts: Record<number, number> = {};

  constructor(
    private authorService: AuthorService,
    private productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadAuthors();
  }

  loadAuthors() {
    this.authorService.getAllAuthorByStatus(this.page, this.size).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const result = res.data;

          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
          this.authors = result.data || [];

          this.authors.forEach(au => {
            this.productService.getProductCountByAuthor(au.id).subscribe({
              next: (countRes: any) => {
                if (countRes && countRes.data !== undefined) {
                  this.authorCounts[au.id] = Number(countRes.data);
                }
              },
              error: (err) => console.error('Lỗi khi lấy số lượng sản phẩm', err)
            });
          });
        }
      },
      error: (err) => console.error('Lỗi khi lấy author', err)
    });
  }

  goToAuthor(authorId: number, authorName: string) {
    this.router.navigate(['/reader/products-by-author', authorId], { queryParams: { name: authorName } });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadAuthors();
  }
}
