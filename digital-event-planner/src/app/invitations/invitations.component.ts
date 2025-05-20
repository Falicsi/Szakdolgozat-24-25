// src/app/invitations/invitations.component.ts
import { Component, OnInit }   from '@angular/core';
import { CommonModule }         from '@angular/common';
import { MatTableModule }       from '@angular/material/table';
import { MatButtonModule }      from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { InvitationService, Invitation } from '../services/invitation.service';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NavbarComponent
  ],
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  invitations: Invitation[] = [];
  displayedColumns = ['event', 'status', 'actions'];
  currentUserId = localStorage.getItem('userId') || '';

  constructor(private invService: InvitationService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.invService.getByUser(this.currentUserId).subscribe(inv => {
      // Csak azok, ahol nem mi vagyunk a szervezők (meghívottként vagyunk jelen)
      this.invitations = inv.filter(i =>
        i.userId === this.currentUserId &&
        i.status !== 'accepted'
      );
    });
  }

  accept(inv: Invitation) {
    this.invService.updateStatus(inv._id!, 'accepted')
      .subscribe(() => this.load());
  }

  decline(inv: Invitation) {
    this.invService.updateStatus(inv._id!, 'declined')
      .subscribe(() => this.load());
  }
}
