import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { ApiService, User } from './api.service';
import { environment } from '../../environments/environment';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private api: ApiService,
    private auth: Auth,
    private firestore: Firestore
  ) { }

  register(username: string, email: string, password: string): Observable<any> {
    if (environment.useFirebase) {
      return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
        switchMap((cred: UserCredential) =>
          setDoc(doc(this.firestore, 'users', cred.user.uid), {
            uid: cred.user.uid,
            username,
            email,
            roles: ['user']
          }).then(() =>
            setDoc(doc(this.firestore, 'profiles', cred.user.uid), {
              userId: cred.user.uid,
              fullName: username,
              avatarUrl: 'assets/default-avatar.png',
              bio: '',
              createdAt: new Date(),
              updatedAt: new Date()
            })
          ).then(() => ({ uid: cred.user.uid, username, email }))
        ),
        tap(user => {
          localStorage.setItem('firebaseUser', JSON.stringify(user));
          localStorage.setItem('firebaseRole', 'user');
          localStorage.setItem('userId', user.uid);
          localStorage.setItem('email', user.email);
        })
      );
    } else {
      return this.api.register(username, email, password);
    }
  }

  login(email: string, password: string): Observable<any> {
    if (environment.useFirebase) {
      return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
        switchMap(async (cred: UserCredential) => {
          const snap = await getDoc(doc(this.firestore, 'users', cred.user.uid));
          const data = snap.data() || {};
          const tokenResult = await cred.user.getIdTokenResult();
          const roles: string[] = data['roles'] || [];
          const isAdmin = !!tokenResult.claims['admin'] || roles.includes('admin');
          localStorage.setItem('firebaseUser', JSON.stringify({ uid: cred.user.uid, email, ...data }));
          localStorage.setItem('email', email);
          localStorage.setItem('userId', cred.user.uid);
          localStorage.setItem('firebaseRole', isAdmin ? 'admin' : (roles[0] || 'user'));
          localStorage.setItem('username', data['username'] || '');
          return { uid: cred.user.uid, email, ...data };
        })
      );
    } else {
      return this.api.login(email, password).pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('roleName', res.roleName);
          if (res.email) localStorage.setItem('email', res.email);
        })
      );
    }
  }

  logout(): void {
    if (environment.useFirebase) {
      localStorage.removeItem('firebaseUser');
      localStorage.removeItem('firebaseRole');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('roleName');
    }
  }

  getRole(): string | null {
    if (environment.useFirebase) {
      return localStorage.getItem('firebaseRole');
    }
    return localStorage.getItem('roleName');
  }

  getToken(): string | null {
    if (environment.useFirebase) return null;
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    if (environment.useFirebase) {
      return !!localStorage.getItem('firebaseUser');
    }
    return !!this.getToken();
  }

  getCurrentUserEmail(): string | null {
    if (environment.useFirebase) {
      const user = localStorage.getItem('firebaseUser');
      return user ? JSON.parse(user).email : null;
    }
    return localStorage.getItem('email');
  }

  getAllUsers(): Observable<any[]> {
    return this.api.listUsers();
  }

  deleteUser(userId: string) {
    return this.api.deleteUser(userId);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.api.updateUser(id, data);
  }
}