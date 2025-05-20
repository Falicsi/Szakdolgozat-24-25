import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { getAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (environment.useFirebase) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        this.router.navigate(['/home']);
        return false;
      }
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult.claims && tokenResult.claims['admin']) {
        return true;
      }
      this.router.navigate(['/home']);
      return false;
    } else {
      const role = this.auth.getRole();
      if (role === 'admin') {
        return true;
      }
      this.router.navigate(['/home']);
      return false;
    }
  }
}
