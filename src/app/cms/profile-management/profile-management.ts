import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-profile-management',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './profile-management.html',
  styleUrl: './profile-management.css',
})
export class ProfileManagement implements OnInit {
  user: any = {};
  modal: any;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
      if (this.user.birthday) this.user.birthday = this.user.birthday.split('T')[0];
    }

    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserByToken(token).subscribe({
        next: (res) => {
          if (res.status === 200 && res.data) {
            this.user = res.data;
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        },
        error: (err) => console.error('Lỗi khi lấy user:', err)
      });
    }
  }

  openModal() {
    const modalElement = document.getElementById('updateModal');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  updateProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error("Không tìm thấy token!");
      return;
    }

    const body = { ...this.user, token };
    this.userService.updateUser(body).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data) {
          this.toastr.success("Cập nhật thông tin thành công");
          localStorage.setItem('user', JSON.stringify(res.data));
          this.modal.hide();
        }
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ||"Có lỗi xảy ra khi cập nhật");
        console.error(err);
      }
    });
  }
}

