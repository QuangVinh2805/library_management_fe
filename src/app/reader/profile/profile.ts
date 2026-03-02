import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { ToastrService } from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  user: any = {};
  modal: any;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
      if (this.user.birthday) this.user.birthday = this.user.birthday.split('T')[0];
    }
  }

  openModal() {
    const modalElement = document.getElementById('updateModal');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  updateProfile() {
    if (!this.user.name || !this.user.email || !this.user.userCode || !this.user.birthday) {
      this.toastr.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (!this.isAgeValid(this.user.birthday)) {
      this.toastr.error("Người dùng phải đủ 9 tuổi");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error("Không tìm thấy token!");
      return;
    }

    const body = { ...this.user, token };

    this.userService.updateReader(body).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data) {
          this.toastr.success("Cập nhật thông tin thành công");
          localStorage.setItem('user', JSON.stringify(res.data));
          this.modal.hide();
        }
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || "Cập nhật thông tin thất bại!"
        );
      }
    });
  }



  private isAgeValid(birthday: string): boolean {
    if (!birthday) return false;

    const birth = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 9;
  }


}
