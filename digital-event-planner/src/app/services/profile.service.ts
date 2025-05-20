import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
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
  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  /** Saját profil lekérése */
  getProfile(): Observable<ProfileModel> {
    return this.api.getProfile();
  }

  /** Saját profil mentése/frissítése */
  updateProfile(data: Partial<ProfileModel>): Observable<ProfileModel> {
    return this.api.updateProfile(data);
  }

  /** Avatar feltöltése */
  uploadAvatar(formData: FormData): Observable<string> {
    return this.api.uploadAvatar(formData);
  }
}
