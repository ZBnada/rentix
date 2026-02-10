import { Routes } from '@angular/router';
import { EntretienListComponent } from './components/entretien-list/entretien-list.component';

/**
 * Routes for the Entretien module
 */
export const ENTRETIEN_ROUTES: Routes = [
    {
        path: '',
        component: EntretienListComponent,
        data: { title: 'Maintenance Records' },
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./pages/entretien-create/entretien-create.component').then(
                (m) => m.EntretienCreateComponent
            ),
        data: { title: 'New Maintenance Record' },
    },
    {
        path: 'edit/:id',
        loadComponent: () =>
            import('./pages/entretien-edit/entretien-edit.component').then(
                (m) => m.EntretienEditComponent
            ),
        data: { title: 'Edit Maintenance Record' },
    },
    {
        path: 'vehicle-history/:vehiculeId',
        loadComponent: () =>
            import('./pages/vehicle-history/vehicle-history.component').then(
                (m) => m.VehicleHistoryComponent
            ),
        data: { title: 'Vehicle Maintenance History' },
    },
];