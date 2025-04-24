// src/app/admin/admin.component.ts
import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterOutlet }   from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {}
