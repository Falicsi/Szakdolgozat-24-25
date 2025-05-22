import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Invitation } from './api.service';

export type { Invitation } from './api.service';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  constructor(private api: ApiService) {}

  list(): Observable<Invitation[]> {
    return this.api.listInvitations();
  }

  getById(id: string): Observable<Invitation> {
    return this.api.getInvitation(id);
  }

  create(inv: Omit<Invitation, 'id' | '_id'>): Observable<{ id: string }> {
    return this.api.createInvitation(inv);
  }

  update(id: string, inv: Partial<Invitation>): Observable<any> {
    return this.api.updateInvitation(id, inv);
  }

  updateStatus(id: string, status: 'pending' | 'accepted' | 'declined'): Observable<any> {
    return this.api.updateInvitation(id, { status });
  }

  delete(id: string): Observable<any> {
    return this.api.deleteInvitation(id);
  }

  getByUser(userId: string): Observable<Invitation[]> {
    return this.api.getInvitationsByUserId(userId);
  }
}
