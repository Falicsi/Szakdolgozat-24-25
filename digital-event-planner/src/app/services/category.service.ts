import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Category {
  _id?: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Category[]> {
    return this.api.listCategories();
  }

  getById(id: string): Observable<Category> {
    return this.api.getCategory(id);
  }

  create(category: Category): Observable<{ id: string }> {
    return this.api.createCategory(category);
  }

  update(id: string, category: Category): Observable<Category> {
    return this.api.updateCategory(id, category);
  }

  delete(id: string): Observable<void> {
    return this.api.deleteCategory(id);
  }
}