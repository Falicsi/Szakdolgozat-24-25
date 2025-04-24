import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

export interface EventDialogData {
  date: Date;
  title?: string;
  start?: Date;
  end?: Date;
  description?: string;
  createdBy?: string;
  invitedUsers?: string[];
}


@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  form!: FormGroup;

  allUsers: string[] = [];
  filteredUsers!: Observable<string[]>;
  invited: string[] = [];
  userCtrl = new FormControl('');

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData,
    private authService: AuthService
  ) {}

  private toLocalInput(d: Date): string {
    const tz = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - tz);
    return local.toISOString().slice(0,16);
  }

  ngOnInit() {
      this.invited = this.data.invitedUsers ? [...this.data.invitedUsers] : [];

      this.authService.getAllUsers().subscribe(users => {
        this.allUsers = users.map(u => u.email);
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
          startWith(null),
          map((val: string | null) => val ? this._filter(val) : this.allUsers.slice())
        );
      });
        
    const startDate = this.data.start ?? this.data.date;
    const endDate   = this.data.end ?? new Date(startDate.getTime() + 60*60000);

    this.form = this.fb.group({
      title:        [this.data.title || '', Validators.required],
      start:        [this.toLocalInput(startDate), Validators.required],
      end:          [this.toLocalInput(endDate),   Validators.required],
      description:  [this.data.description || ''],
      createdBy:    [this.data.createdBy  || '', Validators.required],
      invitedUsers: [(this.data.invitedUsers || []).join(', ')]
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUsers.filter(email =>
      email.toLowerCase().includes(filterValue) &&
      !this.invited.includes(email)
    );
  }

  addUserFromInput(event: any): void {
    const input = event.input;
    const value = event.value;

    // Ha az enter gombot ütöttük, és a value email a listában van
    if ((value || '').trim() && this.allUsers.includes(value.trim())) {
      this.invited.push(value.trim());
    }
    // töröljük az inputot
    if (input) {
      input.value = '';
    }
    this.userCtrl.setValue(null);
  }

  removeUser(email: string): void {
    this.invited = this.invited.filter(u => u !== email);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.invited.includes(event.option.viewValue)) {
      this.invited.push(event.option.viewValue);
    }
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { title, start, end, description, createdBy, invitedUsers } = this.form.value;
    const invitedArray = invitedUsers
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    this.dialogRef.close({
      title,
      start: new Date(start),
      end:   new Date(end),
      description,
      createdBy,
      invitedUsers: invitedArray
    });
  }

  onDelete() {
    this.dialogRef.close({ delete: true });
  }
}
