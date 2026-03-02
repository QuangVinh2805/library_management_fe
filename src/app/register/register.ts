import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerData: any = {
    email: '',
    name: '',
    birthday: '',
    address: '',
    phone: '',
    userCode: '',
    roleId: 3
  };

  isLoading = false;
  infoMessage = '';
  errorMessage = '';


  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.isLoading) return;

    this.isLoading = true;
    this.infoMessage = 'Vui lòng đợi, hệ thống đang xử lý...';

    this.userService.createReader(this.registerData).subscribe({

      next: (res: any) => {
        this.isLoading = false;
        this.infoMessage = 'Vui lòng kiểm tra email để nhận mật khẩu';
      },

      error: (err: any) => {
        this.isLoading = false;
        this.infoMessage = '';

        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';
        }
      }
    });
  }


}
