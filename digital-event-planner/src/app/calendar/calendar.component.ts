import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import {
  CalendarModule,
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import {
  startOfDay,
  addDays,
  endOfWeek,
  subMonths,
  addMonths
} from 'date-fns';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDialogComponent, EventDialogData } from '../event-dialog/event-dialog.component';
import { EventService, EventModel } from '../services/event.service';
import { EventDetailsDialogComponent, EventDetailsData } from '../details/event-details-dialog/event-details-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { InvitationService, Invitation } from '../services/invitation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule, MatDialogModule, MatIcon],
  providers: [DatePipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  CalendarView = CalendarView;
  currentUsername = '';
  canCreateEvent = false;
  invitations: Invitation[] = [];

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private eventService: EventService,
    private invitationService: InvitationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUsername = localStorage.getItem('username') || '';
    const role = localStorage.getItem('roleName');
    this.canCreateEvent = role === 'organizer' || role === 'admin';
    this.loadEvents();
  }

  private loadEvents(): void {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      console.warn('Nincs bejelentkezett felhasználó vagy nincs email!');
      this.events = [];
      return;
    }

    this.eventService.getEvents().subscribe((allEvents: EventModel[]) => {
      this.invitationService.getByUser(currentUserEmail).subscribe((invs: Invitation[]) => {
        const acceptedEventIds = invs
          .filter(inv => inv.status === 'accepted')
          .map(inv => inv.eventId);

        this.events = allEvents
          .filter(ev =>
            ev.createdBy === currentUserEmail ||
            acceptedEventIds.includes((ev._id || ev.id) ?? '')
          )
          .map(ev => ({
            title: ev.title,
            start: new Date(ev.start),
            end:   new Date(ev.end),
            color: { primary: '#1976d2', secondary: '#e3f2fd' },
            meta: {
              _id: ev._id,
              description: ev.description,
              createdBy: ev.createdBy,
              invitedUsers: ev.invitedUsers,
              resource: ev.resource,
              category: ev.category
            }
          }));
      });
    });
  }

  goToPrevious(): void {
    if (this.view === CalendarView.Month) {
      this.viewDate = subMonths(this.viewDate, 1);
    } else {
      this.viewDate = addDays(this.viewDate, this.view === CalendarView.Week ? -7 : -1);
    }
  }

  goToNext(): void {
    if (this.view === CalendarView.Month) {
      this.viewDate = addMonths(this.viewDate, 1);
    } else {
      this.viewDate = addDays(this.viewDate, this.view === CalendarView.Week ? 7 : 1);
    }
  }

  goToToday(): void {
    this.viewDate = new Date();
  }

  endOfWeek(date: Date): Date {
    return endOfWeek(date);
  }

  onDayClick(date: Date): void {
    if (!this.canCreateEvent) return;
    const defaultDate = new Date(date);
    const now = new Date();
    const mins = now.getMinutes();
    let hours = now.getHours();
    let minutes = 0;

    if (mins > 30) {
      hours = hours + 1;
      minutes = 0;
    } else if (mins > 0) {
      minutes = 30;
    }

    defaultDate.setHours(hours, minutes, 0, 0);

    const ref = this.dialog.open<EventDialogComponent, EventDialogData>(
      EventDialogComponent,
      {
        data: { date: defaultDate },
        panelClass: 'event-dialog-panel'
      }
    );

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const newEvent: EventModel = {
        title:        result.title,
        start:        result.start instanceof Date ? result.start.toISOString() : result.start,
        end:          result.end   instanceof Date ? result.end.toISOString()   : result.end,
        description:  result.description,
        createdBy:    result.createdBy,
        invitedUsers: result.invitedUsers,
        resource:     result.resource,
        category:     result.category
      };
      this.eventService.createEvent(newEvent).subscribe({
        next: (res) => {

        },
        error: err => console.error('Event creation failed:', err)
      });
    });
  }

  private createInvitationsForEvent(eventId: string, event: EventModel) {
    
  }

  private updateInvitationsForEvent(eventId: string, updatedEvent: EventModel) {
    this.invitationService.list().subscribe(invs => {
      const eventInvs = invs.filter(inv => inv.eventId === eventId);
      const invitedUserIds = (updatedEvent.invitedUsers || []);

      eventInvs
        .filter(inv => inv.userId !== updatedEvent.createdBy && !invitedUserIds.includes(inv.userId))
        .forEach(inv => this.invitationService.delete(inv._id!).subscribe());

      invitedUserIds
        .filter(uid => !eventInvs.some(inv => inv.userId === uid))
        .forEach(uid => {
          this.invitationService.create({
            eventId,
            userId: uid,
            status: 'pending'
          }).subscribe();
        });

      this.loadEvents();
    });
  }

  private deleteInvitationsForEvent(eventId: string) {
    this.invitationService.list().subscribe(invs => {
      invs.filter(inv => inv.eventId === eventId)
        .forEach(inv => this.invitationService.delete(inv._id!).subscribe());
    });
  }

  private openEditDialog(event: CalendarEvent & { meta?: any }): void {
    const ref = this.dialog.open<EventDialogComponent, EventDialogData>(
      EventDialogComponent,
      {
        data: {
          date:         event.start,
          title:        event.title,
          start:        event.start,
          end:          event.end!,
          description:  event.meta!.description,
          createdBy:    event.meta!.createdBy,
          invitedUsers: event.meta!.invitedUsers,
          resource:     event.meta!.resource || '',
          category:     event.meta!.category || ''
        },
        panelClass: 'event-dialog-panel'
      }
    );

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const updated: EventModel = {
        _id:           event.meta!._id,
        title:         result.title,
        start:         result.start.toISOString(),
        end:           result.end.toISOString(),
        description:   result.description,
        createdBy:     result.createdBy,
        invitedUsers:  result.invitedUsers,
        resource:      result.resource,
        category:      result.category
      };
      this.eventService.updateEvent(updated._id!, updated).subscribe(() => {
        this.updateInvitationsForEvent(updated._id!, updated);
      });
    });
  }

  onEventClick(event: CalendarEvent & { meta?: any }): void {
    const currentUserEmail = localStorage.getItem('email') || '';
    const isOwner = event.meta?.createdBy === currentUserEmail;
    const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
      data: {
        date:  event.start,
        title: event.title,
        start: event.start,
        end:   event.end!,
        meta: {
          _id:           event.meta!._id,
          description:   event.meta!.description,
          createdBy:     event.meta!.createdBy,
          invitedUsers:  event.meta!.invitedUsers
        },
        resource: event.meta!.resource || '',
        category: event.meta!.category || '',
        isOwner
      },
      panelClass: 'event-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.edit && isOwner) {
        this.openEditDialog(event);
      }
      if (res?.delete && isOwner) {
        this.eventService.deleteEvent(event.meta._id).subscribe(() => {
          this.deleteInvitationsForEvent(event.meta._id);
          this.loadEvents();
        });
      }
    });
  }

  get headerTitle(): string {
    if (this.view === CalendarView.Month) {
      return this.datePipe.transform(this.viewDate, 'yyyy. MMMM')!;
    }
    if (this.view === CalendarView.Week) {
      const start = this.datePipe.transform(this.viewDate, 'MMM d')!;
      const end = this.datePipe.transform(
        new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + 6),
        'MMM d, yyyy'
      )!;
      return `${start} – ${end}`;
    }
    return this.datePipe.transform(this.viewDate, 'fullDate')!;
  }

  onTimeSlotClick(date: Date): void {
  this.onDayClick(date);
}

onCalendarTouch(event: TouchEvent) {
  if (event.touches.length === 0 && event.changedTouches.length === 1) {
    const touch = event.changedTouches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.classList.contains('cal-cell')) {
      const dateStr = elem.getAttribute('data-date');
      if (dateStr) {
        this.onDayClick(new Date(dateStr));
      }
    }
  }
}
}
