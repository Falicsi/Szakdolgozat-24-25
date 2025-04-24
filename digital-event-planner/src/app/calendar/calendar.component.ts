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

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule, MatDialogModule, EventDialogComponent, EventDetailsDialogComponent],
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
  constructor(private datePipe: DatePipe, private dialog: MatDialog, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      // a backendről kapott EventModel[] tömböt tároljuk
      this.events = events.map(e => ({
        start: new Date(e.start),
        end:   e.end ? new Date(e.end) : undefined,
        title: e.title,
        color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        meta: { _id: e._id, description: e.description, createdBy: e.createdBy, invitedUsers: e.invitedUsers }
      }));
    });
    this.currentUsername = localStorage.getItem('username') || '';
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getEvents().subscribe((es: EventModel[]) => {
      this.events = es.map(e => ({
        start: new Date(e.start),
        end:   e.end ? new Date(e.end) : undefined,
        title: e.title,
        color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        meta: {
          _id:           e._id!,
          description:   e.description || '',
          createdBy:     e.createdBy || '',
          invitedUsers:  e.invitedUsers || []
        }
      }));
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
        start:        result.start.toISOString(),
        end:          result.end  .toISOString(),
        description:  result.description,
        createdBy:    result.createdBy,
        invitedUsers: result.invitedUsers
      };
      this.eventService.createEvent(newEvent).subscribe(() => this.loadEvents());
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
        isOwner
      },
      panelClass: 'event-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.edit && isOwner) {
        this.openEditDialog(event);
      }
      if (res?.delete && isOwner) {
        this.eventService.deleteEvent(event.meta._id).subscribe(() => this.loadEvents());
      }
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
          invitedUsers: event.meta!.invitedUsers
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
        invitedUsers:  result.invitedUsers
      };
      this.eventService.updateEvent(updated).subscribe(() => this.loadEvents());
    });
  }

  onTimeSlotClick(date: Date): void {
    this.onDayClick(date);
  }

  get headerTitle(): string {
    if (this.view === CalendarView.Month) {
      return this.datePipe.transform(this.viewDate, 'MMMM yyyy')!;
    }
    if (this.view === CalendarView.Week) {
      const start = this.datePipe.transform(this.viewDate, 'MMM d');
      const end   = this.datePipe.transform(this.endOfWeek(this.viewDate), 'MMM d, yyyy');
      return `${start} – ${end}`;
    }
    // day view
    return this.datePipe.transform(this.viewDate, 'fullDate')!;
  }

}
