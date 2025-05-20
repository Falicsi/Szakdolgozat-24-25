import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiRoot = environment.useFirebase
    ? `${environment.functionsUrl}/${environment.projectId}/${environment.functionsRegion}/api`
    : environment.apiBaseUrl;

  private usersUrl = `${this.apiRoot}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }
}
