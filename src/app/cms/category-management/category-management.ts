import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CategoryService} from '../../_services/category.service';
import {debounceTime, Subject} from 'rxjs';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;



@Component({
  selector: 'app-category-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css',
})
export class CategoryManagement implements OnInit, AfterViewInit{
  categories: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  editCategory: any = null;
  editModal: any;


  createModal: any;


  newCategory = {
    categoryName: ''
  };

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;

  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private categoryService: CategoryService,
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
    this.loadCategories();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchCategories(keyword.trim());
        } else {
          this.loadCategories();
        }
      });
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/category/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/category/updateCategory', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/category/changeStatusCategory', 'PUT');

  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createCategoryModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updateCategoryModal')
    );
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAllCategory(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.categories = result.data || [];
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

  searchCategories(keyword: string) {
    this.loading = true;
    this.categoryService.getSearchAllCategory(keyword,this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.categories = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.categories = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }

  openEditModal(a: any) {
    this.editCategory = { ...a };

    this.editModal.show();
  }

  submitUpdateCategory(id: number) {
    const body = {
      categoryName: this.editCategory.categoryName
    };

    this.categoryService.updateCategory(id, body).subscribe({
      next: res => {
        this.toastr.success("Cập nhật danh mục thành công!");
        this.editModal.hide();
        this.loadCategories();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Cập nhật danh mục thất bại!"
        );
      }
    });
  }

  toggleStatus(id: number) {
    this.categoryService.changeStatus(id).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadCategories();
      },
      error: err => {
        console.error(err);
        this.toastr.error("Đổi trạng thái thất bại!");
      }
    });
  }


  openCreateModal() {
    this.newCategory = {
      categoryName: ''
    };
    this.createModal.show();
  }

  submitCreateCategory() {
    const body = {
      categoryName: this.newCategory.categoryName
    };

    this.categoryService.createCategory(body).subscribe({
      next: res => {
        this.toastr.success("Tạo danh mục thành công!");
        this.createModal.hide();
        this.loadCategories();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Tạo danh mục thất bại!"
        );
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchCategories(this.searchKeyword);
    } else {
      this.loadCategories();
    }
  }
}
