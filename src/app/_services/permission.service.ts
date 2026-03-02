import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {

  /** CMS ROUTE */
  private routes = new Set<string>();

  /** API PERMISSION */
  private permissions = new Set<string>();

  permissionLoaded$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // 🔥 TỰ PHỤC HỒI QUYỀN KHI F5
    const data = localStorage.getItem('routeLinks');
    if (data) {
      this.loadRoutes();
      this.loadApiPermissions();
    }
  }

  /* ===================== ROUTE ===================== */

  loadRoutes() {
    this.routes.clear();
    const data = localStorage.getItem('routeLinks');
    if (!data) return;

    JSON.parse(data).forEach((r: any) => {
      if (r.route) {
        this.routes.add(
          r.route.replace(window.location.origin, '')
        );
      }
    });

    console.log('CMS ROUTES:', [...this.routes]);
  }

  hasRoute(route: string): boolean {
    return this.routes.has(route);
  }

  /* ===================== API ===================== */

  loadApiPermissions() {
    this.permissions.clear();
    const data = localStorage.getItem('routeLinks');
    if (!data) {
      this.permissionLoaded$.next(false);
      return;
    }

    JSON.parse(data).forEach((r: any) => {
      if (r.endPoint && r.method) {
        this.permissions.add(
          `${r.method.toUpperCase()}::${r.endPoint}`
        );
      }
    });

    console.log('API PERMISSIONS:', [...this.permissions]);
    this.permissionLoaded$.next(true);
  }

  hasPermission(endpoint: string, method: string): boolean {
    return this.permissions.has(
      `${method.toUpperCase()}::${endpoint}`
    );
  }

  /* ===================== RESET ===================== */

  clear() {
    this.routes.clear();
    this.permissions.clear();
    this.permissionLoaded$.next(false);
  }
}
