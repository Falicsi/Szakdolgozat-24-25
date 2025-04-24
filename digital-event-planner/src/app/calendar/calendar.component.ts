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
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule, MatDialogModule, EventDialogComponent],
  providers: [DatePipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  CalendarView = CalendarView; // a template-hez
  constructor(private datePipe: DatePipe, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.events = [
      { start: startOfDay(new Date()), title: 'Mai példa', color: { primary: '#1e90ff', secondary: '#D1E8FF' } },
      { start: addDays(startOfDay(new Date()), 1), title: 'Holnapi példa', color: { primary: '#e3bc08', secondary: '#FDF1BA' } }
    ];
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
    const ref = this.dialog.open(EventDialogComponent, {
      data: { date },
      panelClass: 'event-dialog-panel',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.events = [
          ...this.events,
          {
            start: result.start,
            end:   result.end,
            title: result.title,
            color: { primary: '#ad2121', secondary: '#FAE3E3' }
          }
        ];
      }
    });
  }

  onEventClick(event: CalendarEvent): void {
    const ref = this.dialog.open(EventDialogComponent, {
      data: {
        date:         event.start,
        title:        event.title,
        start:        event.start,
        end:          event.end,
        description:  (event as any).description,
        createdBy:    (event as any).createdBy,
        invitedUsers: (event as any).invitedUsers
      },
      panelClass: 'event-dialog-panel'   // ← és ide
    });

    ref.afterClosed().subscribe(/* … */);
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
