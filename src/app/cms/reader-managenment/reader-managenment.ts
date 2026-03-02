import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {debounceTime, Subject} from 'rxjs';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-reader-managenment',
  imports: [CommonModule, FormsModule],
  templateUrl: './reader-managenment.html',
  styleUrl: './reader-managenment.css',
})

export class ReaderManagenment implements OnInit,AfterViewInit {
  users: any[] = [];
  loading = true;
  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  detailUser: any = null;
  detailModal: any;

  editUserData: any = null;
  editModal: any;

  private deleteToken: string | null = null;
  private deleteModal: any;



  newUser = {
    name: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    userCode: '',
    roleId: 3
  };

  createModal: any;

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;
  canViewDetail = false;

  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private permission: PermissionService
  ) {}

  ngOnInit() {

    if (this.permission.permissionLoaded$.value) {
      this.loadPermissionUI();
    }

    this.permission.permissionLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadPermissionUI();
      }
    });
    this.loadUsers();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchUsers(keyword.trim());
        } else {
          this.loadUsers();
        }
      });

  }
  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createReaderModal')
    );

    this.detailModal = new bootstrap.Modal(
      document.getElementById('detailReaderModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('editReaderModal')
    );

    this.deleteModal = new bootstrap.Modal(
      document.getElementById('deleteReaderModal')!
    );


  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/user/createReaderByUser', 'POST');
    this.canUpdate = this.permission.hasPermission('/user/updateReaderByPublicId', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/user/changeStatusReader', 'PUT');

  }


  loadUsers() {
    this.loading = true;
    this.userService.getAllReader(this.page, this.size).subscribe({
      next: res => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.users = (result.data || []).filter((u: any) => u.roleName === 'READER');
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSearchInputChange(keyword: string) {
    this.searchKeyword = keyword.trim();
    this.page = 0; // reset về trang 0 khi search mới
    this.searchSubject.next(this.searchKeyword);
  }

  searchUsers(keyword: string) {
    this.loading = true;
    this.userService.getSearchAllReader(keyword,this.page, this.size).subscribe({
      next: (res) => {

        if (!res.data) {
          this.users = [];
          this.totalPages = 0;
          this.page = 0;
          this.loading = false;
          return;
        }


        const result = res.data;

        this.users = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.users = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }

  // getRoleName(roleName: string): string {
  //   switch (roleName) {
  //     case 'admin': return 'Quản lý';
  //     case 'librarian': return 'Thủ thư';
  //     case 'reader': return 'Độc giả';
  //     default: return 'Không xác định';
  //   }
  // }

  viewDetail(publicId: string) {
    this.userService.getReaderByPublicId(publicId).subscribe({
      next: res => {
        this.detailUser = res.data;
        this.detailModal.show();
      },
      error: err => console.error(err)
    });
  }


  openCreateModal() {
    this.newUser = {
      name: '',
      email: '',
      phone: '',
      address: '',
      birthday: '',
      userCode: '',
      roleId: 3
    };
    this.createModal.show();
  }

  submitCreateUser() {

    // FE validate trước
    if (
      !this.newUser.name?.trim() ||
      !this.newUser.email?.trim() ||
      !this.newUser.userCode?.trim() ||
      !this.newUser.roleId
    ) {
      this.toastr.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    const waitingToast = this.toastr.info(
      "Đang tạo tài khoản, vui lòng chờ... (Hệ thống sẽ gửi mật khẩu qua email)"
    );

    this.userService.createReaderByUser(this.newUser).subscribe({
      next: res => {
        if (res.status !== 200) {
          this.toastr.error(res.message || "Tạo độc giả thất bại!");
          return;
        }

        this.toastr.success("Tạo độc giả thành công!");
        this.createModal.hide();
        this.loadUsers();
      },
      error: err => {
        this.toastr.clear(waitingToast.toastId);
        this.toastr.error(
          err?.error?.message || "Tạo độc giả thất bại!"
        );
      }
    });
  }



  editUser(u: any) {
    this.editUserData = {
      token: u.token,
      name: u.name,
      email: u.email,
      phone: u.phone,
      address: u.address,
      birthday: u.birthday ? u.birthday.substring(0, 10) : "",
      userCode: u.userCode,
      publicId: u.publicId
    };

    this.editModal.show();
  }

  submitUpdateUser() {
    this.userService.updateReaderByPublicId(this.editUserData).subscribe({
      next: res => {
        this.toastr.success("Cập nhật thành công!");
        this.editModal.hide();
        this.loadUsers();
      },
      error: err => {
        this.toastr.error(err?.error?.message || "Cập nhật thất bại!");
      }
    });
  }



  toggleStatus(publicId: string) {
    this.userService.changeStatusReader(publicId).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadUsers();
      }
    });
  }


  openDeleteModal(token: string) {
    this.deleteToken = token;
    this.deleteModal.show();
  }

  confirmDelete() {
    if (!this.deleteToken) return;

    this.userService.deleteUser(this.deleteToken).subscribe({
      next: () => {
        this.toastr.success("Xóa thành công!");
        this.deleteModal.hide();
        this.loadUsers();
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchUsers(this.searchKeyword);
    } else {
      this.loadUsers();
    }
  }

  isValidAge(birthday: string): boolean {
    if (!birthday) return false;

    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();

    return currentYear - birthYear >= 9;
  }
}
