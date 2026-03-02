import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {PublisherService} from '../../_services/publisher.service';
import {debounceTime, Subject} from 'rxjs';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;


@Component({
  selector: 'app-publisher-management',
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './publisher-management.html',
  styleUrl: './publisher-management.css',
})
export class PublisherManagement implements OnInit, AfterViewInit{
  publishers: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;

  editPublisher: any = null;
  editModal: any;


  createModal: any;


  newPublisher = {
    publisherName: '',
    email: '',
    phone: ''
  };

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;
  canViewDetail = false;

  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private publisherService: PublisherService,
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
    this.loadPublishers();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchPublishers(keyword.trim());
        } else {
          this.loadPublishers();
        }
      });
  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createPublisherModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updatePublisherModal')
    );
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/publisher/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/publisher/updatePublisher', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/publisher/changeStatusPublisher', 'PUT');

  }

  loadPublishers() {
    this.loading = true;
    this.publisherService.getAllPublisher(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.publishers = result.data || [];
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

  searchPublishers(keyword: string) {
    this.loading = true;
    this.publisherService.getSearchAllPublisher(keyword,this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.publishers = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.publishers = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }

  openEditModal(a: any) {
    this.editPublisher = { ...a };

    this.editModal.show();
  }

  submitUpdatePublisher(id: number) {
    const body = {
      publisherName: this.editPublisher.publisherName,
      email: this.editPublisher.email,
      phone: this.editPublisher.phone
    };

    this.publisherService.updatePublisher(id, body).subscribe({
      next: res => {
        this.toastr.success("Cập nhật nhà xuất bản thành công!");
        this.editModal.hide();
        this.loadPublishers();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Cập nhật nhà xuất bản thất bại!"
        );
      }
    });
  }

  toggleStatus(id: number) {
    this.publisherService.changeStatus(id).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadPublishers();
      },
      error: err => {
        console.error(err);
        this.toastr.error("Đổi trạng thái thất bại!");
      }
    });
  }


  openCreateModal() {
    this.newPublisher = {
      publisherName: '',
      email: '',
      phone: ''
    };
    this.createModal.show();
  }

  submitCreatePublisher() {
    const body = {
      publisherName: this.newPublisher.publisherName,
      email: this.newPublisher.email,
      phone: this.newPublisher.phone
    };

    this.publisherService.createPublisher(body).subscribe({
      next: res => {
        this.toastr.success("Tạo nhà xuất bản thành công!");
        this.createModal.hide();
        this.loadPublishers();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Tạo nhà xuất bản thất bại!"
        );
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchPublishers(this.searchKeyword);
    } else {
      this.loadPublishers();
    }
  }
}
