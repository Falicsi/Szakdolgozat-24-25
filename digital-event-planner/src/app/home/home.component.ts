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
import { ProfileService, ProfileModel } from '../services/profile.service'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
  avatarUrl: string = 'assets/default-avatar.png'; // <-- alapértelmezett

  constructor(
    private authService: AuthService,
    private profileService: ProfileService, // <-- injektáld!
    private router: Router
  ) {}

  ngOnInit(): void {
    if (environment.useFirebase) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        this.isAuthenticated = !!user;
        if (user) {
          localStorage.setItem('userId', user.uid);
          this.email = user.email || '';
          this.userId = user.uid;
          this.profileService.getProfile().subscribe(profile => {
          this.avatarUrl = profile?.avatarUrl
            ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://192.168.0.100:3000${profile.avatarUrl}`)
            : 'assets/default-avatar.png';
            this.username = profile?.fullName || user.displayName || '';
          });
        } else {
          // Kijelentkezéskor töröljük a localStorage-t is!
          localStorage.removeItem('firebaseUser');
          localStorage.removeItem('firebaseRole');
          localStorage.removeItem('email');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          this.email = '';
          this.username = '';
          this.userId = '';
          this.avatarUrl = 'assets/default-avatar.png';
        }
      });
    } else {
      this.isAuthenticated = !!localStorage.getItem('token');
      if (this.isAuthenticated) {
        this.email = localStorage.getItem('email') || '';
        this.username = localStorage.getItem('username') || '';
        this.userId = localStorage.getItem('userId') || '';
        this.profileService.getProfile().subscribe(profile => {
          this.avatarUrl = profile?.avatarUrl
            ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://192.168.0.100:3000${profile.avatarUrl}`)
            : 'assets/default-avatar.png';
          this.username = profile?.fullName || this.username;
        });
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
