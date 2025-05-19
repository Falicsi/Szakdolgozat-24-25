import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ProfileModel {
  fullName?:   string;
  avatarUrl?:  string;
  bio?:        string;
  userId?:     string;
  createdAt?:  string;
  updatedAt?:  string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/profiles';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private get authHeaders() {
    const token = this.auth.getToken() || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  /** Saját profil lekérése */
  getProfile(): Observable<ProfileModel> {
    return this.http.get<ProfileModel>(this.apiUrl, this.authHeaders);
  }

  /** Saját profil mentése/frissítése */
  updateProfile(data: Partial<ProfileModel>): Observable<ProfileModel> {
    return this.http.put<ProfileModel>(this.apiUrl, data, this.authHeaders);
  }

  uploadAvatar(formData: FormData): Observable<string> {
    // Feltételezve, hogy a backend /api/upload végpontja { url: string }-et ad vissza
    return this.http.post<{ url: string }>('/api/upload', formData).pipe(
      map(res => res.url)
    );
  }
}
