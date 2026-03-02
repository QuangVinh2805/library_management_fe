import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../_services/product.service';
import {debounceTime, Subject} from 'rxjs';
import {PublisherService} from '../../_services/publisher.service';
import {CategoryService} from '../../_services/category.service';
import {AuthorService} from '../../_services/author.service';
import {PermissionService} from '../../_services/permission.service';

declare var bootstrap: any;

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
})
export class ProductManagement implements OnInit, AfterViewInit {
  products: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;
  totalItems = 0;
  imagePreview: string | null = null;

  detailProduct: any = null;
  detailModal: any;

  editProduct: any = null;
  editModal: any;
  selectedEditImage: File | null = null;
  editImagePreview: string | null = null;

  createModal: any;



  selectedImage: File | null = null;

  newProduct = {
    productName: '',
    quantity: 0,
    price: 0,
    publisherName: '',
    publicationDate: '',
    description: '',
    authorName: '',
    categoryName: '',
    location:''
  };

  authorSuggestions: any[] = [];
  categorySuggestions: any[] = [];
  publisherSuggestions: any[] = [];

  showAuthorDropdown = false;
  showCategoryDropdown = false;
  showPublisherDropdown = false;

  authorSearch$ = new Subject<string>();
  categorySearch$ = new Subject<string>();
  publisherSearch$ = new Subject<string>();


  canCreate = false;
  canUpdate = false;
  canChangeStatus = false;
  canViewDetail = false;


  searchKeyword: string = '';
  private searchSubject = new Subject<string>();


  constructor(
    private productService: ProductService,
    private authorService : AuthorService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
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
    this.loadProducts();

    this.searchSubject
      .pipe(
        debounceTime(300),
      )
      .subscribe(keyword => {
        if (keyword.trim()) {
          this.searchProducts(keyword.trim());
        } else {
          this.loadProducts();
        }
      });


    this.authorSearch$
      .pipe(debounceTime(300))
      .subscribe(keyword => this.searchAuthor(keyword));

    this.categorySearch$
      .pipe(debounceTime(300))
      .subscribe(keyword => this.searchCategory(keyword));

    this.publisherSearch$
      .pipe(debounceTime(300))
      .subscribe(keyword => this.searchPublisher(keyword));
  }



  ngAfterViewInit() {
    this.createModal = new bootstrap.Modal(
      document.getElementById('createProductModal')
    );

    this.detailModal = new bootstrap.Modal(
      document.getElementById('detailProductModal')
    );

    this.editModal = new bootstrap.Modal(
      document.getElementById('updateProductModal')
    );
  }


  loadPermissionUI() {
    this.canCreate = this.permission.hasPermission('/product/create', 'POST');
    this.canUpdate = this.permission.hasPermission('/product/update', 'PUT');
    this.canChangeStatus = this.permission.hasPermission('/product/changeStatusProduct', 'PUT');

  }


