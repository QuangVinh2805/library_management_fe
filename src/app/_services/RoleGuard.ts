import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role')?.toLowerCase();

    // ===== CHƯA LOGIN =====
    if (!token || !role) {
      this.router.navigate(['/login/cms']);
      return false;
    }

    // ===== CHẶN READER =====
    if (role === 'reader') {
      this.router.navigate(['/login']);
      return false;
    }

    // ===== ADMIN / LIBRARIAN =====
    return true;
  }
}
