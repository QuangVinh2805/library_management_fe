import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../_services/role.service';
import {PermissionService} from '../../_services/permission.service';

@Component({
  selector: 'app-decentralization',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule],
  templateUrl: './decentralization.html',
  styleUrl: './decentralization.css'
})
export class Decentralization implements OnInit {

  /** TAB */
  activeTab: 'ROLE' | 'USER' = 'ROLE';

  /** COMMON */
  loading = false;

  /** ===== ROLE ===== */
  roles: any[] = [];
  rolePage = 0;
  roleSize = 10;
  roleTotalPages = 0;
  selectedRoleId: number | null = null;

  /** ===== USER ===== */
  users: any[] = [];
  userPage = 0;
  userSize = 10;
  userTotalPages = 0;
  selectedUserPublicId: string | null = null;

  /** ===== PERMISSION ===== */
  permissions: any[] = [];
  permissionPage = 0;
  permissionSize = 10;
  permissionTotalPages = 0;

  showAssignModal = false;
  allPermissions: any[] = [];
  selectedPermissionIds: number[] = [];
  permissionKeyword = '';
  filteredPermissions: any[] = [];

  canCreatePermissionRole = false;
  canCreatePermissionUser = false;
  canRemovePermissionRole = false;
  canRemovePermissionUser = false;

  showConfirmDeleteModal = false;
  permissionIdToDelete: number | null = null;

  permissionSearchKeyword = '';


  constructor(
    private decentralizationService: RoleService,
    private permission: PermissionService,
    private toastr: ToastrService
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
    this.loadRoles();
    this.loadUsers();
  }

  loadPermissionUI() {
    this.canCreatePermissionRole = this.permission.hasPermission('/api/admin/assign-permission/role', 'POST');
    this.canCreatePermissionUser = this.permission.hasPermission('/api/admin/assign-permission/user', 'POST');
    this.canRemovePermissionRole = this.permission.hasPermission('/permissions/role/permissions/remove', 'DELETE');
    this.canRemovePermissionUser = this.permission.hasPermission('/permissions/user/permissions/remove', 'DELETE');

  }

  openConfirmDelete(permissionId: number) {
    this.permissionIdToDelete = permissionId;
    this.showConfirmDeleteModal = true;
  }

  closeConfirmDelete() {
    this.showConfirmDeleteModal = false;
    this.permissionIdToDelete = null;
  }


  /** ================= TAB ================= */

  switchTab(tab: 'ROLE' | 'USER') {
    this.activeTab = tab;

    // reset selection
    this.selectedRoleId = null;
    this.selectedUserPublicId = null;

    // reset permission
    this.permissions = [];
    this.permissionPage = 0;
    this.permissionTotalPages = 0;
  }

  loadAllPermissions() {
    this.decentralizationService
      .getAllPermission(0, 1000)
      .subscribe({
        next: res => {
          const r = res.data;
          this.allPermissions = r?.data || [];
          this.filteredPermissions = [...this.allPermissions];
        },
        error: () => this.toastr.error('Load permission thất bại')
      });
  }


