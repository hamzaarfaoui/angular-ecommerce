import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormErrorService } from '../../../../core/services/form-error.service';
import { UserProfile } from '../../models/auth.model'
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private formErrorService = inject(FormErrorService);

  profileForm!: FormGroup;
  successMessage: string = '';
  globalErrors: string[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.initForm();
    this.fetchUserProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['']
    });
  }

  private fetchUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name
        });
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.globalErrors = ['Impossible de charger les données du profil.'];
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.successMessage = '';
      this.globalErrors = [];

      const formValue = { ...this.profileForm.value };
      if (!formValue.password) {
        delete formValue.password;
      }

      this.authService.updateProfile(formValue).subscribe({
        next: () => {
          this.successMessage = 'Profil mis à jour avec succès !';
          this.profileForm.patchValue({ password: '' });
        },
        error: (errResponse: HttpErrorResponse) => {
          // Extrait et applique les erreurs Django sur les champs du formulaire
          this.globalErrors = this.formErrorService.handleDjangoErrors(this.profileForm, errResponse);
        }
      });
    }
  }

  // Raccourci pour lire l'erreur serveur d'un champ dans le HTML
  getServerError(fieldName: string): string | null {
    const control = this.profileForm.get(fieldName);
    return control && control.errors ? control.errors['serverError'] : null;
  }
}