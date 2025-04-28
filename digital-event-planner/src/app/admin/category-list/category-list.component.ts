import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Category, CategoryService } from '../../services/category.service';
import { CategoryEditDialogComponent } from '../category-edit-dialog/category-edit-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    CategoryEditDialogComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns = ['name', 'description', 'actions'];

  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Kategóriák betöltése sikertelen:', err)
    });
  }

  openEditDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryEditDialogComponent, {
      data: category ? { ...category } : { name: '', description: '' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Biztosan törölni szeretnéd?')) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}