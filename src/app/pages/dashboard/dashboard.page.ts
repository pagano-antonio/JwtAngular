import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.page.html'
})
export default class DashboardPage {
    auth = inject(AuthService);
    router = inject(Router);

    loading = false;
    error: string | null = null;

    loadProfile() {
        this.error = null;
        this.loading = true;
        this.auth.fetchProfile().subscribe({
            next: () => this.loading = false,
            error: () => { this.error = '401: token mancante o non valido'; this.loading = false; }
        });
    }

    // << NUOVO
    invalidateToken() {
        // “rompo” l’access token: l’interceptor continuerà ad allegarlo ma sarà invalido
        sessionStorage.setItem('access_token', 'BROKEN.' + Date.now());
        this.error = 'Token invalidato (di test). Prova "Carica profilo" per vedere il 401.';
    }
    // >>

    logout() {
        this.auth.logout();
        this.router.navigateByUrl('/login');
    }
}
