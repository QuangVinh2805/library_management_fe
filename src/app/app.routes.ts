import {Routes} from '@angular/router';
import {Login} from './login/login';
import {Reader} from './reader/reader';
import {UserManagement} from './cms/user-management/user-management';
import {ReaderManagenment} from './cms/reader-managenment/reader-managenment';
import {ProductManagement} from './cms/product-management/product-management';
import {AuthorManagement} from './cms/author-management/author-management';
import {PublisherManagement} from './cms/publisher-management/publisher-management';
import {CategoryManagement} from './cms/category-management/category-management';
import {
  BorrowReturnProductManagement
} from './cms/borrow-return-product-management/borrow-return-product-management';
import {BlackListManagement} from './cms/black-list-management/black-list-management';
import {StatisticalManagement} from './cms/statistical-management/statistical-management';
import {NotificationManagement} from './cms/notification-management/notification-management';
import {BannerManagement} from './cms/banner-management/banner-management';
import {Profile} from './reader/profile/profile';
import {ChangePassword} from './reader/change-password/change-password';
import {Product} from './reader/product/product';
import {Category} from './reader/category/category';
import {Author} from './reader/author/author';
import {Publisher} from './reader/publisher/publisher';
import {ProductFavourite} from './reader/product-favourite/product-favourite';
import {Register} from './register/register';
import {ProductCategory} from './reader/product-category/product-category';
import {ProductAuthor} from './reader/product-author/product-author';
import {ProductPublisher} from './reader/product-publisher/product-publisher';
import {ProductDetail} from './reader/product-detail/product-detail';
import {ProductReservation} from './reader/product-reservation/product-reservation';
import {ProductPreReservation} from './reader/product-pre-reservation/product-pre-reservation';
import {ProductReservationManagement} from './cms/product-reservation-management/product-reservation-management';
import {ProductAll} from './reader/product-all/product-all';
import {ProductSearch} from './reader/product-search/product-search';
import {ProfileManagement} from './cms/profile-management/profile-management';
import {PasswordManagement} from './cms/password-management/password-management';
import {ResetPassword} from './reset-password/reset-password';
import {RoleGuard} from './_services/RoleGuard';
import {ReaderGuard} from './_services/ReaderGuard';
import {ChangePasswordAdmin} from './cms/change-password-admin/change-password-admin';
import {ResetPasswordCms} from './reset-password-cms/reset-password-cms';
import {LoginCms} from './login-cms/login-cms'
import {Cms} from './cms/cms';
import {RoleManagement} from './cms/role-management/role-management';
import {RouteManagement} from './cms/route-management/route-management';
import {PermissionManagement} from './cms/permission-management/permission-management';
import {Decentralization} from './cms/decentralization/decentralization';


export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: Login},
  {path: 'login/cms', component:LoginCms},
  {path: 'register', component: Register},
  {path: 'reset-password/reader', component: ResetPassword},
  {path: 'reset-password/cms', component: ResetPasswordCms},

  {
    path: 'cms',
    canActivate: [RoleGuard],
    component: Cms,
    // data: { role: 'admin' },
    children: [
      {path: 'user-management', component: UserManagement},
      {path: 'change-password-admin', component: ChangePasswordAdmin},
      {path: 'statistical-management', component: StatisticalManagement},
      {path: 'banner-management', component: BannerManagement},
      {path: 'reader-management', component: ReaderManagenment},
      {path: 'product-management', component: ProductManagement},
      {path: 'author-management', component: AuthorManagement},
      {path: 'publisher-management', component: PublisherManagement},
      {path: 'category-management', component: CategoryManagement},
      {path: 'borrow-return-product-management', component: BorrowReturnProductManagement},
      {path: 'black-list-management', component: BlackListManagement},
      {path: 'notification-management', component: NotificationManagement},
      {path: 'product-reservation-management', component: ProductReservationManagement},
      {path: 'profile-management', component: ProfileManagement},
      {path: 'password-management', component: PasswordManagement},
      {path: 'role-management', component: RoleManagement},
      {path: 'route-management', component: RouteManagement},
      {path: 'permission-management', component: PermissionManagement},
      {path: 'decentralization', component: Decentralization},



    ]
  },
  {
    path: 'reader',
    component: Reader,
    children: [
      {path: '', component: Product},
      {path: 'profile', component: Profile},
      {path: 'change-password', component: ChangePassword},
      {path: 'categories', component: Category},
      {path: 'authors', component: Author},
      {path: 'publishers', component: Publisher},
      {path: 'product-favourites', component: ProductFavourite},
      {path: 'products-by-category/:id', component: ProductCategory},
      {path: 'products-by-author/:id', component: ProductAuthor},
      {path: 'products-by-publisher/:id', component: ProductPublisher},
      {path: 'product-detail/:hashId', component: ProductDetail},
      {path: 'favourite-product/:token', component: ProductFavourite},
      {path: 'product-reservation', component: ProductReservation},
      {path: 'product-pre-reservation', component: ProductPreReservation},
      {path: 'product-all', component: ProductAll},
      {path: 'product-search', component: ProductSearch},




    ]
  },

  {path: '**', redirectTo: 'login'}

];
