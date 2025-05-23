import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Az email és a jelszó megadása kötelező!';
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Hibás email formátum!';
      return;
    }
    this.authService.login(this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = error?.error?.message || 'Hibás email vagy jelszó!';
      }
    );
  }
}