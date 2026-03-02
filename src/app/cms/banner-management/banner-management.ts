import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {BannerService} from '../../_services/banner.service';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;


@Component({
  selector: 'app-banner-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './banner-management.html',
  styleUrl: './banner-management.css',
})
export class BannerManagement implements OnInit, AfterViewInit {

  banners: any[] = [];
  loading = true;
  imagePreview: string | null = null;

  createModal: any;

  selectedImage: File | null = null;

  newBanner = {
    title: '',
    description: ''
  };

  editBanner: any = null;
  editModal: any;
  selectedEditImage: File | null = null;
  editImagePreview: string | null = null;

  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;

  constructor(
    private bannerService: BannerService,
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
    this.loadBanners();
  }

  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/banner/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/banner/update', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/banner/changeStatus', 'PUT');
  }

  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createBannerModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updateBannerModal')
    );
  }

  loadBanners() {
    this.loading = true;
    this.bannerService.getAllBanner().subscribe({
      next: (res) => {
        this.banners = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.newBanner = {
      title: '',
      description: ''
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

  submitCreateBanner() {
    const formData = new FormData();

    formData.append("title", this.newBanner.title);
    formData.append("description", this.newBanner.description);

    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    this.bannerService.createBanner(formData).subscribe({
      next: res => {
        this.toastr.success("Tạo quảng cáo thành công!");
        this.createModal.hide();
        this.loadBanners();
      },
      error: err => {
        this.toastr.error(
          err?.error?.message || "Tạo quảng cáo thất bại!"
        );
      }
    });
  }

  openEditModal(p: any) {
    this.editBanner = { ...p };
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


  submitUpdateBanner() {
    const formData = new FormData();

    formData.append("title", this.editBanner.title);
    formData.append("description", this.editBanner.description);

    if (this.selectedEditImage) {
      formData.append("image", this.selectedEditImage);
    }

    this.bannerService.updateBanner(this.editBanner.id, formData)
      .subscribe({
        next: res => {
          this.toastr.success("Cập nhật quảng cáo thành công!");
          this.editModal.hide();
          this.loadBanners();
        },
        error: err => {
          this.toastr.error(
            err?.error?.message || "Cập nhật quảng cáo thất bại!"
          );
        }
      });
  }

  toggleStatus(id: number) {
    this.bannerService.changeStatus(id).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadBanners();
      },
      error: err => {
        console.error(err);
        this.toastr.error("Đổi trạng thái thất bại!");
      }
    });
  }

}
