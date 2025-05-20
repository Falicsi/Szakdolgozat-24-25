import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  constructor(private api: ApiService) {}

  getAll(): Observable<Resource[]> {
    return this.api.listResources();
  }

  getById(id: string): Observable<Resource> {
    return this.api.getResource(id);
  }

  create(resource: Omit<Resource, 'id'>): Observable<{ id: string }> {
    return this.api.createResource(resource);
  }

  update(id: string, resource: Partial<Resource>): Observable<any> {
    return this.api.updateResource(id, resource);
  }

  delete(id: string): Observable<any> {
    return this.api.deleteResource(id);
  }

  getResources(): Observable<Resource[]> {
    return this.api.getResources();
  }

  getResourceByEventId(eventId: string): Observable<Resource[]> {
    return this.api.getResourcesByEventId(eventId);
  }
}