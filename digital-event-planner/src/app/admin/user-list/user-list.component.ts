// src/app/admin/user-list/user-list.component.ts
import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import { MatTableModule }           from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { AuthService }              from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];                // legyen definiálva
  displayedColumns = ['_id','username','email','actions'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(u => this.users = u);
  }

  delete(userId: string): void {    // legyen metódus
    this.authService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(u => u._id !== userId);
    });
  }
}
