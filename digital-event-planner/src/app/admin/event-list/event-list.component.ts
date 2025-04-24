// src/app/admin/event-list/event-list.component.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { MatTableModule }       from '@angular/material/table';
import { MatButtonModule }      from '@angular/material/button';
import { EventService, EventModel } from '../../services/event.service';

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

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(e => this.events = e);
  }

  delete(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.events = this.events.filter(e => e._id !== eventId);
    });
  }
}
