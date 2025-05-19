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
export class AdminComponent {
  users: User[] = [];
  roles: Role[] = [];
  categories: Category[] = [];
  resources: Resource[] = [];
  events: EventItem[] = [];
  invitations: Invitation[] = [];

  constructor(private apiService: ApiService) {
    this.loadAll();
  }

  loadAll() {
    this.apiService.listUsers().subscribe(users => this.users = users);
    this.apiService.listRoles().subscribe(roles => this.roles = roles);
    this.apiService.listCategories().subscribe(categories => this.categories = categories);
    this.apiService.listResources().subscribe(resources => this.resources = resources);
    this.apiService.listEvents().subscribe(events => this.events = events);
    this.apiService.listInvitations().subscribe(invitations => this.invitations = invitations);
  }

  // Példák CRUD műveletekre:
  deleteUser(id: string) {
    this.apiService.deleteUser(id).subscribe(() => this.loadAll());
  }
  deleteRole(id: string) {
    this.apiService.deleteRole(id).subscribe(() => this.loadAll());
  }
  deleteCategory(id: string) {
    this.apiService.deleteCategory(id).subscribe(() => this.loadAll());
  }
  deleteResource(id: string) {
    this.apiService.deleteResource(id).subscribe(() => this.loadAll());
  }
  deleteEvent(id: string) {
    this.apiService.deleteEvent(id).subscribe(() => this.loadAll());
  }
  deleteInvitation(id: string) {
    this.apiService.deleteInvitation(id).subscribe(() => this.loadAll());
  }
}
