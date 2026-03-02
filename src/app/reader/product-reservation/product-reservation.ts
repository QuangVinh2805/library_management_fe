import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../_services/product.service';
import {NgIf} from '@angular/common';
import {UserService} from '../../_services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-reservation',
  templateUrl: './product-reservation.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./product-reservation.css']
})
export class ProductReservation implements OnInit {

  reservationForm!: FormGroup;

  product: any = null;
  user: any = null;

  hashId: string = '';
  submitting = false;
  errorMessage = '';
  successMessage = '';
  today!: string;

  private apiBaseUrl = "http://localhost:8177";


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.today = new Date().toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      borrowDay: ['', Validators.required],
      dueDay: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.hashId = params['hashId'];
    });

    this.reservationForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      borrowDay: ['', Validators.required],
      dueDay: ['', Validators.required]
    });

    this.loadProduct();
    this.loadUser();
  }

  loadProduct() {
    this.productService.getProductByHashId(this.hashId).subscribe({
      next: res => {
        this.product = res.data;
      },
      error: () => {
        this.errorMessage = "Không thể tải thông tin sách.";
      }
    });
  }

  loadUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    this.userService.getReaderByToken(token).subscribe({
      next: res => {
        this.user = res.data;
      },
      error: () => {
        this.errorMessage = "Không thể tải thông tin người dùng.";
      }
    });
  }

  submitReservation() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.toastr.warning("Bạn cần đăng nhập để mượn sách.", "Thông báo");

      const returnUrl = this.router.url;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
      return;
    }

    // ✅ Validate borrowDay
    const borrowDayControl = this.reservationForm.get('borrowDay');
    if (!borrowDayControl?.value) {
      this.toastr.error("Vui lòng chọn ngày mượn");
      borrowDayControl?.markAsTouched();
      return;
    }

    // ✅ Validate quantity
    const quantityControl = this.reservationForm.get('quantity');
    const quantity = quantityControl?.value;

    if (quantity === null || quantity === undefined || quantity <= 0) {
      this.toastr.error("Số lượng phải lớn hơn 0");
      quantityControl?.markAsTouched();
      return;
    }

    if (this.reservationForm.invalid) {
      return;
    }

    const { borrowDay, dueDay } = this.reservationForm.value;

    if (dueDay < borrowDay) {
      this.toastr.error("Ngày trả phải sau ngày mượn");
      return;
    }

    const body = {
      token,
      hashId: this.hashId,
      quantity,
      borrowDay,
      dueDay
    };

    this.submitting = true;
    this.errorMessage = '';

    this.productService.createProductReservation(body).subscribe({
      next: (res) => {
        this.submitting = false;

        if (res.status === 200) {
          this.successMessage = "Đăng ký mượn thành công!";
          setTimeout(() =>
            this.router.navigate(['/reader/product-pre-reservation']), 1500
          );
        } else {
          this.toastr.error(res.message || "Đăng ký mượn thất bại!");
        }
      },
      error: () => {
        this.submitting = false;
        this.toastr.error("Server error!", "Lỗi");
      }
    });
  }





  getImage(path: string): string {
    return this.apiBaseUrl + path;
  }
}
