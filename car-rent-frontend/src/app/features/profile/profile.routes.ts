// src/app/features/profile/profile.routes.ts

import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/profile-page/profile-page.component').then(
                (m) => m.ProfilePageComponent
            ),
        data: { title: 'My Profile' }
    }
    // Add more routes as needed:
    // {
    //   path: 'edit',
    //   loadComponent: () => import('./pages/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
    // },
    // {
    //   path: 'security',
    //   loadComponent: () => import('./pages/security/security.component').then(m => m.SecurityComponent)
    // }
];