  loadProducts() {
    this.loading = true;

    this.productService.getAllProduct(this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.products = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;

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

  searchProducts(keyword: string) {
    this.loading = true;
    this.productService.getSearchAllProduct(keyword,this.page, this.size).subscribe({
      next: (res) => {
        const result = res.data;

        this.products = result.data || [];
        this.totalPages = result.totalPages || 0;
        this.totalItems = result.totalItems || 0;
        this.page = result.currentPage || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.products = [];
        this.loading = false;
        this.toastr.error("Tìm kiếm thất bại!");
      }
    });
  }


  searchAuthor(keyword: string) {
    this.authorService
      .getSearchAllAuthor(keyword || '', 0, 10)
      .subscribe(res => {
        this.authorSuggestions = res.data?.data || [];
        this.showAuthorDropdown = true;
      });
  }

  searchCategory(keyword: string) {
    this.categoryService
      .getSearchAllCategory(keyword || '', 0, 10)
      .subscribe(res => {
        this.categorySuggestions = res.data?.data || [];
        this.showCategoryDropdown = true;
      });
  }

  searchPublisher(keyword: string) {
    this.publisherService
      .getSearchAllPublisher(keyword || '', 0, 10)
      .subscribe(res => {
        this.publisherSuggestions = res.data?.data || [];
        this.showPublisherDropdown = true;
      });
  }

  onAuthorInputChange(value: string) {
    const keyword = value.split(',').pop()?.trim() || '';
    this.authorSearch$.next(keyword);
  }

  onCategoryInputChange(value: string) {
    const keyword = value.split(',').pop()?.trim() || '';
    this.categorySearch$.next(keyword);
  }

  onPublisherInputChange(value: string) {
    this.publisherSearch$.next(value.trim());
  }


  selectAuthor(name: string, mode: 'create' | 'edit') {
    const target =
      mode === 'create'
        ? this.newProduct.authorName
        : this.editProduct.authorName;

    const parts = target.split(',');
    parts[parts.length - 1] = ' ' + name;

    if (mode === 'create') {
      this.newProduct.authorName = parts.join(',').trim();
    } else {
      this.editProduct.authorName = parts.join(',').trim();
    }

    this.closeAllDropdowns();
  }

  selectCategory(name: string, mode: 'create' | 'edit') {
    const target =
      mode === 'create'
        ? this.newProduct.categoryName
        : this.editProduct.categoryName;

    const parts = target.split(',');
    parts[parts.length - 1] = ' ' + name;

    if (mode === 'create') {
      this.newProduct.categoryName = parts.join(',').trim();
    } else {
      this.editProduct.categoryName = parts.join(',').trim();
    }

    this.closeAllDropdowns();
  }


  selectPublisher(name: string, mode: 'create' | 'edit') {
    const target =
      mode === 'create'
        ? this.newProduct.publisherName
        : this.editProduct.publisherName;

    const parts = target.split(',');
    parts[parts.length - 1] = ' ' + name;

    if (mode === 'create') {
      this.newProduct.publisherName = parts.join(',').trim();
    } else {
      this.editProduct.publisherName = parts.join(',').trim();
    }

    this.closeAllDropdowns();
  }

  onAuthorFocus() {
    this.closeAllDropdowns();
    this.authorSearch$.next('');
    this.showAuthorDropdown = true;
  }

  onCategoryFocus() {
    this.closeAllDropdowns();
    this.categorySearch$.next('');
    this.showCategoryDropdown = true;
  }

  onPublisherFocus() {
    this.closeAllDropdowns();
    this.publisherSearch$.next('');
    this.showPublisherDropdown = true;
  }



  closeAllDropdowns() {
    this.showAuthorDropdown = false;
    this.showCategoryDropdown = false;
    this.showPublisherDropdown = false;
  }





  openCreateModal() {
    this.newProduct = {
      productName: '',
      quantity: 0,
      price: 0,
      publisherName: '',
      publicationDate: '',
      description: '',
      authorName: '',
      categoryName: '',
      location:''
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
  submitCreateProduct() {
    const formData = new FormData();

    formData.append('productName', this.newProduct.productName);
    formData.append('quantity', String(this.newProduct.quantity));
    formData.append('price', String(this.newProduct.price));
    formData.append('authorName', this.newProduct.authorName);
    formData.append('categoryName', this.newProduct.categoryName);
    formData.append('publisherName', this.newProduct.publisherName);
    formData.append('location', this.newProduct.location);
    formData.append('description', this.newProduct.description || '');
    formData.append('publicationDate', this.newProduct.publicationDate || '');

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.toastr.success('Tạo thành công!');
        this.createModal.hide();
        this.loadProducts();
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Tạo thất bại!');
      }
    });
  }



  viewDetail(hashId: string) {
    this.productService.getProductByHashId(hashId).subscribe({
      next: res => {
        this.detailProduct = res.data;
        this.detailModal.show();
      },
      error: err => console.error(err)
    });
  }

  openEditModal(p: any) {
    this.editProduct = { ...p };
    this.editImagePreview = p.image ? 'http://localhost:8177' + p.image : null;
    this.selectedEditImage = null;
    this.showAuthorDropdown = false;
    this.showCategoryDropdown = false;
    this.showPublisherDropdown = false;

    this.editModal.show();
  }

  onEditImageSelected(event: any) {
    const file = event.target.files[0];
    this.selectedEditImage = file;

    if (file) {
      this.editImagePreview = URL.createObjectURL(file);
    }
  }


  submitUpdateProduct() {
    const formData = new FormData();

    formData.append("productName", this.editProduct.productName);
    formData.append("quantity", String(this.editProduct.quantity));
    formData.append("price", String(this.editProduct.price));
    formData.append("authorName", this.editProduct.authorName);
    formData.append("categoryName", this.editProduct.categoryName);
    formData.append("publisherName", this.editProduct.publisherName);
    formData.append("publicationDate", this.editProduct.publicationDate || '');
    formData.append("description", this.editProduct.description || '');
    formData.append("location", this.editProduct.location);

    if (this.selectedEditImage) {
      formData.append("image", this.selectedEditImage);
    }

    this.productService.updateProduct(this.editProduct.hashId, formData)
      .subscribe({
        next: () => {
          this.toastr.success("Cập nhật thành công!");
          this.editModal.hide();
          this.loadProducts();
        },
        error: err => {
          this.toastr.error(err?.error?.message || 'Cập nhật thất bại!');
        }
      });
  }




  toggleStatus(hashId: string) {
    this.productService.changeStatus(hashId).subscribe({
      next: () => {
        this.toastr.success("Đã đổi trạng thái!");
        this.loadProducts();
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Đổi trạng thái thất bại!');
      }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;

    this.page = p;

    if (this.searchKeyword && this.searchKeyword.length > 0) {
      this.searchProducts(this.searchKeyword);
    } else {
      this.loadProducts();
    }
  }



}
