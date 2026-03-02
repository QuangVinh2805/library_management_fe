import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../_services/user.service';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {ProductService} from '../../_services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [NgIf, RouterLink, NgForOf],
})
export class Header implements OnInit {
  userName: string | null = null;
  showDropdown = false;
  showMenuDropdown = false;
  page = 0;
  size = 5;

  searchResults: any[] = [];
  showSearchDropdown = false;
  isLoggedIn = false;


  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(keyword => {
        if (keyword.trim().length > 0) {
          this.search(keyword);
        }
      });


    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userName = user.name ? user.name.trim() : 'User';
      } catch (e) {
        console.error('Lỗi parse user từ localStorage', e);
      }
    }
  }

  onSearchChange(event: any) {
    const keyword = event.target.value.trim();

    if (keyword.length === 0) {
      this.searchResults = [];
      this.showSearchDropdown = false;
      return;
    }

    this.searchSubject.next(keyword);
  }

  submitSearch() {
    const input: any = document.querySelector('.ol-search input');
    if (input && input.value.trim()) {
      const keyword = input.value.trim();
      this.router.navigate(['/reader/product-search'], { queryParams: { keyword } });

      this.showSearchDropdown = false;
      this.searchResults = [];
    }
  }


  selectProduct(item: any) {
    this.showSearchDropdown = false;
    this.searchResults = [];
    this.router.navigate(['/reader/product-detail', item.hashId]);
  }

  search(keyword: string) {
    this.productService.getSearchProductByStatus(keyword, this.page, this.size).subscribe({
      next: (res) => {
        this.searchResults = res.data.slice(0, 5);
        this.showSearchDropdown = true;
      },
      error: () => {
        this.searchResults = [];
        this.showSearchDropdown = false;
      }
    });
  }

  onUserClick() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.userName = null;
      this.showDropdown = false;
      this.router.navigate(['/login']);
    } else {
      this.showDropdown = !this.showDropdown;
      this.showMenuDropdown = false;
      this.isLoggedIn = true;
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this.userName = user.name ? user.name.trim() : 'User';
        } catch {
          this.userName = 'User';
        }
      }
    }
  }

  onMenuClick() {
    this.showMenuDropdown = !this.showMenuDropdown;
    this.showDropdown = false;
  }

  goToCategory() {
    this.router.navigate(['/reader/categories']);
    this.showMenuDropdown = false;
  }

  goToAuthors() {
    this.router.navigate(['/reader/authors']);
    this.showMenuDropdown = false;
  }

  goToPublishers() {
    this.router.navigate(['/reader/publishers']);
    this.showMenuDropdown = false;
  }

  goToFavourites() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token không tồn tại');
      return;
    }

    this.router.navigate(['/reader/favourite-product', token]);
    this.showMenuDropdown = false;
  }

  goToProductPreReservation() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token không tồn tại');
      return;
    }

    this.router.navigate(['/reader/product-pre-reservation']);
    this.showMenuDropdown = false;
  }



  goToProfile() {
    this.router.navigate(['/reader/profile']);
    this.showDropdown = false;
  }

  changePassword() {
    this.router.navigate(['/reader/change-password']);
    this.showDropdown = false;
  }

  logout() {
    const token = localStorage.getItem('token');

    this.userName = null;
    this.showDropdown = false;
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    if (!token) {
      this.toastr.error("Không tìm thấy token, không thể logout");
      this.router.navigate(['/login']);
      return;
    }

    this.userService.readerLogout(token).subscribe({
      next: () => {
        this.toastr.success("Đăng xuất thành công");
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error("Đăng xuất thất bại");
        this.router.navigate(['/login']);
      }
    });
  }

}
