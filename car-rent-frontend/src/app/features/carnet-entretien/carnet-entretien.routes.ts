import { Routes } from '@angular/router';

export const CARNET_ENTRETIEN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/carnet-entretien-page/carnet-entretien-page.component').then(
                (m) => m.CarnetEntretienPageComponent
            ),
    },
];