// pages/login/login.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.page.html'
})
export default class LoginPage {
    private auth = inject(AuthService);
    private router = inject(Router);

    email = 'john@mail.com';
    password = 'changeme';
    loading = signal(false);
    error = signal<string | null>(null);

    submit() {
        this.loading.set(true);
        this.error.set(null);

        this.auth.login(this.email, this.password).subscribe({
            next: () => {
                // token salvato: vai in dashboard
                this.router.navigateByUrl('/dashboard');
            },
            error: () => {
                this.error.set('Credenziali non valide');
                this.loading.set(false);
            }
        });
    }
}
