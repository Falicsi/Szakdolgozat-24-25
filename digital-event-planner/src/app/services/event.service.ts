// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  getEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.apiUrl, this.getAuthHeaders());
  }

  createEvent(e: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(this.apiUrl, e, this.getAuthHeaders());
  }

  updateEvent(e: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.apiUrl}/${e._id}`, e, this.getAuthHeaders());
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
