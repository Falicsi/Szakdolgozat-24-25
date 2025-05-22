import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {

  }
}