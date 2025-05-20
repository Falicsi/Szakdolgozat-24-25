import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (environment.useFirebase) {
      const userStr = localStorage.getItem('firebaseUser');
      if (userStr) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    } else {
      if (this.auth.getToken()) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }
  }
}