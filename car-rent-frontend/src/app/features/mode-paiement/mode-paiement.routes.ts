import { Routes } from '@angular/router';

/**
 * Routes du module Mode Paiement
 * Ces routes sont lazy-loadées depuis dashboard.routes.ts
 * Le préfixe 'modes-paiement' est déjà dans dashboard.routes.ts
 */
export const MODE_PAIEMENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/mode-paiement-index/mode-paiement-index.component').then(
                (m) => m.ModePaiementIndexComponent,
            ),
        title: 'Modes de Paiement',
    },
    {
        path: 'nouveau',
        loadComponent: () =>
            import('./pages/mode-paiement-form-page/mode-paiement-form-page.component').then(
                (m) => m.ModePaiementFormPageComponent,
            ),
        title: 'Nouveau Mode de Paiement',
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/mode-paiement-detail/mode-paiement-detail.component').then(
                (m) => m.ModePaiementDetailComponent,
            ),
        title: 'Détail Mode de Paiement',
    },
    {
        path: ':id/modifier',
        loadComponent: () =>
            import('./pages/mode-paiement-form-page/mode-paiement-form-page.component').then(
                (m) => m.ModePaiementFormPageComponent,
            ),
        title: 'Modifier Mode de Paiement',
    },
];