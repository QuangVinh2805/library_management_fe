import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../_services/user.service';
import {OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/';



  constructor(private userService: UserService, private router: Router,private route: ActivatedRoute,private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.status === 200 && res.data) {

          const { token, role } = res.data;

          // 🔒 CHỈ CHẤP NHẬN READER
          if (role?.toLowerCase() !== 'reader') {
            this.toastr.error(
              'Tài khoản này không dành cho Reader',
              'Sai hệ thống'
            );
            return;
          }

          // ===== LƯU LOCAL STORAGE =====
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);

          this.toastr.success('Đăng nhập thành công!', 'Thông báo');

          // ===== REDIRECT =====
          if (this.returnUrl && this.returnUrl !== '/') {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/reader']);
          }

        } else {
          this.errorMessage = res.message || 'Đăng nhập thất bại';
        }
      },
      error: (err) => {
        this.isLoading = false;

        const message =
          err?.error?.message || 'Không thể kết nối máy chủ';

        // 🚫 BLACKLIST (403)
        if (err.status === 403) {
          this.toastr.error(message, 'Truy cập bị từ chối');
          return;
        }

        // ❌ SAI EMAIL / PASSWORD (401, 404…)
        this.errorMessage = message;
        this.toastr.error(message, 'Lỗi');
      }
    });
  }





}
