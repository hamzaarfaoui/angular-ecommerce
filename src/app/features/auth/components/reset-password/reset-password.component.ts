import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token = '';

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    // Django envoie un lien du type: http://localhost:4200/auth/reset-password?token=XYZ (ou via route param)
    // Ajuste ici selon si ton lien Django met le token en QueryParam ou RouteParam.
    // D'après ton URL Django `reset_password/<str:token>`, si l'e-mail génère un lien Angular, 
    // assure-toi que ton lien Django pointe bien vers ton front-end avec le token.
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  onSubmit() {
    if (this.resetForm.valid) {
      if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
      }

      this.authService.resetPassword(this.token, this.resetForm.value).subscribe({
        next: () => {
          alert('Mot de passe réinitialisé avec succès !');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => console.error('Erreur de réinitialisation', err)
      });
    }
  }
}