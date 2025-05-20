import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, CalendarComponent, NavbarComponent, MatIconModule]
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  email: string = '';
  username: string = '';
  userId: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (environment.useFirebase) {
      this.isAuthenticated = !!localStorage.getItem('firebaseUser');
      if (this.isAuthenticated) {
        const user = JSON.parse(localStorage.getItem('firebaseUser')!);
        this.email = user.email || '';
        this.username = user.username || '';
        this.userId = user.uid || '';
      }
    } else {
      this.isAuthenticated = !!localStorage.getItem('token');
      if (this.isAuthenticated) {
        this.email = localStorage.getItem('email') || '';
        this.username = localStorage.getItem('username') || '';
        this.userId = localStorage.getItem('userId') || '';
      }
    }
  }

  async logout() {
    if (environment.useFirebase) {
      await signOut(this.authService['auth']); // vagy this.authService.auth, ha public
      localStorage.removeItem('firebaseUser');
      localStorage.removeItem('firebaseRole');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
    }
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
