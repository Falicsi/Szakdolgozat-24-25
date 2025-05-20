// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService, EventItem } from './api.service';

export interface EventModel {
  _id?: string;
  title: string;
  description?: string;
  start: string;
  end:   string;
  createdBy?: string;
  invitedUsers?: string[];
  resource?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private api: ApiService) {}

  getEvents(): Observable<EventItem[]> {
    return this.api.listEvents();
  }

  getEvent(id: string): Observable<EventItem> {
    return this.api.getEvent(id);
  }

  createEvent(event: Omit<EventItem, 'id'>): Observable<{ id: string }> {
    return this.api.createEvent(event);
  }

  updateEvent(id: string, event: Partial<EventItem>): Observable<any> {
    return this.api.updateEvent(id, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.api.deleteEvent(id);
  }
}
