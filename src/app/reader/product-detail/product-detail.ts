  import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
  import {ActivatedRoute, Router} from '@angular/router';
  import { DecimalPipe, NgClass, NgIf } from '@angular/common';
  import { ProductService } from '../../_services/product.service';
  import { ToastrService } from 'ngx-toastr';


  export interface UserFavouriteProductResponse {
    favourite: boolean;
    id: number | null;
  }

  @Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [NgIf, DecimalPipe, NgClass],
    templateUrl: './product-detail.html',
    styleUrls: ['./product-detail.css']
  })
  export class ProductDetail implements OnInit {

    product: any = null;
    loading = true;
    private apiBaseUrl = "http://localhost:8177";

    favouriteCount = 0;
    isFavourite = false;
    favouriteProductId: number | null = null;
    token: string | null = null;

    constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private cd: ChangeDetectorRef,
      private router: Router,
      private toastr: ToastrService
    ) {}

    ngOnInit(): void {
      const hashId = this.route.snapshot.paramMap.get('hashId');
      this.token = localStorage.getItem("token");

      if (hashId) {
        this.loadProduct(hashId);
        this.loadFavouriteCount(hashId);

        if (this.token) {
          this.checkIfFavourite(hashId);
        }
      }
    }

    loadProduct(hashId: string) {
      this.productService.getProductByHashId(hashId).subscribe({
        next: (res) => {
          this.product = res.data;
          this.loading = false;
          this.cd.markForCheck();
        },
        error: () => this.loading = false
      });
    }

    getImage(path: string): string {
      return this.apiBaseUrl + path;
    }

    loadFavouriteCount(hashId: string) {
      this.productService.getFavouriteProductCountByHashId(hashId).subscribe({
        next: (res) => {
          this.favouriteCount = res.data;
          this.cd.markForCheck();
        }
      });
    }

    checkIfFavourite(hashId: string) {
      this.productService.checkUserFavourite(hashId, this.token || undefined).subscribe({
        next: (res) => {
          this.isFavourite = !!res.data.favourite;
          this.favouriteProductId = res.data.id;
        },
        error: () => {
          this.isFavourite = false;
          this.favouriteProductId = null;
        }
      });
    }


    toggleFavourite() {
      if (!this.token) {
        this.toastr.warning("Vui lòng đăng nhập để thích sản phẩm!", "Thông báo");
        this.router.navigate(['/login']);
        return;
      }

      // 🔥 CHƯA TỒN TẠI favourite → CREATE
      if (this.favouriteProductId === null) {
        const body = { token: this.token, hashId: this.product.hashId };

        this.productService.createFavouriteProduct(body).subscribe({
          next: (res) => {
            this.favouriteProductId = res.data.id; // ✅ ĐÚNG FIELD
            this.isFavourite = true;
            this.favouriteCount++;
            this.cd.detectChanges(); // 🔥 QUAN TRỌNG
          },
          error: (err) => console.error(err)
        });
        return;
      }

      // 🔥 ĐÃ TỒN TẠI → CHANGE STATUS
      this.productService.changeStatusFavouriteProduct(this.favouriteProductId).subscribe({
        next: (res) => {
          const newStatus = res.data.status;
          this.isFavourite = newStatus === 1;
          this.favouriteCount += this.isFavourite ? 1 : -1;
          this.cd.detectChanges();
        },
        error: (err) => console.error(err)
      });
    }



    borrowBook(hashId: string, event: Event) {
      event.stopPropagation();

      if (this.product?.quantity === 0) {
        this.toastr.warning(
          "Sách này hiện đã hết, không thể đăng ký mượn!",
          "Thông báo"
        );
        return;
      }

      if (this.product?.status === 0) {
        this.toastr.warning(
          "Sách này hiện đang tạm ngưng cho mượn!",
          "Thông báo"
        );
        return;
      }

      this.router.navigate(['/reader/product-reservation'], {
        queryParams: { hashId }
      });
    }



  }
