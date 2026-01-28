import { Routes } from '@angular/router';

/**
 * Vehicle Brand Module Routes
 * Lazy-loaded routes for vehicle brand management
 */
export const vehicleBrandRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/vehicle-brand-list/vehicle-brand-list.component').then(
                (m) => m.VehicleBrandListComponent
            ),
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./pages/vehicle-brand-form/vehicle-brand-form.component').then(
                (m) => m.VehicleBrandFormComponent
            ),
    },
    {
        path: 'edit/:id',
        loadComponent: () =>
            import('./pages/vehicle-brand-form/vehicle-brand-form.component').then(
                (m) => m.VehicleBrandFormComponent
            ),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/vehicle-brand-detail/vehicle-brand-detail.component').then(
                (m) => m.VehicleBrandDetailComponent
            ),
    },
];