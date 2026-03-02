import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorService } from '../../_services/author.service';
import {debounceTime, Subject} from 'rxjs';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-author-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './author-management.html',
  styleUrl: './author-management.css',
})
export class AuthorManagement implements OnInit, AfterViewInit {
  authors: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  editAuthor: any = null;
  editModal: any;


  createModal: any;

  selectedImage: File | null = null;

  newAuthor = {
    authorName: '',
    birthday: '',
    address: ''
  };

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;

  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private authorService: AuthorService,
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
    this.loadAuthors();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchAuthors(keyword.trim());
        } else {
          this.loadAuthors();
        }
      });
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/author/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/author/updateAuthor', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/author/changeStatusAuthor', 'PUT');
  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createAuthorModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updateAuthorModal')
    );
  }

  loadAuthors() {
    this.loading = true;
    this.authorService.getAllAuthor(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.authors = result.data || [];
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

  searchAuthors(keyword: string) {
    this.loading = true;
    this.authorService.getSearchAllAuthor(keyword,this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.authors = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.authors = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }

  openEditModal(a: any) {
    this.editAuthor = { ...a };

    this.editModal.show();
  }

  submitUpdateAuthor(id: number) {
    const body = {
      authorName: this.editAuthor.authorName,
      birthday: this.editAuthor.birthday,
      address: this.editAuthor.address
    };

    this.authorService.updateAuthor(id, body).subscribe({
      next: res => {
        this.toastr.success("Cập nhật tác giả thành công!");
        this.editModal.hide();
        this.loadAuthors();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Cập nhật tác giả thất bại!"
        );
      }
    });
  }

  toggleStatus(id: number) {
    this.authorService.changeStatus(id).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadAuthors();
      },
      error: err => {
        console.error(err);
        this.toastr.error("Đổi trạng thái thất bại!");
      }
    });
  }


  openCreateModal() {
    this.newAuthor = {
      authorName: '',
      birthday: '',
      address: ''
    };
    this.createModal.show();
  }

  submitCreateAuthor() {
    const body = {
      authorName: this.newAuthor.authorName,
      birthday: this.newAuthor.birthday,
      address: this.newAuthor.address
    };

    this.authorService.createAuthor(body).subscribe({
      next: res => {
        this.toastr.success("Tạo tác giả thành công!");
        this.createModal.hide();
        this.loadAuthors();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Tạo tác giả thất bại!"
        );
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchAuthors(this.searchKeyword);
    } else {
      this.loadAuthors();
    }
  }

}
