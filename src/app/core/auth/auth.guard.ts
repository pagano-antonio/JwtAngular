import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';


export const canActivateAuth: CanActivateFn = () => {
    const router = inject(Router);
    const hasToken = !!sessionStorage.getItem('access_token'); // check sincrono
    return hasToken ? true : router.parseUrl('/login');        // ✅ UrlTree
};