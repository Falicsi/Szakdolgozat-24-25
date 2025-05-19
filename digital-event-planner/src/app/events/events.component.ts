import { Component, OnInit } from '@angular/core';
import { EventService, EventModel } from '../services/event.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: EventModel[] = [];
  currentUserEmail = localStorage.getItem('email') || '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(allEvents => {
      this.events = allEvents.filter(e => e.createdBy === this.currentUserEmail);
    });
  }
}
