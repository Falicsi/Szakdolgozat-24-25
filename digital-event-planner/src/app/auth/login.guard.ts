// src/app/auth/login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // már bejelentkezett → home-ra dobjuk
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}