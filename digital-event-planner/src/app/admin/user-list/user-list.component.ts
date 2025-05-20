// src/app/admin/user-list/user-list.component.ts
import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import { MatTableModule }           from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { AuthService }              from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent, UserDialogData } from '../user-edit-dialog/user-edit-dialog.component';


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
  users: any[] = [];
  currentUserId: string = '';
  displayedColumns = ['id','username','email','actions']; // _id helyett id

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('userId') || '';
    this.authService.getAllUsers().subscribe(u => {
      this.users = u;
      // Logoljuk az összes usert
      console.log('User-listában kapott userek:', this.users);
      // Ha csak az első usert akarod:
      if (this.users.length) {
        console.log('Első user:', this.users[0]);
      }
    });
  }

  edit(u: any) {
    const ref = this.dialog.open<UserEditDialogComponent, UserDialogData>(
      UserEditDialogComponent,
      { data: { id: u._id || u.id, username: u.username, email: u.email } }
    );
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.authService.updateUser(result).subscribe(updated => {
        this.users = this.users.map(x => (x._id || x.id) === (updated._id || updated.id) ? updated : x);
      });
    });
  }

  delete(userId: string): void {
    this.authService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(u => (u._id || u.id) !== userId);
    });
  }
}
