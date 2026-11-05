import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LoginRequest, AuthResponse, RegisterRequest, ResetPasswordRequest, UserProfile } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`; // Ex: https://api.store.localhost/api

  // --- SIGNALS PRIVÉS (État interne) ---
  private isAuthenticatedSignal = signal<boolean>(!!localStorage.getItem('access_token'));
  private currentUserSignal = signal<UserProfile | null>(this.getUserFromStorage());

  // --- SIGNALS PUBLICS (Lecture seule pour les composants comme Header) ---
  readonly isLoggedIn = computed(() => this.isAuthenticatedSignal());
  readonly currentUser = this.currentUserSignal.asReadonly();

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.isAuthenticatedSignal.set(true);
      })
    );
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot_password`, { email });
  }

  resetPassword(token: string, data: ResetPasswordRequest) {
    return this.http.post(`${this.apiUrl}/reset_password/${token}`, data);
  }

  // --- NOUVELLES MÉTHODES PROFIL ---

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/userinfo`).pipe(
      tap(profile => {
        this.currentUserSignal.set(profile);
        localStorage.setItem('user_profile', JSON.stringify(profile)); // Sauvegarde pour le Header
      })
    );
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/userinfo/update`, data).pipe(
      tap(updatedProfile => {
        this.currentUserSignal.set(updatedProfile);
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      })
    );
  }

  // --- GESTION DU REFRESH TOKEN ---

  refreshToken(): Observable<{ access: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<{ access: string }>(`${this.apiUrl}/token/refresh`, { refresh: refreshToken }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(null);
  }

  // --- UTILITAIRE ---
  
  // Restaure le profil depuis le storage au chargement de l'application
  private getUserFromStorage(): UserProfile | null {
    const savedUser = localStorage.getItem('user_profile');
    return savedUser ? JSON.parse(savedUser) : null;
  }
}