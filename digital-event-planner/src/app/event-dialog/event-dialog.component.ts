import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';
import { ResourceService, Resource } from '../services/resource.service';
import { CategoryService, Category } from '../services/category.service';

export interface EventDialogData {
  date: Date;
  title?: string;
  start?: Date;
  end?: Date;
  description?: string;
  createdBy?: string;
  invitedUsers?: string[];
  resource?: string;
  category?: string;
}

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  form!: FormGroup;
  allUsers: string[] = [];
  currentUserEmail: string = '';
  resources: Resource[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData,
    private authService: AuthService,
    private resourceService: ResourceService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    // Formot előre létrehozzuk, hogy a HTML-ben mindig legyen
    this.form = this.fb.group({
      title: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      description: [''],
      createdBy: [''],
      invitedUsers: [[]],
      resource: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.currentUserEmail = this.authService.getCurrentUserEmail() || '';
    this.resourceService.getResources().subscribe({
      next: res => this.resources = res,
      error: err => console.error('Resource hiba:', err)
    }); 
    this.categoryService.getAll().subscribe({
      next: (cats: Category[]) => this.categories = cats,
      error: (err: any) => console.error('Category hiba:', err)
    });

    this.authService.getAllUsers().subscribe(users => {
      this.allUsers = users.map(u => u.email);

      const startDate = this.data.start ?? this.data.date;
      const endDate =
        this.data.end ??
        new Date(new Date(startDate).getTime() + 60 * 60 * 1000);

      this.form.patchValue({
        title: this.data.title || '',
        start: this.toLocal(startDate),
        end: this.toLocal(endDate),
        description: this.data.description || '',
        createdBy: this.currentUserEmail,
        invitedUsers: this.data.invitedUsers?.filter(email => email !== this.currentUserEmail) || [],
        resource: this.data.resource || '',
        category: this.data.category || ''
      });
    });
  }

  /** Segéd: Date → input[type=datetime-local] formátum */
  private toLocal(d: Date): string {
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 16);
  }

  // Meghívottak listája (minden felhasználó, de önmagát kizárva)
  get selectableUsers(): string[] {
    return this.allUsers.filter(email => email !== this.currentUserEmail);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { title, start, end, description, createdBy, invitedUsers, resource, category } = this.form.value;
    this.dialogRef.close({
      title,
      start: new Date(start),
      end: new Date(end),
      description,
      createdBy,
      invitedUsers,
      resource,
      category
    });
  }

  onDelete() {
    this.dialogRef.close({ delete: true });
  }
}