  filterPermission() {
    const keyword = this.permissionKeyword.trim().toLowerCase();

    if (!keyword) {
      this.filteredPermissions = [...this.allPermissions];
      return;
    }

    this.filteredPermissions = this.allPermissions.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.code?.toLowerCase().includes(keyword) ||
      p.route?.toLowerCase().includes(keyword)
    );
  }


  togglePermission(permissionId: number, checked: boolean) {

    if (checked) {
      if (!this.selectedPermissionIds.includes(permissionId)) {
        this.selectedPermissionIds.push(permissionId);
      }
    } else {
      this.selectedPermissionIds =
        this.selectedPermissionIds.filter(id => id !== permissionId);
    }

  }


  openAssignModal() {
    if (
      (this.activeTab === 'ROLE' && !this.selectedRoleId) ||
      (this.activeTab === 'USER' && !this.selectedUserPublicId)
    ) {
      this.toastr.warning('Vui lòng chọn role hoặc user trước');
      return;
    }

    this.selectedPermissionIds = [];
    this.loadAllPermissions();
    this.showAssignModal = true;
  }


  closeAssignModal() {
    this.showAssignModal = false;
  }


  assignPermission() {

    if (this.selectedPermissionIds.length === 0) {
      this.toastr.warning('Không được để trống permission');
      return;
    }

    if (this.activeTab === 'ROLE' && this.selectedRoleId) {
      this.decentralizationService
        .assignPermissionToRole(this.selectedRoleId, this.selectedPermissionIds)
        .subscribe({
          next: res => {
            this.toastr.success(res.message || 'Gán permission thành công');
            this.closeAssignModal();
            this.loadPermissionByRole();
            this.selectedPermissionIds = [];
          },
          error: err =>
            this.toastr.error(err.error?.message || 'Gán permission thất bại')
        });
    }
  }





  /** ================= ROLE ================= */

  loadRoles() {
    this.decentralizationService
      .getAllRoleByStatus(this.rolePage, this.roleSize)
      .subscribe({
        next: res => {
          const r = res.data;
          this.roles = r.data || [];
          this.roleTotalPages = r.totalPages || 0;
          this.rolePage = r.currentPage || 0;
        },
        error: () => this.toastr.error('Load role thất bại')
      });
  }

  selectRole(roleId: number) {
    this.selectedRoleId = roleId;
    this.permissionPage = 0;
    this.permissionSearchKeyword = '';
    this.loadPermissionByRole();
  }

  loadPermissionByRole() {
    if (!this.selectedRoleId) return;

    this.loading = true;

    console.log("param" + this.selectedRoleId);


    const apiCall = this.permissionSearchKeyword?.trim()
      ? this.decentralizationService.searchPermissionByRole(
        this.selectedRoleId,
        this.permissionPage,
        this.permissionSize,
        this.permissionSearchKeyword

      )
      : this.decentralizationService.getPermissionByRole(
        this.selectedRoleId,
        this.permissionPage,
        this.permissionSize
      );

    apiCall.subscribe({
      next: res => {
        const r = res.data;

        this.permissions = r.data || [];
        this.permissionTotalPages = r.totalPages || 0;
        this.permissionPage = r.currentPage || 0;

        this.loading = false;


      },
      error: () => {
        this.permissions = [];
        this.loading = false;
        this.toastr.error('Load permission thất bại');
      }
    });
  }

  searchPermission() {
    this.permissionPage = 0;
    this.loadPermissionByRole();
  }


  changeRolePage(p: number) {
    if (p < 0 || p >= this.roleTotalPages) return;
    this.rolePage = p;
    this.loadRoles();
  }

  /** ================= USER ================= */

  loadUsers() {
    this.decentralizationService
      .getAllUserByStatus(this.userPage, this.userSize)
      .subscribe({
        next: res => {
          const r = res.data;
          this.users = r.data || [];
          this.userTotalPages = r.totalPages || 0;
          this.userPage = r.currentPage || 0;
        },
        error: () => this.toastr.error('Load user thất bại')
      });
  }







  changeUserPage(p: number) {
    if (p < 0 || p >= this.userTotalPages) return;
    this.userPage = p;
    this.loadUsers();
  }

  /** ================= PERMISSION PAGING ================= */

  changePermissionPage(p: number) {
    if (p < 0 || p >= this.permissionTotalPages) return;
    this.permissionPage = p;

    this.activeTab === 'ROLE'
       this.loadPermissionByRole();
  }




  confirmDeletePermission() {
    if (!this.permissionIdToDelete) return;

    // ===== ROLE =====
    if (this.activeTab === 'ROLE' && this.selectedRoleId) {
      this.decentralizationService
        .removePermissionFromRole(this.selectedRoleId, this.permissionIdToDelete)
        .subscribe({
          next: () => {
            this.toastr.success('Đã gỡ permission khỏi role');
            this.closeConfirmDelete();
            this.loadPermissionByRole();
          },
          error: err =>
            this.toastr.error(err.error?.message || 'Gỡ permission thất bại')
        });
    }

  }


}
