import { Routes } from '@angular/router';

export const CONTROLE_TECHNIQUE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/controle-technique-page/controle-technique-page.component').then(
                (m) => m.ControleTechniquePageComponent,
            ),
    },
];