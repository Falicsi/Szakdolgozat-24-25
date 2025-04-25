import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resource {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  description: string;
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

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl, this.getAuthHeaders());
  }
}