import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resource {
  _id?: string;
  name: string;
  type: string;
  capacity?: number;
  location?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private apiUrl = 'http://localhost:3000/api/resources';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  // READ ALL
  getAll(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl, this.getAuthHeaders());
  }

  // alias a komponens hívásához
  getResources(): Observable<Resource[]> {
    return this.getAll();
  }

  // READ ONE
  getById(id: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // CREATE
  create(resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resource, this.getAuthHeaders());
  }

  // UPDATE
  update(id: string, resource: Resource): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${id}`, resource, this.getAuthHeaders());
  }

  // DELETE
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}