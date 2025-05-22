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
import { firstValueFrom } from 'rxjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { environment } from '../../environments/environment';

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
  profileData?: ProfileModel;
  editMode = false;
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.form = this.fb.group({
      bio: ['']
    });
  }

ngOnInit(): void {
  if (environment.useFirebase) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('userId', user.uid);
        this.loadProfile();
      }
    });
  } else {
    this.loadProfile();
  }
}

loadProfile() {
  this.profileService.getProfile().subscribe({
    next: (profile: ProfileModel) => {
      this.profileData = profile;
      this.form.patchValue({
        bio: profile.bio ?? ''
      });
    },
    error: err => {
      console.error('Profil lekérése hiba', err);
    }
  });
}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.profileData) this.profileData.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    let avatarUrl = this.profileData?.avatarUrl;

    if (this.selectedFile) {
      avatarUrl = await this.uploadImage(this.selectedFile);
    }

    const data: Partial<ProfileModel> = {
      avatarUrl,
      bio: this.form.value.bio || undefined
    };
    this.profileService.updateProfile(data).subscribe({
      next: () => {
        this.message = 'Profil mentve.';
        this.saving = false;
        this.editMode = false;
        this.profileService.getProfile().subscribe(p => this.profileData = p);
      },
      error: err => {
        console.error('Profil mentése hiba', err);
        this.message = 'Hiba a mentés során.';
        this.saving = false;
      }
    });
  }

  async uploadImage(file: File): Promise<string> {
    const resizedBlob = await this.resizeAndCompressImage(file, 500, 500, 0.8);
    const uploadFile = new File([resizedBlob], file.name, { type: resizedBlob.type });
    return await firstValueFrom(this.profileService.uploadAvatar(uploadFile));
  }

  private resizeAndCompressImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const aspect = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspect);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspect);
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context error');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob);
            else reject('Image compression failed');
          },
          'image/jpeg',
          quality
        );
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
