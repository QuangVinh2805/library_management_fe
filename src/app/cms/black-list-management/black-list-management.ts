import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BlackListService} from '../../_services/black-list.service';
import {debounceTime, Subject} from 'rxjs';
import {UserService} from '../../_services/user.service';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;


@Component({
  selector: 'app-black-list-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './black-list-management.html',
  styleUrl: './black-list-management.css',
})
export class BlackListManagement implements OnInit,AfterViewInit {
  blacklists: any[] = [];
  users: any[] = [];


  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  loading = true;

  createModal: any;

  editModal: any;



  newBlackList = {
    email: '',
    reason:''
  };

  editBlackList = {
    email: '',
    reason: ''
  };

  deleteUserCode: string = '';
  deleteUserName: string = '';
  deleteModal: any;

  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  canCreate = false;
  canUpdate = false;
  canDelete = false;


  constructor(
    private blackListService: BlackListService,
    private toastr: ToastrService,
    private permission: PermissionService,
    private userService: UserService,
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
    this.loadBlackLists();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchBlackLists(keyword.trim());
        } else {
          this.loadBlackLists();
        }
      });
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/blacklist/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/blacklist/update', 'PUT');
    this.canDelete = this.permission.hasPermission('/blacklist/delete', 'DELETE');

  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createBlackListModal')
    );


    this.editModal = new bootstrap.Modal(
      document.getElementById('updateBlackListModal')
    );

    this.deleteModal = new bootstrap.Modal(
      document.getElementById('deleteBlackListModal')
    );


  }


  loadBlackLists() {
    this.loading = true;
    this.blackListService.getAllBlackList(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.blacklists = result.data || [];

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

  searchBlackLists(keyword: string) {
    this.loading = true;
    this.blackListService.getSearchAllUserBlackList(keyword,this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.blacklists = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.blacklists = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }

  openCreateModal() {
    this.newBlackList = {
      email: '',
      reason:''
    };
    this.createModal.show();
  }

  submitCreateBlackList() {
    const body = {
      email: this.newBlackList.email,
      reason: this.newBlackList.reason
    };

    this.blackListService.createBlackList(body).subscribe({
      next: res => {
        this.toastr.success("Tạo danh mục thành công!");
        this.createModal.hide();
        this.loadBlackLists();
      },
      error: err => {
        console.error(err);
        this.toastr.error(err?.error?.message ||"Tạo danh mục thất bại!");
      }
    });
  }

  openEditModal(item: any) {
    this.editBlackList = {
      email: item.email,
      reason: item.reason
    };

    this.editModal.show();
  }

  submitUpdateBlackList() {
    const body = {
      email: this.editBlackList.email,
      reason: this.editBlackList.reason
    };

    this.blackListService.updateBlackList(body).subscribe({
      next: res => {
        this.toastr.success("Cập nhật thành công!");
        this.editModal.hide();
        this.loadBlackLists();
      },
      error: err => {
        console.error(err);
        this.toastr.error(err?.error?.message || "Cập nhật thất bại!");
      }
    });
  }

  openDeleteModal(item: any) {
    this.deleteUserCode = item.userCode;
    this.deleteUserName = item.userName;
    this.deleteModal.show();
  }



  submitDelete() {
    this.blackListService.deleteBlackList(this.deleteUserCode).subscribe({
      next: res => {
        this.toastr.success("Xóa thành công!");
        this.deleteModal.hide();
        this.loadBlackLists();
      },
      error: err => {
        console.error(err);
        this.toastr.error(err?.error?.message || "Xóa thất bại!");
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchBlackLists(this.searchKeyword);
    } else {
      this.loadBlackLists();
    }
  }



}
