import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ResourceService, Resource } from '../../services/resource.service';

@Component({
  selector: 'app-resource-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './resource-edit-dialog.component.html',
  styleUrls: ['./resource-edit-dialog.component.scss']
})
export class ResourceEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResourceEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Resource,
    private resourceService: ResourceService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const payload: Resource = {
      name: this.data.name,
      type: this.data.type,
      capacity: this.data.capacity,
      location: this.data.location,
      description: this.data.description
    };
    const call$ = this.data.id
      ? this.resourceService.update(this.data.id, payload)
      : this.resourceService.create(payload);

    call$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Forrás mentés hiba:', err)
    });
  }
}