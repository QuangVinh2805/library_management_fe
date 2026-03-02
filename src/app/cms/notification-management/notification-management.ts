import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NotificationService} from '../../_services/notification.service';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-notification-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-management.html',
  styleUrl: './notification-management.css',
})
export class NotificationManagement implements OnInit, AfterViewInit {

  notifications: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  loading = true;
  imagePreview: string | null = null;

  detailNotification: any = null;
  detailModal: any;

  createModal: any;

  selectedImage: File | null = null;

  newNotification = {
    notification: '',
    title: ''
  };

  editNotification: any = null;
  editModal: any;
  selectedEditImage: File | null = null;
  editImagePreview: string | null = null;

  deleteId: number | null = null;
  deleteTitle: string = '';
  deleteContent: string = '';
  deleteModal: any;

  sendAllId: number | null = null;
  sendAllTitle: string = '';
  sendAllModal: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;
  canSendAll = false;


  constructor(
    private notificationService: NotificationService,
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
    this.loadNotifications();
  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createNotificationModal')
    );
    this.editModal = new bootstrap.Modal(
      document.getElementById('updateNotificationModal')
    );

    this.detailModal = new bootstrap.Modal(
      document.getElementById('detailNotificationModal')
    );

    this.deleteModal = new bootstrap.Modal(
      document.getElementById('deleteNotificationModal')
    );

    this.sendAllModal = new bootstrap.Modal(
      document.getElementById('sendAllModal')
    );
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/notification/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/notification/update', 'PUT');
    this.canDelete = this.permission.hasPermission('/notification/delete', 'DELETE');
    this.canSendAll = this.permission.hasPermission('/notification/sendAll', 'POST');

  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getAllNotification(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.notifications = result.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  viewDetail(notificationId: string) {
    this.notificationService.getNotification(notificationId).subscribe({
      next: res => {
        this.detailNotification = res.data;
        this.detailModal.show();
      },
      error: err => console.error(err)
    });
  }

  openCreateModal() {
    this.newNotification = {
      notification: '',
      title: ''
    };
    this.selectedImage = null;

    this.createModal.show();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;

    if (file) {
      this.imagePreview = URL.createObjectURL(file);
    } else {
      this.imagePreview = null;
    }
  }

  submitCreateNotification() {
    const formData = new FormData();

    formData.append("notification", this.newNotification.notification);
    formData.append("title", this.newNotification.title);

    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    this.notificationService.createNotification(formData).subscribe({
      next: res => {
        this.toastr.success("Tạo thông báo thành công!");
        this.createModal.hide();
        this.loadNotifications();
      },
      error: err => {
        console.error(err);
        this.toastr.error(err?.error?.message ||"Tạo thông báo thất bại!");
      }
    });
  }


  openEditModal(p: any) {
    this.editNotification = {...p}; // copy tránh sửa trực tiếp
    this.editImagePreview = p.image ? 'http://localhost:8177' + p.image : null;
    this.selectedEditImage = null;

    this.editModal.show();
  }

  onEditImageSelected(event: any) {
    const file = event.target.files[0];
    this.selectedEditImage = file;

    if (file) {
      this.editImagePreview = URL.createObjectURL(file);
    }
  }


  submitUpdateNotification() {
    const formData = new FormData();

    formData.append("notification", this.editNotification.notification);
    formData.append("title", this.editNotification.title);

    if (this.selectedEditImage) {
      formData.append("image", this.selectedEditImage);
    }

    this.notificationService.updateNotification(this.editNotification.id, formData)
      .subscribe({
        next: res => {
          this.toastr.success("Cập nhật sản phẩm thành công!");
          this.editModal.hide();
          this.loadNotifications();
        },
        error: err => {
          console.error(err);
          this.toastr.error(err?.error?.message ||"Cập nhật thất bại!");
        }
      });
  }

  openDeleteModal(item: any) {
    this.deleteId = item.id;
    this.deleteTitle = item.title;
    this.deleteContent = item.notification;
    this.deleteModal.show();
  }


  submitDelete() {
    if (!this.deleteId) {
      this.toastr.error("Không tìm thấy ID để xóa!");
      return;
    }

    this.notificationService.deleteNotification(this.deleteId).subscribe({
      next: res => {
        this.toastr.success("Xóa thành công!");
        this.deleteModal.hide();
        this.loadNotifications();
      },
      error: err => {
        console.error(err);
        this.toastr.error(err.error.message || "Xóa thất bại!");
      }
    });
  }

  openSendAllModal(item: any) {
    this.sendAllId = item.id;
    this.sendAllTitle = item.title;
    this.sendAllModal.show();
  }


  submitSendAll() {
    if (this.sendAllId === null) {
      this.toastr.error("Không tìm thấy ID thông báo!");
      return;
    }

    this.notificationService.sendAll(this.sendAllId).subscribe({
      next: res => {
        this.toastr.success("Đã bắt đầu gửi email nền!");
        this.sendAllModal.hide();
      },
      error: err => {
        console.error(err);
        this.toastr.error(err.error.message || "Gửi email thất bại!");
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadNotifications();
  }

}
