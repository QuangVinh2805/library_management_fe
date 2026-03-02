import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {debounceTime, Subject} from 'rxjs';
import {RoleService} from '../../_services/role.service';
import {ToastrService} from 'ngx-toastr';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-role-management',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './role-management.html',
  styleUrl: './role-management.css',
})
export class RoleManagement implements OnInit, AfterViewInit {
  roles: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  editRole: any = null;
  editModal: any;


  createModal: any;


  newRole = {
    roleName: ''
  };

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;
  canViewDetail = false;

  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService,
    private permission: PermissionService,
  ) {
  }

  ngOnInit() {

    if (this.permission.permissionLoaded$.value) {
      this.loadPermissionUI();
    }

    this.permission.permissionLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadPermissionUI();
      }
    });
    this.loadRoles();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchRoles(keyword.trim());
        } else {
          this.loadRoles();
        }
      });
  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createRoleModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updateRoleModal')
    );
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/role/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/role/update', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/role/changeStatus', 'PUT');

  }

  loadRoles() {
    this.loading = true;
    this.roleService.getAllRole(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.roles = result.data || [];
        this.loading = false;
      },
      error: (err) => {
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

  searchRoles(keyword: string) {
    this.loading = true;
    this.roleService.getSearchAllRole(keyword, this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.roles = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.roles = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }

  openEditModal(a: any) {
    this.editRole = {...a};

    this.editModal.show();
  }

  submitUpdateRole(id: number) {
    this.roleService.updateRole(id, this.editRole.roleName).subscribe({
      next: () => {
        this.toastr.success('Cập nhật role thành công!');
        this.editModal.hide();
        this.loadRoles();
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }


  toggleStatus(id: number) {
    this.roleService.changeStatusRole(id).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadRoles();
      },
      error: err => {
        console.error(err);
        this.toastr.error("Đổi trạng thái thất bại!");
      }
    });
  }


  openCreateModal() {
    this.newRole = {
      roleName: ''
    };
    this.createModal.show();
  }

  submitCreateRole() {
    this.roleService.createRole(this.newRole.roleName).subscribe({
      next: () => {
        this.toastr.success('Tạo role thành công!');
        this.createModal.hide();
        this.loadRoles();
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Tạo role thất bại');
      }
    });
  }


  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchRoles(this.searchKeyword);
    } else {
      this.loadRoles();
    }
  }
}
