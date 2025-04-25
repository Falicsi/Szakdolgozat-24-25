// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private get authHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getEvents(): Observable<EventModel[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<EventModel[]>(this.apiUrl, { headers });
  }

  createEvent(e: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(
      this.apiUrl,
      e,
      this.auth.authHeaders
    );
  }

  updateEvent(e: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(
      `${this.apiUrl}/${e._id}`,
      e,
      this.auth.authHeaders
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.auth.authHeaders
    );
  }
}
