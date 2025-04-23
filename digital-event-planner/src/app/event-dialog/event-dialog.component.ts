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
    // 2. lépés: form-ini az ngOnInit-ben
    this.form = this.fb.group({
      title: ['', Validators.required],
      start: [
        // biztosan string, szóval kinyerjük az ISO-ból:
        this.data.date.toISOString().slice(0, 16),
        Validators.required
      ],
      end: [
        this.data.date.toISOString().slice(0, 16),
        Validators.required
      ],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { title, start, end } = this.form.value;
    // 3. lépés: ellenőrizzük, hogy start/end definiált
    if (start && end) {
      this.dialogRef.close({
        title,
        start: new Date(start),
        end:   new Date(end)
      });
    }
  }
}
