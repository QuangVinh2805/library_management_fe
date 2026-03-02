import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BorrowReturnService } from '../../_services/borrow-return.service';
import { UserService } from '../../_services/user.service';
import { ProductService } from '../../_services/product.service';
import {debounceTime, Subject} from 'rxjs';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-borrow-return-product-management',
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './borrow-return-product-management.html',
  styleUrl: './borrow-return-product-management.css',
})
export class BorrowReturnProductManagement implements OnInit, AfterViewInit {

  borrets: any[] = [];
  users: any[] = [];
  products: any[] = [];

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  loading = true;
  returnModal: any;
  today: string = '';

  searchType: string = 'borrow';
  startDate: string = '';
  endDate: string = '';
  currentMode: 'all' | 'keyword' | 'date' = 'all';
  loadingStatus: { [key: number]: boolean } = {};

  canChangeStatus = false;




  returnData = {
    borrowedProductId: 0,
    isLost: false as boolean
  };

  detailBp: any = null;
  detailModal: any;

  selectedBorrow: any = null;

  payConfirmVisible = false;
  payData = {
    borrowedProductId: 0,
    librarianToken: ''
  };

  borrowForm = {
    email: '',
    items: [] as {
      hashId: string;
      image: string;
      productName: string;
      quantity: number;
      dueDate: '',
    }[]
  };


  createModal: any;

  selectedProductName: string = '';
  selectedQuantity: number = 1;
  selectedProduct: any = null;
  filteredProducts: any[] = [];


  canBorrow = false;
  canReturn = false;
  canPayment = false;


  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private borrowReturnService: BorrowReturnService,
    private userService: UserService,
    private productService: ProductService,
    private permission: PermissionService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadProductStatus();

    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    if (this.permission.permissionLoaded$.value) {
      this.loadPermissionUI();
    }

