import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductService} from '../../_services/product.service';
import {ToastrService} from 'ngx-toastr';
import {ReactiveFormsModule} from '@angular/forms';
import {debounceTime, Subject} from 'rxjs';
import { FormsModule } from '@angular/forms';
import {PermissionService} from '../../_services/permission.service';


@Component({
  selector: 'app-product-reservation-management',
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    DatePipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './product-reservation-management.html',
  styleUrl: './product-reservation-management.css',
})
export class ProductReservationManagement implements OnInit, AfterViewInit {

  products: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  loading = true;
  loadingStatus: { [key: number]: boolean } = {};

  searchType: string = 'borrow';
  currentMode: 'all' | 'keyword' | 'date' = 'all';

  startDate: string = '';
  endDate: string = '';

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;
  canViewDetail = false;


  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private permission: PermissionService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.permission.permissionLoaded$.value) {
      this.loadPermissionUI();
    }

    this.permission.permissionLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadPermissionUI();
      }
    });
    this.loadProducts();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchProducts(keyword.trim());
        } else {
          this.loadProducts();
        }
      });
  }

  loadPermissionUI() {
    this.canChangeStatus = this.permission.hasPermission('/product/changeStatusProductReservation', 'PUT');

  }

  ngAfterViewInit() {}

  loadProducts() {
    this.loading = true;
    this.productService.getAllProductReservation(this.page, this.size).subscribe({
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
        this.toastr.error("Không thể tải dữ liệu");
      }
    });
  }


  onSearchInputChange(keyword: string) {
    this.searchKeyword = keyword;
    if (!keyword.trim()) {
      this.currentMode = 'all';
    }
    this.page = 0;
    this.searchSubject.next(this.searchKeyword);
  }


  searchProducts(keyword: string) {
    this.currentMode = 'keyword';
    this.loading = true;

    this.productService.getSearchAllProductReservation(keyword, this.page, this.size)
      .subscribe({
        next: (res) => {
          const result = res.data;
          this.products = result.data || [];
          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
          this.loading = false;
        },
        error: () => {
          this.products = [];
          this.loading = false;
          this.toastr.error("Tìm kiếm thất bại!");
        }
      });
  }


  changeStatus(id: number, newStatus: number) {

    if (this.loadingStatus[id]) return;

    this.loadingStatus[id] = true;

    this.productService.changeStatusProductReservation(id, newStatus).subscribe({
      next: (res) => {
        this.loadingStatus[id] = false;
        if (res.status === 200) {
          this.toastr.success(res.message || "Cập nhật thành công");
          this.loadProducts();
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (err) => {
        this.loadingStatus[id] = false;
        this.toastr.error("Lỗi server khi cập nhật trạng thái");
      }
    });
  }



  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.currentMode === 'keyword') {
      this.searchProducts(this.searchKeyword);
    }
    else if (this.currentMode === 'date') {
      this.searchByDate();
    }
    else {
      this.loadProducts();
    }
  }



  searchByDate() {
    if (!this.searchType || !this.startDate || !this.endDate) {
      this.toastr.error("Vui lòng chọn đủ dữ liệu lọc");
      return;
    }

    this.currentMode = 'date';
    this.loading = true;

    this.productService.searchProductReservation(
      this.searchType,
      this.startDate,
      this.endDate,
      this.page,
      this.size
    )
      .subscribe({
        next: (res) => {
          const result = res.data;
          this.products = result.data || [];
          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;
          this.loading = false;
        },
        error: () => {
          this.toastr.error("Không tìm thấy dữ liệu!");
          this.loading = false;
        }
      });
  }

}
