import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { RoleService } from '../../_services/role.service';
import { ToastrService } from 'ngx-toastr';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-permission-management',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, NgClass],
  templateUrl: './permission-management.html'
})
export class PermissionManagement implements OnInit, AfterViewInit {

  permissions: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;

  searchKeyword = '';
  private searchSubject = new Subject<string>();

  modal: any;
  deleteModal: any;

  editPermission: any = null;
  deletePermissionItem: any = null;

  form = {
    name: '',
    code: '',
    route: '',      // endpoint
    method: 'GET',
    routeName: ''   // tên route
  };

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private roleService: RoleService,
    private permission: PermissionService,
    private toastr: ToastrService
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
    this.loadPermissions();

    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(k => k ? this.search(k) : this.loadPermissions());
  }

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(
      document.getElementById('permissionModal')
    );

    this.deleteModal = new bootstrap.Modal(
      document.getElementById('deletePermissionModal')
    );
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/permissions/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/permissions/update', 'PUT');
    this.canDelete = this.permission.hasPermission('/permissions/delete', 'DELETE');

  }

  loadPermissions() {
    this.loading = true;
    this.roleService.getAllPermission(this.page, this.size).subscribe({
      next: res => {
        const r = res.data;
        this.permissions = r.data || [];
        this.totalPages = r.totalPages || 0;
        this.page = r.currentPage || 0;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearchInputChange(keyword: string) {
    this.searchKeyword = keyword.trim();
    this.page = 0; // reset về trang 0 khi search mới
    this.searchSubject.next(this.searchKeyword);
  }

  search(keyword: string) {
    this.loading = true;
    this.roleService.getSearchAllPermission(keyword, this.page, this.size).subscribe({
      next: res => {
        const r = res.data;
        this.permissions = r.data || [];
        this.totalPages = r.totalPages || 0;
        this.page = r.currentPage || 0;
        this.loading = false;
      },
      error: () => {
        this.permissions = [];
        this.loading = false;
      }
    });
  }

  /* ================= CREATE ================= */
  openCreateModal() {
    this.editPermission = null;
    this.form = {
      name: '',
      code: '',
      route: '',
      method: 'GET',
      routeName: ''
    };
    this.modal.show();
  }

  /* ================= UPDATE ================= */
  openEditModal(p: any) {
    this.editPermission = p;
    this.form = {
      name: p.name,
      code: p.code,
      route: p.endPoint,
      method: p.method,
      routeName: p.routeName
    };
    this.modal.show();
  }

  submit() {
    const api = this.editPermission
      ? this.roleService.updatePermission(this.editPermission.id, this.form)
      : this.roleService.createPermission(this.form);

    api.subscribe({
      next: () => {
        this.toastr.success(
          this.editPermission ? 'Cập nhật thành công' : 'Tạo mới thành công'
        );
        this.modal.hide();
        this.loadPermissions();
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Thao tác thất bại');
      }
    });
  }

  /* ================= DELETE ================= */
  openDeleteModal(p: any) {
    this.deletePermissionItem = p;
    this.deleteModal.show();
  }

  confirmDelete() {
    if (!this.deletePermissionItem) return;

    this.roleService.deletePermission(this.deletePermissionItem.code).subscribe({
      next: () => {
        this.toastr.success('Xóa permission thành công');
        this.deleteModal.hide();
        this.loadPermissions();
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Xóa thất bại');
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.search(this.searchKeyword);
    } else {
      this.loadPermissions();
    }
  }
}
