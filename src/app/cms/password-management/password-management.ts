import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from '../../_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-password-management',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './password-management.html',
  styleUrl: './password-management.css',
})
export class PasswordManagement {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  updatePassword() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error("Không tìm thấy token!");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    const body = {
      token: token,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.userService.updatePassword(body).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.toastr.success("Đổi mật khẩu thành công");
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.toastr.error(res.message || "Có lỗi xảy ra");
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || "Có lỗi xảy ra khi đổi mật khẩu");
      }
    });
  }

  goBack() {
    this.router.navigate(['/librarian/profile-management']);
  }

}
