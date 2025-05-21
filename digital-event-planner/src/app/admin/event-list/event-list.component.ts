// src/app/admin/event-list/event-list.component.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { MatTableModule }       from '@angular/material/table';
import { MatButtonModule }      from '@angular/material/button';
import { EventService, EventModel } from '../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from '../../event-dialog/event-dialog.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: EventModel[] = [];
  displayedColumns = ['_id','title','start','end','actions'];

  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(e => this.events = e);
  }

  delete(eventId: string) {
    if (!confirm('Biztosan törlöd ezt az eseményt?')) return;
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.events = this.events.filter(e => (e._id || (e as any).id) !== eventId);
    });
  }

  edit(e: EventModel) {
    const ref = this.dialog.open(EventDialogComponent, {
      data: {
        date:        new Date(e.start),
        title:       e.title,
        start:       new Date(e.start),
        end:         new Date(e.end),
        description: e.description,
        createdBy:   e.createdBy,
        invitedUsers:e.invitedUsers,
        resource:    e.resource,
        category:    e.category 
      },
      panelClass: 'event-dialog-panel'
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const updated: EventModel = { 
        _id: e._id,
        id: e.id,
        title: result.title,
        start: result.start.toISOString(),
        end: result.end.toISOString(),
        description: result.description,
        createdBy: result.createdBy,
        invitedUsers: result.invitedUsers,
        resource:    result.resource,
        category:    result.category 
      };
      const eventId = e._id || e.id;
      if (!eventId) return; // <-- Hibakezelés!
      this.eventService.updateEvent(eventId, updated).subscribe(saved => {
        this.events = this.events.map(x => (x._id || x.id) === (saved._id || saved.id) ? saved : x);
      });
    });
  }
  
}
