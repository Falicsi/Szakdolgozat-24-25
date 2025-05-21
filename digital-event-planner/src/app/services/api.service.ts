import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';

export interface User { id?: string; name: string; email: string; roles: string[]; }
export interface Role { id?: string; name: string; description?: string; }
export interface Category { id?: string; name: string; color?: string; }
export interface Resource { id?: string; name: string; type: string; description?: string; url?: string; metadata?: any; }
export interface EventItem {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  createdBy?: string;
  invitedUsers?: string[];
  resource?: string;
  category?: string;
}
export interface Invitation {
  id?: string;
  _id?: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private useFB = environment.useFirebase;
  private nodeBase = environment.apiBaseUrl;
  private fbBase = `${environment.functionsUrl}/${environment.projectId}/${environment.functionsRegion}/api`;

  constructor(
    private http: HttpClient,
  ) { }

  listUsers(): Observable<User[]> {
    return this.useFB
      ? this.http.get<User[]>(`${this.fbBase}/users`)
      : this.http.get<User[]>(`${this.nodeBase}/users`);
  }
  getUser(id: string): Observable<User> {
    return this.useFB
      ? this.http.get<User>(`${this.fbBase}/users/${id}`)
      : this.http.get<User>(`${this.nodeBase}/users/${id}`);
  }
  createUser(data: Omit<User, 'id'>): Observable<{ id: string }> {
    return this.useFB
      ? this.http.post<{ id: string }>(`${this.fbBase}/users`, data)
      : this.http.post<{ id: string }>(`${this.nodeBase}/users`, data);
  }
  updateUser(id: string, data: any): Observable<any> {
    return this.useFB
      ? this.http.put<any>(`${this.fbBase}/users/${id}`, data)
      : this.http.put<any>(`${this.nodeBase}/users/${id}`, data);
  }
  deleteUser(id: string): Observable<any> {
    return this.useFB
      ? this.http.delete<any>(`${this.fbBase}/users/${id}`)
      : this.http.delete<any>(`${this.nodeBase}/users/${id}`);
  }

