import { Routes } from '@angular/router';

export const ENTRETIEN_A_SUIVRE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/entretien-a-suivre-page/entretien-a-suivre-page.component').then(
                (m) => m.EntretienASuivrePageComponent
            ),
    },
];