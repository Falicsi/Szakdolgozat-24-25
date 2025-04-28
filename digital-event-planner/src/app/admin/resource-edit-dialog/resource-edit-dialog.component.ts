import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ResourceService, Resource } from '../../services/resource.service';

@Component({
  selector: 'app-resource-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
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
    const res: Resource = {
      name: this.data.name,
      type: this.data.type,
      capacity: this.data.capacity,
      location: this.data.location,
      description: this.data.description
    };
    const call$ = this.data._id
      ? this.resourceService.update(this.data._id, res)
      : this.resourceService.create(res);
  
    call$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Forrás mentés hiba:', err)
    });
  }
}