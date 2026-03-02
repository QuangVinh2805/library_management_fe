import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {debounceTime, Subject} from 'rxjs';
import {PermissionService} from '../../_services/permission.service';
import { RoleService } from '../../_services/role.service';


declare var bootstrap: any;
type RoleType = 'READER' | 'ADMIN' | 'LIBRARIAN';


@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit,AfterViewInit {

  users: any[] = [];
  loading = true;
  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  detailUser: any = null;
  detailModal: any;

  selectedRoleId: number | null = null;

  editUserData: any = null;
  editModal: any;

  private deleteToken: string | null = null;
  private deleteModal: any;

  accountType: 'USER' | 'READER' = 'USER';

  selectedRole: string = '';
  roles: any[] = [];
  readerRoleId!: number;


  newUser = {
    name: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    userCode: '',
    roleIds: [3]
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
    private permission: PermissionService,
    private roleService: RoleService,
  ) {}



  ngOnInit() {
    const reader = this.roles.find(r => r.roleName === 'READER');
    this.readerRoleId = reader?.id;


    if (this.permission.permissionLoaded$.value) {
      this.loadPermissionUI();
    }

    this.permission.permissionLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadPermissionUI();
      }
    });

    this.loadRoles();
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
      document.getElementById('createUserModal')
    );

    this.detailModal = new bootstrap.Modal(
      document.getElementById('detailUserModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('editUserModal')
    );

    this.deleteModal = new bootstrap.Modal(
      document.getElementById('deleteModal')!
    );


  }


  loadRoles() {
    this.roleService.getAllRoleByStatus(0, 100).subscribe({
      next: res => {
        if (res?.data?.data) {
          this.roles = res.data.data;
        } else {
          this.roles = [];
        }
      },
      error: () => {
        this.roles = [];
        this.toastr.error('Không tải được danh sách role');
      }
    });
  }


  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/user/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/user/updateByPublicId', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/user/changeStatus', 'PUT');

  }

  onAccountTypeChange() {
    this.users.forEach(u => {
      if (this.accountType === 'READER') {
        u._selectedRoles = []; // 🔥 reader lên user
      } else {
        u._selectedRoles = [...u.roles]; // user chỉnh role
      }
    });

    this.page = 0;
    this.searchKeyword = '';
    this.selectedRole = '';
    this.loadUsers();
  }



  loadUsers() {
    this.loading = true;

    if (this.accountType === 'READER') {
      this.userService.getAllReader(this.page, this.size).subscribe({
        next: res => {
          const result = res.data;
          this.users = this.normalizeUserRoles(result.data);
          this.totalPages = result.totalPages;
          this.page = result.currentPage;
          this.loading = false;
        },
        error: () => this.loading = false
      });
      return;
    }

    if (this.selectedRole) {
      this.userService.getAllUserByRole(
        this.page, this.size, this.selectedRole
      ).subscribe({
        next: res => {
          const result = res.data;
          this.users = this.normalizeUserRoles(result.data);
          this.totalPages = result.totalPages;
          this.page = result.currentPage;
          this.loading = false;
        },
        error: () => this.loading = false
      });
      return;
    }

    this.userService.getAllUser(this.page, this.size).subscribe({
      next: res => {
        const result = res.data;
        this.users = this.normalizeUserRoles(result.data);
        this.totalPages = result.totalPages;
        this.page = result.currentPage;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }


  onRoleChange() {
    this.page = 0;
    this.loadUsers();
  }



  onSearchInputChange(keyword: string) {
    if (this.selectedRole) {
      this.selectedRole = '';
    }
    this.searchKeyword = keyword.trim();
    this.page = 0; // reset về trang 0 khi search mới
    this.searchSubject.next(this.searchKeyword);  }

  searchUsers(keyword: string) {
    this.loading = true;

    const api$ = this.accountType === 'READER'
      ? this.userService.getSearchAllReader(keyword, this.page, this.size)
      : this.userService.getSearchAllUser(keyword, this.page, this.size);

    api$.subscribe({
      next: res => {

        if (!res.data) {
          this.users = [];
          this.totalPages = 0;
          this.page = 0;
          this.loading = false;
          return;
        }

        const result = res.data;
        this.users = this.normalizeUserRoles(result.data || []);
        this.totalPages = result.totalPages || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: () => {
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

    const api$ = this.accountType === 'READER'
      ? this.userService.getReaderByPublicId(publicId)
      : this.userService.getUserByPublicId(publicId);

    api$.subscribe({
      next: res => {

        const data = res.data;

        let roles: string[] = [];

        if (Array.isArray(data.roleName)) {
          // USER
          roles = data.roleName.map((r: any) => r.roleName);
        } else if (data.roleName) {
          // READER
          roles = [data.roleName];
        }

        this.detailUser = {
          ...data,
          roles,
          displayRoles: roles.join(', ')
        };

        this.detailModal.show();
      }
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
      roleIds: []
    };

    this.createModal.show();
  }

  onCreateRoleToggle(role: any) {

    const idx = this.newUser.roleIds.indexOf(role.id);

    if (idx > -1) {
      this.newUser.roleIds.splice(idx, 1);
    } else {
      this.newUser.roleIds.push(role.id);
    }
  }



  submitCreateUser() {

    if (!this.newUser.roleIds.length) {
      this.toastr.error('Vui lòng chọn ít nhất một vai trò');
      return;
    }


    if (
      !this.newUser.name?.trim() ||
      !this.newUser.email?.trim() ||
      !this.newUser.userCode?.trim()
    ) {
      this.toastr.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    const waitingToast = this.toastr.info(
      "Đang tạo tài khoản, vui lòng chờ... (Mật khẩu sẽ gửi qua email)"
    );

    this.userService.createUser(this.newUser).subscribe({
      next: res => {
        this.toastr.clear(waitingToast.toastId);
        this.toastr.success("Tạo người dùng thành công!");
        this.createModal.hide();
        this.loadUsers();
      },
      error: err => {
        this.toastr.clear(waitingToast.toastId);
        this.toastr.error(
          err?.error?.message || "Tạo người dùng thất bại!"
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
    const api$ = this.accountType === 'READER'
      ? this.userService.updateReaderByPublicId(this.editUserData)
      : this.userService.updateUserByPublicId(this.editUserData);

    api$.subscribe({
      next: () => {
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
    const api$ = this.accountType === 'READER'
      ? this.userService.changeStatusReader(publicId)
      : this.userService.changeStatus(publicId);

    api$.subscribe(() => {
      this.toastr.success("Đã đổi trạng thái!");
      this.loadUsers();
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


  changeUserRoles(user: any) {

    if (!user?.publicId) {
      this.toastr.error('Không tìm thấy publicId người dùng');
      return;
    }

    if (!user._selectedRoles || user._selectedRoles.length === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất một vai trò');
      return;
    }

    const data = {
      publicId: user.publicId,
      targetRoles: user._selectedRoles
    };

    this.userService.changeRole(data).subscribe({
      next: res => {
        this.toastr.success(res.message || 'Cập nhật vai trò thành công');
        this.loadUsers();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || 'Cập nhật vai trò thất bại'
        );
      }
    });
  }

  private normalizeUserRoles(users: any[]) {
    return users.map(u => {

      let roles: string[] = [];

      if (Array.isArray(u.roleName)) {
        roles = u.roleName.map((r: any) => r.roleName);
      } else if (u.roleName) {
        roles = [u.roleName];
      }

      const isReader = roles.length === 1 && roles[0] === 'READER';

      return {
        ...u,
        roles,
        displayRoles: roles.join(', '),

        // 🔥 CỐT LÕI
        _selectedRoles: isReader ? [] : [...roles]
      };
    });
  }


  onRoleToggle(user: any, role: string, event: any) {
    if (event.target.checked) {
      if (!user._selectedRoles.includes(role)) {
        user._selectedRoles.push(role);
      }
    } else {
      user._selectedRoles = user._selectedRoles.filter(
        (r: string) => r !== role
      );
    }
  }





}
