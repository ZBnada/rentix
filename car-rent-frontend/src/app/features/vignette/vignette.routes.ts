import { Routes } from '@angular/router';

export const VIGNETTE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/vignette-page/vignette-page.component').then(
                (m) => m.VignettePageComponent
            ),
    },
];