  // -- Profiles -- //
  getProfile(): Observable<any> {
    return this.useFB
      ? this.http.get<any>(`${this.fbBase}/profile`)
      : this.http.get<any>(`${this.nodeBase}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.useFB
      ? this.http.put<any>(`${this.fbBase}/profile`, data)
      : this.http.put<any>(`${this.nodeBase}/profile`, data);
  }

  uploadAvatar(formData: FormData): Observable<string> {
    return this.useFB
      ? this.http.post<string>(`${this.fbBase}/profile/avatar`, formData)
      : this.http.post<string>(`${this.nodeBase}/profile/avatar`, formData);
  }

  // ----- Roles -----
  listRoles(): Observable<Role[]> {
    return this.useFB
      ? this.http.get<Role[]>(`${this.fbBase}/roles`)
      : this.http.get<Role[]>(`${this.nodeBase}/roles`);
  }
  getRole(id: string): Observable<Role> {
    return this.useFB
      ? this.http.get<Role>(`${this.fbBase}/roles/${id}`)
      : this.http.get<Role>(`${this.nodeBase}/roles/${id}`);
  }
  createRole(data: Omit<Role, 'id'>): Observable<{ id: string }> {
    return this.useFB
      ? this.http.post<{ id: string }>(`${this.fbBase}/roles`, data)
      : this.http.post<{ id: string }>(`${this.nodeBase}/roles`, data);
  }
  updateRole(id: string, data: Partial<Role>): Observable<any> {
    return this.useFB
      ? this.http.put<any>(`${this.fbBase}/roles/${id}`, data)
      : this.http.put<any>(`${this.nodeBase}/roles/${id}`, data);
  }
  deleteRole(id: string): Observable<any> {
    return this.useFB
      ? this.http.delete<any>(`${this.fbBase}/roles/${id}`)
      : this.http.delete<any>(`${this.nodeBase}/roles/${id}`);
  }

  // ----- Categories -----
  listCategories(): Observable<Category[]> {
    return this.useFB
      ? this.http.get<Category[]>(`${this.fbBase}/categories`)
      : this.http.get<Category[]>(`${this.nodeBase}/categories`);
  }
  getCategory(id: string): Observable<Category> {
    return this.useFB
      ? this.http.get<Category>(`${this.fbBase}/categories/${id}`)
      : this.http.get<Category>(`${this.nodeBase}/categories/${id}`);
  }
  createCategory(category: Category): Observable<{ id: string }> {
    return this.useFB
      ? this.http.post<{ id: string }>(`${this.fbBase}/categories`, category)
      : this.http.post<{ id: string }>(`${this.nodeBase}/categories`, category);
  }
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.useFB
      ? this.http.put<Category>(`${this.fbBase}/categories/${id}`, category)
      : this.http.put<Category>(`${this.nodeBase}/categories/${id}`, category);
  }
  deleteCategory(id: string): Observable<void> {
    return this.useFB
      ? this.http.delete<void>(`${this.fbBase}/categories/${id}`)
      : this.http.delete<void>(`${this.nodeBase}/categories/${id}`);
  }

  // ----- Resources -----
  listResources(): Observable<Resource[]> {
    return this.useFB
      ? this.http.get<Resource[]>(`${this.fbBase}/resources`)
      : this.http.get<Resource[]>(`${this.nodeBase}/resources`);
  }
  getResource(id: string): Observable<Resource> {
    return this.useFB
      ? this.http.get<Resource>(`${this.fbBase}/resources/${id}`)
      : this.http.get<Resource>(`${this.nodeBase}/resources/${id}`);
  }
  createResource(data: Omit<Resource, 'id'>): Observable<{ id: string }> {
    return this.useFB
      ? this.http.post<{ id: string }>(`${this.fbBase}/resources`, data)
      : this.http.post<{ id: string }>(`${this.nodeBase}/resources`, data);
  }
  updateResource(id: string, data: Partial<Resource>): Observable<any> {
    return this.useFB
      ? this.http.put<any>(`${this.fbBase}/resources/${id}`, data)
      : this.http.put<any>(`${this.nodeBase}/resources/${id}`, data);
  }
  deleteResource(id: string): Observable<any> {
    return this.useFB
      ? this.http.delete<any>(`${this.fbBase}/resources/${id}`)
      : this.http.delete<any>(`${this.nodeBase}/resources/${id}`);
  }
  getResources(): Observable<Resource[]> {
    return this.useFB
      ? this.http.get<Resource[]>(`${this.fbBase}/resources`)
      : this.http.get<Resource[]>(`${this.nodeBase}/resources`);
  }
  getResourcesByEventId(eventId: string): Observable<Resource[]> {
    return this.useFB
      ? this.http.get<Resource[]>(`${this.fbBase}/resources/event/${eventId}`)
      : this.http.get<Resource[]>(`${this.nodeBase}/resources/event/${eventId}`);
  }

  // ----- Events -----
  listEvents(): Observable<EventItem[]> {
    return this.useFB
      ? this.http.get<EventItem[]>(`${this.fbBase}/events`)
      : this.http.get<EventItem[]>(`${this.nodeBase}/events`);
  }
  getEvent(id: string): Observable<EventItem> {
    return this.useFB
      ? this.http.get<EventItem>(`${this.fbBase}/events/${id}`)
      : this.http.get<EventItem>(`${this.nodeBase}/events/${id}`);
  }
  createEvent(data: Omit<EventItem, 'id'>): Observable<{ id: string }> {
    return this.useFB
      ? this.http.post<{ id: string }>(`${this.fbBase}/events`, data)
      : this.http.post<{ id: string }>(`${this.nodeBase}/events`, data);
  }
  updateEvent(id: string, data: Partial<EventItem>): Observable<any> {
    return this.useFB
      ? this.http.put<any>(`${this.fbBase}/events/${id}`, data)
      : this.http.put<any>(`${this.nodeBase}/events/${id}`, data);
  }
  deleteEvent(id: string): Observable<any> {
    return this.useFB
      ? this.http.delete<any>(`${this.fbBase}/events/${id}`)
      : this.http.delete<any>(`${this.nodeBase}/events/${id}`);
  }

  // ----- Invitations -----
  listInvitations(): Observable<Invitation[]> {
    return this.useFB
      ? this.http.get<Invitation[]>(`${this.fbBase}/invitations`)
      : this.http.get<Invitation[]>(`${this.nodeBase}/invitations`);
  }
  getInvitation(id: string): Observable<Invitation> {
    return this.useFB
      ? this.http.get<Invitation>(`${this.fbBase}/invitations/${id}`)
      : this.http.get<Invitation>(`${this.nodeBase}/invitations/${id}`);
  }
  createInvitation(data: Omit<Invitation, 'id'>): Observable<{ id: string }> {
    return this.useFB
      ? this.http.post<{ id: string }>(`${this.fbBase}/invitations`, data)
      : this.http.post<{ id: string }>(`${this.nodeBase}/invitations`, data);
  }
  updateInvitation(id: string, data: Partial<Invitation>): Observable<any> {
    return this.useFB
      ? this.http.put<any>(`${this.fbBase}/invitations/${id}`, data)
      : this.http.put<any>(`${this.nodeBase}/invitations/${id}`, data);
  }
  deleteInvitation(id: string): Observable<any> {
    return this.useFB
      ? this.http.delete<any>(`${this.fbBase}/invitations/${id}`)
      : this.http.delete<any>(`${this.nodeBase}/invitations/${id}`);
  }
  getInvitationsByUserId(userId: string): Observable<Invitation[]> {
    return this.useFB
      ? this.http.get<Invitation[]>(`${this.fbBase}/invitations/user/${userId}`)
      : this.http.get<Invitation[]>(`${this.nodeBase}/invitations/user/${userId}`);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.useFB
      ? this.http.post<any>(`${this.fbBase}/auth/register`, { username, email, password })
      : this.http.post<any>(`${this.nodeBase}/auth/register`, { username, email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.useFB
      ? this.http.post<any>(`${this.fbBase}/auth/login`, { email, password })
      : this.http.post<any>(`${this.nodeBase}/auth/login`, { email, password });
  }
}
