import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    MatBadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  theme = localStorage.getItem('theme') || 'dark';
  unreadCount = 0;

  constructor(private auth: AuthService) {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  /** Igaz, ha van érvényes JWT, azaz be van jelentkezve a user */
  get isLoggedIn(): boolean {
    if (environment.useFirebase) {
      return !!localStorage.getItem('firebaseUser');
    }
    return !!this.auth.getToken();
  }

  /** Igaz, ha a bejelentkezett user role-ja 'admin' */
  get isAdmin(): boolean {
    if (environment.useFirebase) {
      // Firebase user role-t a Firestore-ból kell lekérni, vagy localStorage-ben tárolni
      return localStorage.getItem('firebaseRole') === 'admin';
    }
    return this.auth.getRole() === 'admin';
  }

  /** Igaz, ha a bejelentkezett user role-ja 'organizer' */
  get isOrganizer(): boolean {
    return this.auth.getRole() === 'organizer';
  }

  /** Igaz, ha a bejelentkezett user role-ja 'user' */
  get isUser(): boolean {
    return this.auth.getRole() === 'user';
  }
}
