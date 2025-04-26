import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.getToken()) {
      // nem bejelentkezett → továbbengedjük
      return true;
    }
    // be van jelentkezve → ne lássa a login/registert, irány home
    this.router.navigate(['/home']);
    return false;
  }
}
