import { Component, HostListener } from '@angular/core';
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
  menuOpen = false;
  isMobile = window.innerWidth <= 600;

  constructor(private auth: AuthService) {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 600;
    if (!this.isMobile) this.menuOpen = false;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    document.body.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  get isLoggedIn(): boolean {
    if (environment.useFirebase) {
      return !!localStorage.getItem('firebaseUser');
    }
    return !!this.auth.getToken();
  }

  get isAdmin(): boolean {
    if (environment.useFirebase) {
      return localStorage.getItem('firebaseRole') === 'admin';
    }
    return this.auth.getRole() === 'admin';
  }

  get isOrganizer(): boolean {
    return this.auth.getRole() === 'organizer';
  }

  get isUser(): boolean {
    return this.auth.getRole() === 'user';
  }
}
