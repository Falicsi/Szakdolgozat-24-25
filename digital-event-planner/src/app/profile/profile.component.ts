import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService, ProfileModel } from '../services/profile.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NavbarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  message = '';
  profileData?: ProfileModel; // új változó

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      avatarUrl: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (profile: ProfileModel) => {
        this.profileData = profile; // elmentjük a teljes profilt
        this.form.patchValue({
          fullName: profile.fullName ?? '',
          avatarUrl: profile.avatarUrl ?? '',
          bio: profile.bio ?? ''
        });
      },
      error: err => {
        console.error('Profil lekérése hiba', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const data: Partial<ProfileModel> = {
      fullName: this.form.value.fullName || undefined,
      avatarUrl: this.form.value.avatarUrl || undefined,
      bio: this.form.value.bio || undefined
    };
    this.profileService.updateProfile(data).subscribe({
      next: () => {
        this.message = 'Profil mentve.';
        this.saving = false;
      },
      error: err => {
        console.error('Profil mentése hiba', err);
        this.message = 'Hiba a mentés során.';
        this.saving = false;
      }
    });
  }
}
