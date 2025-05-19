// Példa helyes category.service.ts-re
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API_BASE = environment.apiBaseUrl; // pl. 'http://localhost:3000/api'

export interface Category {
  id?: string;
  name: string;
  description?: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private base = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) {}

  listCategories(): Observable<Category[]> {               // korábban getAll()
    return this.http.get<Category[]>(this.base);
  }

  getCategory(id: string): Observable<Category> {         // korábban get()
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  createCategory(data: Omit<Category, 'id'>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.base, data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }
}
