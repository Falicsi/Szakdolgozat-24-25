// src/app/invitations/invitations.component.ts
import { Component, OnInit }   from '@angular/core';
import { CommonModule }         from '@angular/common';
import { MatTableModule }       from '@angular/material/table';
import { MatButtonModule }      from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { InvitationService, Invitation } from '../services/invitation.service';
import { AuthService } from '../services/auth.service';
import { EventService, EventModel } from '../services/event.service';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NavbarComponent
  ],
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  invitations: (Invitation & { eventTitle?: string })[] = [];
  displayedColumns = ['event', 'status', 'actions'];

  constructor(
    private invService: InvitationService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) return;

    this.eventService.getEvents().subscribe((events: EventModel[]) => {
      this.invService.getByUser(currentUserEmail).subscribe(invs => {
        this.invitations = invs
          .filter(inv => inv.status === 'pending')
          .map(inv => ({
            ...inv,
            eventTitle: events.find(ev => (ev._id || ev.id) === inv.eventId)?.title || '—'
          }));
      });
    });
  }

  accept(inv: Invitation) {
    const id = inv._id || inv.id;
    if (!id) return;
    this.invService.updateStatus(id, 'accepted')
      .subscribe(() => this.ngOnInit());
  }

  decline(inv: Invitation) {
    const id = inv._id || inv.id;
    if (!id) return;
    this.invService.updateStatus(id, 'declined')
      .subscribe(() => this.ngOnInit());
  }
}
