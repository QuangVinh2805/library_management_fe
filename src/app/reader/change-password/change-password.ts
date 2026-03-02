import { Component } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
  imports: [FormsModule, NgIf]
})
export class ChangePassword {

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private toastr: ToastrService
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

    this.userService.updateReaderPassword(body).subscribe({
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
}
