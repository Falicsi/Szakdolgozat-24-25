import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MatCardModule }     from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';

import {
  InvitationService,
  Invitation
} from '../services/invitation.service';
import { EventDetailsDialogComponent } from '../details/event-details-dialog/event-details-dialog.component';

@Component({
  selector: 'app-invited-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    NavbarComponent
  ],
  templateUrl: './invited-events.component.html',
  styleUrls: ['./invited-events.component.scss']
})
export class InvitedEventsComponent implements OnInit {
  invitations: Invitation[] = [];
  currentUserId = localStorage.getItem('userId') || '';

  constructor(
    private invitationService: InvitationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAcceptedInvitations();
  }

  private loadAcceptedInvitations(): void {
    this.invitationService.getByUser(this.currentUserId).subscribe(allInv => {
      // csak az 'accepted' státuszú meghívások
      this.invitations = allInv.filter(inv => inv.status === 'accepted');
    });
  }

  openDetails(inv: Invitation): void {
    const ev = inv.eventId as any; // a backend populate-olja az eventet
    this.dialog.open(EventDetailsDialogComponent, {
      data: {
        title:        ev.title,
        start:        new Date(ev.start),
        end:          new Date(ev.end),
        meta: {
          _id:           ev._id,
          description:   ev.description,
          createdBy:     ev.createdBy,
          invitedUsers:  ev.invitedUsers
        },
        isOwner: ev.createdBy === localStorage.getItem('username')
      },
      panelClass: 'event-dialog-panel'
    });
  }
}
