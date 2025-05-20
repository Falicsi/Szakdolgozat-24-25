import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (environment.useFirebase) {
      const userStr = localStorage.getItem('firebaseUser');
      if (userStr) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    } else {
      if (this.auth.getToken()) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
}
