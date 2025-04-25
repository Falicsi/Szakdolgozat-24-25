// src/app/services/invitation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Invitation {
  _id:       string;
  eventId:   any;
  userId:    string;
  status:    'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private apiUrl = 'http://localhost:3000/api/invitations';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getByUser(userId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.apiUrl}?userId=${userId}`, this.auth.authHeaders);
  }

  getByEvent(eventId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(
      `${this.apiUrl}?eventId=${eventId}`,
      this.auth.authHeaders
    );
  }

  create(eventId: string, userId: string): Observable<Invitation> {
    return this.http.post<Invitation>(
      this.apiUrl,
      { eventId, userId },
      this.auth.authHeaders
    );
  }

  updateStatus(id: string, status: 'pending'|'accepted'|'declined'): Observable<Invitation> {
    return this.http.patch<Invitation>(
      `${this.apiUrl}/${id}`,
      { status },
      this.auth.authHeaders
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.auth.authHeaders
    );
  }
}
