import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-reset-password-cms',
    imports: [
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './reset-password-cms.html',
  styleUrl: './reset-password-cms.css',
})
export class ResetPasswordCms implements OnInit {

  email = '';

  token = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  sendLink() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.sendResetPasswordLinkUser(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Vui lòng kiểm tra email để đặt lại mật khẩu';
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Email không tồn tại';
      }
    });
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.userService.resetPasswordUserByToken({
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Đặt lại mật khẩu thành công';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Token không hợp lệ hoặc đã hết hạn';
      }
    });
  }
}

