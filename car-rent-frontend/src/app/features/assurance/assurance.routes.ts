import { Routes } from '@angular/router';

/**
 * Routes du module Assurance
 */
export const ASSURANCE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/assurance-index/assurance-index.component').then(
                (m) => m.AssuranceIndexComponent,
            ),
        title: 'Assurances',
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/assurance-detail/assurance-detail.component').then(
                (m) => m.AssuranceDetailComponent,
            ),
        title: 'Détail Assurance',
    },
];