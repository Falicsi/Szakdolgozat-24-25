import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';

export interface UserDialogData {
  id?:      string; // vagy string | undefined
  username: string;
  email:    string;
}

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Felhasználó szerkesztése</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Felhasználónév</mat-label>
        <input matInput formControlName="username"/>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email"/>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Új jelszó (ha módosítod)</mat-label>
        <input matInput type="password" formControlName="password"/>
      </mat-form-field>
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Mégse</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid">Mentés</button>
      </div>
    </form>
  `,
  styles: [`.full-width { width:100%; }`]
})
export class UserEditDialogComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {}
  ngOnInit(){
    this.form = this.fb.group({
      username: [this.data.username, Validators.required],
      email:    [this.data.email,    [Validators.required, Validators.email]],
      password: ['']  // opcionális
    });
  }
  onSubmit(){
    if(this.form.valid){
      this.dialogRef.close({ id: this.data.id, ...this.form.value });
    }
  }
}
