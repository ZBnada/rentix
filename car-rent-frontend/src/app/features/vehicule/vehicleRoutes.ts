import { Routes } from '@angular/router';

/**
 * Vehicle Module Routes
 * Lazy-loaded routes for vehicle management
 */
export const vehicleRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/vehicle-list/vehicle-list.component').then(
                (m) => m.VehicleListComponent
            ),
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./pages/vehicle-form/vehicle-form.component').then(
                (m) => m.VehicleFormComponent
            ),
    },
    {
        path: 'edit/:id',
        loadComponent: () =>
            import('./pages/vehicle-form/vehicle-form.component').then(
                (m) => m.VehicleFormComponent
            ),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/vehicle-detail/vehicle-detail.component').then(
                (m) => m.VehicleDetailComponent
            ),
    },
];