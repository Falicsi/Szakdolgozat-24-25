import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.auth.getRole();    // implementáld, hogy a JWT-ből kiolvassa a roleName-t
    if (role === 'admin') {
      return true;
    }
    // nem admin, irány a home vagy login
    this.router.navigate(['/home']);
    return false;
  }
}
