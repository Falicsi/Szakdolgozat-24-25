import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, CalendarComponent]
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('token');
    if (this.isAuthenticated) {
      this.email = localStorage.getItem('email') || '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
