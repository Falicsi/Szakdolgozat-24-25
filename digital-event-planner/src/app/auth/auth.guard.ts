import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (environment.useFirebase) {
      // Firebase Auth ellenőrzés (később async is lehet)
      return !!localStorage.getItem('firebaseUser');
    } else {
      // JWT token ellenőrzés
      if (this.auth.getToken()) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
}
