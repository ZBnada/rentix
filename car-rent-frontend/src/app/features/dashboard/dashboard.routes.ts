import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/layout/admin-layout/admin-layout.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/overview/overview.component')
                        .then(m => m.OverviewComponent),
                title: 'Dashboard Overview'
            },
            {
                path: 'users',
                loadComponent: () =>
                    import('../users/pages/users-page/users-page.component')
                        .then(m => m.UsersPageComponent),
                title: 'Gestion des utilisateurs'
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('../users/users.routes')
                        .then(m => m.USERS_ROUTES),
                title: 'Users Page'
            },
            {
                path: 'roles',
                loadChildren: () =>
                    import('../roles/roles.routes')
                        .then(m => m.ROLES_ROUTES),
                title: 'Rôles'
            },
            {
                path: 'vehicles',  // ✅ NEW: Vehicle Management
                loadChildren: () =>
                    import('../vehicule/vehicleRoutes')
                        .then(m => m.vehicleRoutes),
                title: 'Vehicles'
            },
            {
                path: 'vehicle-brands',
                loadChildren: () =>
                    import('../marque/vehicle-brand.routes')
                        .then(m => m.vehicleBrandRoutes),
                title: 'Vehicle Brands'
            },
            {
                path: 'profil',
                loadChildren: () =>
                    import('../profile/profile.routes')
                        .then(m => m.PROFILE_ROUTES),
                title: 'profil'
            },

        ]
    }
];