    this.permission.permissionLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadPermissionUI();
      }
    });
    this.loadBorrets();
    this.loadUsers();
    this.loadProducts();
    console.log("Users:", this.users);
    console.log("Products:", this.products);
    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchBorrets(keyword.trim());
        } else {
          this.loadBorrets();
        }
      });
  }

  loadPermissionUI() {
    this.canBorrow = this.permission.hasPermission('/borrow/product', 'POST');
    this.canReturn = this.permission.hasPermission('/return/product', 'POST');
    this.canPayment = this.permission.hasPermission('/fee/payment', 'POST');
    this.canChangeStatus = this.permission.hasPermission('/product/changeStatusProductReservation', 'PUT');

  }


  ngAfterViewInit() {
    this.detailModal = new bootstrap.Modal(
      document.getElementById('detailBpModal')
    );
  }

  loadBorrets() {
    this.loading = true;
    this.borrowReturnService.getAll(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.borrets = result.data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearchInputChange(keyword: string) {
    this.searchKeyword = keyword;
    if (!keyword.trim()) {
      this.currentMode = 'all';
    }
    this.searchSubject.next(keyword);
  }


  searchBorrets(keyword: string) {
    this.currentMode = 'keyword';
    this.loading = true;

    this.borrowReturnService.getSearchAll(keyword, this.page, this.size)
      .subscribe({
        next: (res) => {
          const result = res.data;

          this.borrets = result.data || [];
          this.totalPages = result.totalPages || 0;
          this.totalItems = result.totalItems || 0;
          this.page = result.currentPage || 0;

          this.loading = false;
        },
        error: () => {
          this.borrets = [];
          this.loading = false;
        }
      });
  }


  addBorrowItem(product: any, quantity: number) {

    if (!product) {
      this.toastr.error("Vui lòng chọn sách hợp lệ");
      return;
    }

    if (quantity <= 0) {
      this.toastr.error("Số lượng phải lớn hơn 0");
      return;
    }

    const existed = this.borrowForm.items.find(
      i => i.hashId === product.hashId
    );

    if (existed) {
      existed.quantity += quantity;
    } else {
      this.borrowForm.items.push({
        hashId: product.hashId,
        image: product.image,
        productName: product.productName,
        quantity,
        dueDate: ''
      });
    }

    this.selectedProductName = '';
    this.selectedQuantity = 1;
    this.selectedProduct = null;
  }




  onProductNameInput(keyword: string) {
    if (!keyword.trim()) {
      this.filteredProducts = [...this.products];
      this.selectedProduct = null;
      return;
    }

    this.filteredProducts = this.products.filter(p =>
      p.productName?.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.selectedProductName = product.productName;
    this.filteredProducts = [];
  }


  loadProductStatus() {
    this.productService
      .getAllProductByStatus(this.page, this.size)
      .subscribe(res => {
        this.products = res.data;
        this.filteredProducts = [...this.products];
      });
  }


  viewDetail(borrowedProductId: number) {
    this.borrowReturnService.getBorrowProductById(borrowedProductId).subscribe({
      next: res => {
        this.detailBp = res.data;
        this.detailModal.show();
      },
      error: err => {
        this.toastr.error(err?.error?.message || "Lỗi!");
      }
    });
  }

  loadUsers() {
    this.userService.getAllUser(0, 9999).subscribe({
      next: res => {
        this.users = res.data?.data || [];
        console.log("Users loaded:", this.users);
      }
    });
  }

  loadProducts() {
    this.productService.getAllProduct(0, 9999).subscribe({
      next: res => {
        this.products = res.data?.data || [];
        console.log("Products loaded:", this.products);
      }
    });
  }

  removeBorrowItem(index: number) {
    this.borrowForm.items.splice(index, 1);
  }



  openCreateModal() {
    this.loadProducts();
    this.loadUsers();

    this.createModal = new bootstrap.Modal(
      document.getElementById('createBorrowModal')
    );
    this.createModal.show();
  }


  submitCreateBorrow() {

    if (!this.borrowForm.email) {
      this.toastr.error("Vui lòng chọn độc giả");
      return;
    }

    for (const item of this.borrowForm.items) {
      if (!item.dueDate) {
        this.toastr.error(
          `Vui lòng chọn hạn trả cho sách ${item.productName}`
        );
        return;
      }
    }


    if (this.borrowForm.items.length === 0) {
      this.toastr.error("Vui lòng thêm ít nhất 1 sách");
      return;
    }

    const payload = {
      email: this.borrowForm.email,
      items: this.borrowForm.items.map(i => ({
        hashId: i.hashId,
        quantity: i.quantity,
        dueDate: i.dueDate
      }))
    };

    this.borrowReturnService.createBorrow(payload).subscribe({
      next: res => {
        if (res.status !== 200) {
          this.toastr.error(res.message);
          return;
        }

        this.toastr.success(res.message);
        this.createModal.hide();

        this.borrowForm = {
          email: '',
          items: []
        };

        this.loadBorrets();
      },
      error: err => {
        this.toastr.error(err?.error?.message || "Lỗi tạo phiếu mượn");
      }
    });
  }


  openReturnModal(p: any) {
    this.returnData.borrowedProductId = p.borrowedProductId;
    this.returnData.isLost = false;

    this.returnModal = new bootstrap.Modal(
      document.getElementById('returnModal')
    );
    this.returnModal.show();
  }

  submitReturn() {
    this.borrowReturnService.returnBook(this.returnData).subscribe({
      next: (res) => {
        if (res.status !== 200) {
          this.toastr.error(res.message);
          return;
        }
        this.toastr.success(res.message);
        this.returnModal.hide();
        this.loadBorrets();
      },
      error: err => {
        this.toastr.error(err?.error?.message || "Lỗi trả sách!");
      }
    });
  }


  openPayConfirm(item: any) {
    const librarianToken = localStorage.getItem("token");

    if (!librarianToken) {
      this.toastr.error("Không tìm thấy token của thủ thư!");
      return;
    }

    this.payData.borrowedProductId = item.borrowedProductId;
    this.payData.librarianToken = librarianToken;

    this.payConfirmVisible = true;
  }


  submitPayFee() {
    this.borrowReturnService.payFee(this.payData).subscribe({
      next: res => {
        if (res.status !== 200) {
          this.toastr.error(res.message);
          return;
        }
        this.toastr.success(res.message);
        this.payConfirmVisible = false;
        this.loadBorrets();
      },
      error: err => {
        this.toastr.error(err?.error?.message || "Có lỗi xảy ra");
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.currentMode === 'keyword') {
      this.searchBorrets(this.searchKeyword);
    }
    else if (this.currentMode === 'date') {
      this.searchByDate();
    }
    else {
      this.loadBorrets();
    }
  }


  searchByDate() {
    if (!this.searchType || !this.startDate || !this.endDate) {
      this.toastr.error("Vui lòng chọn đủ dữ liệu tìm kiếm");
      return;
    }

    this.currentMode = 'date';
    this.loading = true;

    this.borrowReturnService
      .searchBorrow(this.searchType, this.startDate, this.endDate, this.page, this.size)
      .subscribe({
        next: (res) => {
          const result = res.data;

          this.borrets = result.data || [];
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


  changeStatus(borrowedProductId: number, newStatus: number) {

    if (this.loadingStatus[borrowedProductId]) return;

    this.loadingStatus[borrowedProductId] = true;

    this.productService.changeStatusProductReservation(borrowedProductId, newStatus).subscribe({
      next: (res) => {
        this.loadingStatus[borrowedProductId] = false;
        if (res.status === 200) {
          this.toastr.success(res.message || "Cập nhật thành công");
          this.loadBorrets();
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (err) => {
        this.loadingStatus[borrowedProductId] = false;
        this.toastr.error("Lỗi server khi cập nhật trạng thái");
      }
    });
  }
}
