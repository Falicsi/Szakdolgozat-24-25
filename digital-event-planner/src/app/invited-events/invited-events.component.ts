import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MatCardModule }     from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';

import {
  InvitationService,
  Invitation
} from '../services/invitation.service';
import { EventService, EventModel } from '../services/event.service';
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
  ownEvents: EventModel[] = [];
  allEvents: any[] = [];
  currentUserId = localStorage.getItem('userId') || '';
  currentUserEmail = localStorage.getItem('email') || '';

  constructor(
    private invitationService: InvitationService,
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  private loadAllEvents(): void {
    // Lekérjük a saját szervezésű eseményeket
    this.eventService.getEvents().subscribe(events => {
      this.ownEvents = events.filter(e => e.createdBy === this.currentUserEmail);

      // Lekérjük az elfogadott meghívásokat
      this.invitationService.getByUser(this.currentUserId).subscribe(invs => {
        const acceptedInvs = invs.filter(inv => inv.status === 'accepted' && inv.eventId);

        // Kinyerjük az eseményeket az invitation-ökből
        const invitedEvents = acceptedInvs.map(inv => inv.eventId);

        // Összefésüljük a kettőt, duplikáció nélkül (azonos _id alapján)
        const all = [...this.ownEvents, ...invitedEvents]
          .filter((event, index, self) =>
            event && self.findIndex(e => e._id === event._id) === index
          );

        this.allEvents = all;
      });
    });
  }

  openDetails(event: any): void {
    this.dialog.open(EventDetailsDialogComponent, {
      data: {
        title:        event.title,
        start:        new Date(event.start),
        end:          new Date(event.end),
        meta: {
          _id:           event._id,
          description:   event.description,
          createdBy:     event.createdBy,
          invitedUsers:  event.invitedUsers
        },
        isOwner: event.createdBy === this.currentUserEmail
      },
      panelClass: 'event-dialog-panel'
    });
  }
}
