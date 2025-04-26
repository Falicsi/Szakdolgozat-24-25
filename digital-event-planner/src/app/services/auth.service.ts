import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string, username: string, userId: string, roleName: string, email?: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(tap(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      localStorage.setItem('userId', res.userId);
      localStorage.setItem('roleName', res.roleName);
      if (res.email) {
        localStorage.setItem('email', res.email);
      }
    }));
  }

  get authHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getRole(): string | null {
    return localStorage.getItem('roleName');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  deleteUser(userId: string) {
    return this.http.delete<void>(
      `${this.apiUrl}/users/${userId}`,
      this.authHeaders
    );
  }
  
  updateUser(user: { _id: string; /*…*/ }) {
    return this.http.put<{ _id:string;username:string;email:string }>(
      `${this.apiUrl}/users/${user._id}`,
      user,
      this.authHeaders
    );
  }
}
