// src/app/core/auth/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const API = 'https://api.escuelajs.co/api/v1';

interface LoginRes { access_token: string; refresh_token: string; }
export interface Profile { id: number; email: string; role: string; avatar: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);

    private _user = signal<Profile | null>(null);
    user = computed(() => this._user());
    isLoggedIn = computed(() => !!this.token);

    // Storage token
    private setAccessToken(t: string) { sessionStorage.setItem('access_token', t); }
    private setRefreshToken(t: string) { sessionStorage.setItem('refresh_token', t); }
    get token() { return sessionStorage.getItem('access_token'); }
    get refreshToken() { return sessionStorage.getItem('refresh_token'); }

    // Login: salva AT + RT (non carichiamo profilo qui)
    login(email: string, password: string) {
        return this.http.post<LoginRes>(`${API}/auth/login`, { email, password })
            .pipe(tap(res => {
                this.setAccessToken(res.access_token);
                this.setRefreshToken(res.refresh_token);
            }));
    }

    // Logout
    logout() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        this._user.set(null);
    }

    // Profilo (on-demand, header via interceptor)
    fetchProfile() {
        return this.http.get<Profile>(`${API}/auth/profile`)
            .pipe(tap(p => this._user.set(p)));
    }

    // === REFRESH ===
    // Chiama /auth/refresh-token con il refresh_token correntemente salvato
    refreshAccessToken() {
        const rt = this.refreshToken;
        return this.http.post<{ access_token: string; refresh_token?: string }>(
            `${API}/auth/refresh-token`,
            { refreshToken: rt }
        ).pipe(tap(res => {
            this.setAccessToken(res.access_token);
            // se l'API ruota anche il refresh, salvalo
            if (res.refresh_token) this.setRefreshToken(res.refresh_token);
        }));
    }
}
