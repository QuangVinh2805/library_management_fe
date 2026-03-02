import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {UserService} from '../_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {PermissionService} from '../_services/permission.service';

@Component({
  selector: 'app-cms',
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgClass
  ],
  templateUrl: './cms.html',
  styleUrl: './cms.css',
})
export class Cms implements OnInit{
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public permission: PermissionService
  ) {
  }



  isCollapsed = false;

  canUser = false;
  canReader = false;

  canProduct = false;
  canAuthor = false;
  canPublisher = false;
  canCategory = false;

  canBorrowReturn = false;
  canReservation = false;
  canBlackList = false;

  canRole = false;
  canRoute = false;
  canPermission = false;
  canDecentralization = false;

  canNotification = false;
  canBanner = false;
  canStatistical = false;

  ngOnInit() {

    // ✅ trường hợp reload F5
    if (this.permission.permissionLoaded$.value) {
      this.loadMenuPermission();
    }

    // ✅ trường hợp login xong
    this.permission.permissionLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadMenuPermission();
      }
    });

  }


  loadMenuPermission() {
    this.canUser = this.permission.hasRoute('/cms/user-management');
    this.canReader = this.permission.hasRoute('/cms/reader-management');

    this.canProduct = this.permission.hasRoute('/cms/product-management');
    this.canAuthor = this.permission.hasRoute('/cms/author-management');
    this.canPublisher = this.permission.hasRoute('/cms/publisher-management');
    this.canCategory = this.permission.hasRoute('/cms/category-management');

    this.canBorrowReturn = this.permission.hasRoute('/cms/borrow-return-product-management');
    this.canReservation = this.permission.hasRoute('/cms/product-reservation-management');
    this.canBlackList = this.permission.hasRoute('/cms/black-list-management');

    this.canRole = this.permission.hasRoute('/cms/role-management');
    this.canRoute = this.permission.hasRoute('/cms/route-management');
    this.canPermission = this.permission.hasRoute('/cms/permission-management');
    this.canDecentralization = this.permission.hasRoute('/cms/decentralization');

    this.canNotification = this.permission.hasRoute('/cms/notification-management');
    this.canBanner = this.permission.hasRoute('/cms/banner-management');
    this.canStatistical = this.permission.hasRoute('/cms/statistical-management');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.toastr.error("Không tìm thấy token, không thể logout");
      return;
    }

    this.userService.logout(token).subscribe({
      next: () => {
        this.toastr.success("Đăng xuất thành công");

        localStorage.removeItem('token');
        localStorage.removeItem('role');

        this.router.navigate(['/login/cms']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ||"Đăng xuất thất bại");
      }
    });
  }

}
