import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule }           from '@angular/material/button';
import { MatListModule }             from '@angular/material/list';
import { EventDialogData }           from '../../event-dialog/event-dialog.component';

export interface EventDetailsData extends EventDialogData {
  date: Date;
  title: string;
  start: Date;
  end: Date;
  meta: {
    _id: string;
    description: string;
    createdBy: string;
    invitedUsers: string[];
  };
  isOwner: boolean;
}

@Component({
  selector: 'app-event-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>Esemény részletei</h2>
    <mat-dialog-content>
      <p><strong>Cím:</strong> {{ data.title }}</p>
      <p><strong>Leírás:</strong> {{ data.meta.description }}</p>
      <p><strong>Kezdés:</strong> {{ data.start | date:'full' }}</p>
      <p><strong>Befejezés:</strong> {{ data.end | date:'full' }}</p>
      <p><strong>Létrehozó:</strong> {{ data.meta.createdBy }}</p>
      <p><strong>Erőforrás:</strong> {{ data.resource || '-' }}</p>
      <p><strong>Kategória:</strong> {{ data.category || '-' }}</p>
      <p><strong>Meghívottak:</strong></p>
      <mat-list>
        <mat-list-item *ngFor="let u of data.meta.invitedUsers">
          {{ u }}
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Bezár</button>
      <button mat-button color="primary" *ngIf="data.isOwner" (click)="edit()">Szerkesztés</button>
      <button mat-button color="warn" *ngIf="data.isOwner" (click)="delete()">Törlés</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content p { margin: 0.5rem 0; }
    mat-list { max-height: 150px; overflow: auto; }
  `]
})
export class EventDetailsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDetailsData
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  edit() {
    this.dialogRef.close({ edit: true });
  }

  delete() {
    this.dialogRef.close({ delete: true });
  }
}
