import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

// Material modulok
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule        } from '@angular/material/input';
import { MatButtonModule       } from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  form!: FormGroup;    // majd ngOnInit-ben inicializáljuk

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [ this.data.title || '', Validators.required ],
      start: [ (this.data.start ?? this.data.date).toISOString().slice(0,16), Validators.required ],
      end:   [ (this.data.end   ?? this.data.date).toISOString().slice(0,16), Validators.required ],
      description:   [ this.data.description || '' ],
      createdBy:     [ this.data.createdBy || '' , Validators.required ],
      invitedUsers:  [ (this.data.invitedUsers || []).join(', ') ]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { title, start, end, description, createdBy, invitedUsers } = this.form.value;
    // bontsuk fel a comma-separated invitedUsers stringet tömbbé:
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
