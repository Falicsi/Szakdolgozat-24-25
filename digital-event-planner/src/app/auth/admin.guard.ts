import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private afAuth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (environment.useFirebase) {
      const user = this.afAuth.currentUser;
      if (!user) {
        this.router.navigate(['/home']);
        return false;
      }
      const tokenResult = await (await user).getIdTokenResult();
      if (tokenResult.claims && tokenResult.claims['admin']) {
        return true;
      }
      const snap = await getDoc(doc(this.firestore, 'users', user.uid));
      const data = snap.data() as any;
      if (data && Array.isArray(data.roles) && data.roles.includes('admin')) {
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
