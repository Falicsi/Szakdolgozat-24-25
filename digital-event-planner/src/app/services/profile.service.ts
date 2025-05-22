import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { map, switchMap } from 'rxjs/operators';

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
    private auth: AuthService,
    private firestore: Firestore
  ) {}

  getProfile(): Observable<ProfileModel> {
    if (environment.useFirebase) {
      const userId = localStorage.getItem('userId');
      if (!userId) return of({});
      return from(getDoc(doc(this.firestore, 'profiles', userId))).pipe(
        map(snap => snap.data() as ProfileModel)
      );
    }
    return this.api.getProfile();
  }

  updateProfile(data: Partial<ProfileModel>): Observable<ProfileModel> {
    if (environment.useFirebase) {
      const userId = localStorage.getItem('userId');
      return from(setDoc(doc(this.firestore, 'profiles', userId!), data, { merge: true })).pipe(
        map(() => data as ProfileModel)
      );
    }
    return this.api.updateProfile(data);
  }

  uploadAvatar(file: File): Observable<string> {
    if (environment.useFirebase) {
      const userId = localStorage.getItem('userId');
      if (!userId) return of('');
      const storage = getStorage();
      const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
      return from(uploadBytes(avatarRef, file)).pipe(
        switchMap(() => from(getDownloadURL(avatarRef)))
      );
    }
    const formData = new FormData();
    formData.append('avatar', file, file.name);
    return this.api.uploadAvatar(formData);
  }
}