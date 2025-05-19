// src/app/admin/admin.component.ts
import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterOutlet, RouterModule }   from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService, User, Role, Category, Resource, EventItem, Invitation } from '../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent {}
