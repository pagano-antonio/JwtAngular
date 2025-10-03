import { Routes } from '@angular/router';
import { canActivateAuth } from './core/auth/auth.guard';
import { canActivateRole } from './core/auth/role.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./pages/login/login.page') },
    { path: 'dashboard', canActivate: [canActivateAuth], loadComponent: () => import('./pages/dashboard/dashboard.page') },

    // SOLO admin
    {
        path: 'admin', canActivate: [canActivateAuth, canActivateRole(['admin'])],
        loadComponent: () => import('./pages/admin/admin.page')
    },

    { path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden.page') },

    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', redirectTo: 'login' }

    /*
    path: '',
    canActivate: [canActivateRole(['admin'])],
    children: [
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.page')
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page')
      },
*/

];
