import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { RoleService } from '../../_services/role.service';
import { ToastrService } from 'ngx-toastr';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, NgClass],
  templateUrl: './route-management.html',
  styleUrl: './route-management.css'
})
export class RouteManagement implements OnInit, AfterViewInit {

  routes: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  searchKeyword = '';
  private searchSubject = new Subject<string>();

  createModal: any;
  editModal: any;

  newRoute = {
    route: '',
    description: ''
  };

  editRoute: any = null;

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;
  canViewDetail = false;

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService,
    private permission: PermissionService,
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
    this.loadRoutes();

    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(keyword => {
        keyword.trim()
          ? this.searchRoutes(keyword)
          : this.loadRoutes();
      });
  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createRouteModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updateRouteModal')
    );
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/routes/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/routes/update', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/routes/changeStatus', 'PUT');

  }

  loadRoutes() {
    this.loading = true;
    this.roleService.getAllRoute(this.page, this.size).subscribe({
      next: res => {
        const result = res.data;
        this.routes = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.page = result.currentPage || 0;
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


  searchRoutes(keyword: string) {
    this.loading = true;
    this.roleService.getSearchAllRoute(keyword, this.page, this.size).subscribe({
      next: res => {
        const result = res.data;
        this.routes = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: () => {
        this.routes = [];
        this.loading = false;
        this.toastr.error('Tìm kiếm thất bại!');
      }
    });
  }

  openCreateModal() {
    this.newRoute = { route: '', description: '' };
    this.createModal.show();
  }

  submitCreateRoute() {
    this.roleService.createRoute(this.newRoute).subscribe({
      next: () => {
        this.toastr.success('Tạo route thành công!');
        this.createModal.hide();
        this.loadRoutes();
      },
      error: (err) => this.toastr.error(err?.error?.message ||'Tạo route thất bại!')
    });
  }

  openEditModal(route: any) {
    this.editRoute = { ...route };
    this.editModal.show();
  }

  submitUpdateRoute(id: number) {
    const body = {
      route: this.editRoute.route,
      description: this.editRoute.description
    };

    this.roleService.updateRoute(id, body).subscribe({
      next: () => {
        this.toastr.success('Cập nhật route thành công!');
        this.editModal.hide();
        this.loadRoutes();
      },
      error: (err) => this.toastr.error(err?.error?.message ||'Cập nhật route thất bại!')
    });
  }

  toggleStatus(id: any) {
    this.roleService.changeStatusRoute(id).subscribe({
      next: () => {
        this.toastr.success('Đã đổi trạng thái!');
        this.loadRoutes();
      },
      error: () => this.toastr.error('Đổi trạng thái thất bại!')
    });
  }


  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchRoutes(this.searchKeyword);
    } else {
      this.loadRoutes();
    }
  }

}
