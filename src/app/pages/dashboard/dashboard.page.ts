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

    logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}
