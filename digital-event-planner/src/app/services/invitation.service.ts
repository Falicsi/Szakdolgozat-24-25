// src/app/services/invitation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Invitation {
  _id:        string;
  eventId:    any;    // a backend populate-olja Event adatokkal
  userId:     string;
  status:     'pending' | 'accepted' | 'declined';
  createdAt:  string;
  updatedAt:  string;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private apiUrl = 'http://localhost:3000/api/invitations';

  constructor(private http: HttpClient) {}

  private get authHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  /** A bejelentkezett user meghívásai */
  getByUser(userId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(
      `${this.apiUrl}?userId=${userId}`,
      this.authHeaders
    );
  }

  /** Egy esemény összes meghívása */
  getByEvent(eventId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(
      `${this.apiUrl}?eventId=${eventId}`,
      this.authHeaders
    );
  }

  /** Új meghívás küldése */
  create(eventId: string, userId: string): Observable<Invitation> {
    return this.http.post<Invitation>(
      this.apiUrl,
      { eventId, userId },
      this.authHeaders
    );
  }

  /** Meghívás státuszának módosítása */
  updateStatus(id: string, status: 'accepted' | 'declined' | 'pending')
    : Observable<Invitation> {
    return this.http.patch<Invitation>(
      `${this.apiUrl}/${id}`,
      { status },
      this.authHeaders
    );
  }

  /** Meghívás törlése */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.authHeaders
    );
  }
}
