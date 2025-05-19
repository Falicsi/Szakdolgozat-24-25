// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_BASE = environment.useFirebase ? `${environment.functionsUrl}/${environment.functionsRegion}-${environment.firebaseConfig.projectId}/api`: environment.apiBaseUrl;

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

    /** Lekéri az összes kategóriát */
  listCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/categories`);
  }

  /** Lekéri az összes erőforrást */
  listResources(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/resources`);
  }

  listEvents(): Observable<any[]> {
    return this.getEvents();
  }

  listEventsWithNames(): Observable<any[]> {
    return forkJoin({
      events:    this.listEvents(),
      categories:this.listCategories(),
      resources: this.listResources()
    }).pipe(
      map(({ events, categories, resources }) =>
        events.map((ev: any) => ({
          ...ev,
          categoryName: categories.find(c => c.id === ev.categoryId)?.name || '—',
          resourceNames: (ev.resources||[])
            .map((rid: string) => resources.find(r => r.id === rid)?.name || '—')
        }))
      )
    );
  }
}
