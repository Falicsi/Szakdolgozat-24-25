import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminComponent   } from './admin/admin.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { EventListComponent }from './admin/event-list/event-list.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '',       redirectTo: 'users', pathMatch: 'full' },
      { path: 'users',  component: UserListComponent },
      { path: 'events', component: EventListComponent }
    ]
  },
  { path: '**', redirectTo: '/home' }
];
