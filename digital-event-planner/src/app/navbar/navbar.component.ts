import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../services/auth.service';

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
    return !!this.auth.getToken();
  }

  /** Igaz, ha a bejelentkezett user role-ja 'admin' */
  get isAdmin(): boolean {
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
