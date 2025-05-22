import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ResourceService, Resource } from '../../services/resource.service';
import { ResourceEditDialogComponent } from '../resource-edit-dialog/resource-edit-dialog.component';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  resources: Resource[] = [];
  displayedColumns = ['name', 'type', 'actions'];

  constructor(
    private resourceService: ResourceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe({
      next: res => this.resources = res,
      error: err => console.error('Források betöltése hiba:', err)
    });
  }

  openEditDialog(resource?: Resource): void {
    const ref = this.dialog.open(ResourceEditDialogComponent, {
      data: resource ? { ...resource } : { name: '', type: '' }
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.loadResources();
      }
    });
  }

  deleteResource(id: string): void {
    if (!confirm('Biztosan törlöd a forrást?')) return;
    this.resourceService.delete(id).subscribe({
      next: () => this.loadResources(),
      error: err => console.error('Forrás törlése hiba:', err)
    });
  }
}