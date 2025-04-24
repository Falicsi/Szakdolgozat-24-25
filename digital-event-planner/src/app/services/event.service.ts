// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventModel {
  _id?: string;
  title: string;
  description?: string;
  start: string;           // ISO dátum string
  end:   string;
  createdBy?: string;
  invitedUsers?: string[];
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.apiUrl);
  }

  createEvent(e: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(this.apiUrl, e);
  }

  updateEvent(e: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.apiUrl}/${e._id}`, e);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
