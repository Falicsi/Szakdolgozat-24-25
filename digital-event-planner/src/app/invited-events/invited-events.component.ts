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
import { ResourceService, Resource } from '../services/resource.service';
import { CategoryService, Category } from '../services/category.service';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

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

  resources: Resource[] = [];
  categories: Category[] = [];

  constructor(
    private invitationService: InvitationService,
    private eventService: EventService,
    private resourceService: ResourceService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(res => this.resources = res);
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
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
    const resourceName = this.resources.find(r => r._id === event.resource)?.name || '-';
    const categoryName = this.categories.find(c => c._id === event.category)?.name || '-';

    const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
      data: {
        title:        event.title,
        start:        new Date(event.start),
        end:          new Date(event.end),
        resource:     resourceName,
        category:     categoryName,
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

    dialogRef.afterClosed().subscribe(result => {
      if (result?.edit) {
        // Szerkesztő dialog megnyitása
        const editRef = this.dialog.open(EventDialogComponent, {
          data: {
            date:        new Date(event.start),
            title:       event.title,
            start:       new Date(event.start),
            end:         new Date(event.end),
            description: event.description,
            createdBy:   event.createdBy,
            invitedUsers:event.invitedUsers,
            resource:    event.resource,
            category:    event.category
          },
          panelClass: 'event-dialog-panel'
        });
        editRef.afterClosed().subscribe(editResult => {
          if (editResult && event._id) {
            this.eventService.updateEvent({
              _id: event._id,
              ...editResult
            }).subscribe(() => this.loadAllEvents());
          }
        });
      }
      if (result?.delete) {
        this.eventService.deleteEvent(event._id).subscribe(() => {
          this.loadAllEvents();
        });
      }
    });
  }
}
