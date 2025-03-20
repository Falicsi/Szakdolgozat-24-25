import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule]
})
export class CalendarComponent implements OnInit {
  events = [
    { title: 'Digital Event Planning - Meeting', date: '2025-02-01' },
    { title: 'Project Presentation', date: '2025-02-10' },
    { title: 'Team Building', date: '2025-02-25' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getEventsForDay(day: number) {
    const monthYear = '2025-02';
    return this.events.filter(event => event.date === `${monthYear}-${day.toString().padStart(2, '0')}`);
  }

  addEvent() {
    alert('Esemény hozzáadva!');
  }
}
