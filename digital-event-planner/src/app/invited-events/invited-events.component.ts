import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { MatCardModule }      from '@angular/material/card';
import { MatDialog, MatDialogModule }    from '@angular/material/dialog';
import { EventService, EventModel } from '../services/event.service';
import { EventDetailsDialogComponent } from '../details/event-details-dialog/event-details-dialog.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-invited-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    EventDetailsDialogComponent,
    NavbarComponent
  ],
  providers: [MatDialog],
  templateUrl: './invited-events.component.html',
  styleUrls: ['./invited-events.component.scss']
})
export class InvitedEventsComponent implements OnInit {
  invitedEvents: EventModel[] = [];
  currentUserEmail = localStorage.getItem('email') || '';

  constructor(
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.invitedEvents = events.filter(e =>
        e.invitedUsers?.includes(this.currentUserEmail)
      );
    });
  }

  openDetails(event: EventModel) {
    this.dialog.open(EventDetailsDialogComponent, {
      data: {
        title: event.title,
        start: new Date(event.start),
        end:   new Date(event.end),
        meta: {
          _id:           event._id!,
          description:   event.description!,
          createdBy:     event.createdBy!,
          invitedUsers:  event.invitedUsers!
        },
        isOwner: event.createdBy === this.currentUserEmail
      },
      panelClass: 'event-dialog-panel'
    });
  }
}
