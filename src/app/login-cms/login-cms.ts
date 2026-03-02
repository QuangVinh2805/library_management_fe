import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../_services/user.service';
import {OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {PermissionService} from '../_services/permission.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login-cms.html',
  styleUrls: ['./login-cms.css'],
})
export class LoginCms implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/';



  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private permission: PermissionService
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

    this.userService.loginCms(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.status === 200 && res.data) {

          const { token, role, routeLinks } = res.data;
          const roleName = role?.toLowerCase();

          // ❌ KHÔNG CHO READER
          if (roleName === 'reader') {
            this.toastr.error(
              'Tài khoản Reader không thể đăng nhập CMS',
              'Sai hệ thống'
            );
            return;
          }

          // ❌ KHÔNG CÓ QUYỀN
          if (!routeLinks || routeLinks.length === 0) {
            this.toastr.error(
              'Tài khoản của bạn chưa được cấp quyền truy cập',
              'Không có quyền'
            );
            localStorage.clear();
            return;
          }

          // ===== LƯU LOCAL =====
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('routeLinks', JSON.stringify(routeLinks));

          this.permission.loadRoutes();
          this.permission.loadApiPermissions();


          this.toastr.success('Đăng nhập thành công!', 'Thông báo');

          // ===== REDIRECT =====
          const fullRoute = routeLinks[0].route;
          const redirectPath = fullRoute.replace(window.location.origin, '');

          this.router.navigateByUrl(redirectPath);
          return;

        } else {
          this.errorMessage = res.message || 'Đăng nhập thất bại';
        }
      },
      error: (err) => {
        this.isLoading = false;

        const message =
          err?.error?.message || 'Không thể kết nối máy chủ';


        this.errorMessage = message;
        this.toastr.error(message, 'Lỗi');
      }

    });
  }






}
