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
        <mat-hint *ngIf="form.get('password')?.value">
          Legalább 8 karakter, kis- és nagybetű, szám, speciális karakter.
        </mat-hint>
      </mat-form-field>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Mégse</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid">Mentés</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width { width:100%; }
    .error-message {
      color: #d93025;
      background: #ffeaea;
      border: 1px solid #d93025;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      text-align: center;
      font-weight: 500;
    }
  `]
})
export class UserEditDialogComponent implements OnInit {
  form!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {}

  ngOnInit(){
    this.form = this.fb.group({
      username: [this.data.username, Validators.required],
      email:    [this.data.email,    [Validators.required, Validators.email]],
      password: ['']
    });
  }

  onSubmit(){
    this.errorMessage = null;
    if(this.form.valid){
      const result: any = { ...this.form.value };

      // Frontend jelszó validáció, ha van új jelszó
      if (result.password) {
        const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!pwPattern.test(result.password)) {
          this.errorMessage = 'A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert.';
          return;
        }
      } else {
        delete result.password;
      }
      if (this.data.id) result.id = this.data.id;

      // Feltételezve, hogy a dialogRef.close(result) helyett egy service hívás történik:
      // this.userService.updateUser(result).subscribe({
      //   next: () => this.dialogRef.close(true),
      //   error: err => this.errorMessage = err?.error?.message || 'Ismeretlen hiba történt'
      // });

      // Ha továbbra is csak a parent komponens intézi a mentést:
      this.dialogRef.close(result);
    }
  }
}
