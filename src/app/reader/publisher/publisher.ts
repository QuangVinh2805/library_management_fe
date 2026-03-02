import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductService} from '../../_services/product.service';
import {PublisherService} from '../../_services/publisher.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-publisher',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './publisher.html',
  styleUrl: './publisher.css',
})
export class Publisher implements OnInit {
  publishers: any[] = [];
  page = 0;
  size = 12;
  totalPages = 0;
  totalItems = 0;
  publisherCounts: Record<number, number> = {};

  constructor(
    private publisherService: PublisherService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPublishers();
  }

  loadPublishers() {
    this.publisherService.getAllPublisherByStatus(this.page, this.size).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const result = res.data;

          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
          this.publishers = result.data || [];

          this.publishers.forEach(pub => {
            this.productService.getProductCountByPublisher(pub.id).subscribe({
              next: (countRes: any) => {
                if (countRes && countRes.data !== undefined) {
                  this.publisherCounts[pub.id] = Number(countRes.data);
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

  goToPublisher(publisherId: number, publisherName: string) {
    this.router.navigate(['/reader/products-by-publisher', publisherId], { queryParams: { name: publisherName } });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadPublishers();
  }
}
