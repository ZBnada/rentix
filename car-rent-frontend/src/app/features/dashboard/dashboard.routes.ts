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
                path: 'vehicles',
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
                path: 'type-entretien',
                loadChildren: () => import('../type-entretien/type-entretien.routes')
                    .then(m => m.TYPE_ENTRETIEN_ROUTES),
            },
            {
                path: 'entretiens-a-suivre',
                loadChildren: () =>
                    import('../entretien-a-suivre/entretien-a-suivre.routes').then(
                        (m) => m.ENTRETIEN_A_SUIVRE_ROUTES
                    ),
            },
            {
                path: 'modes-paiement',
                loadChildren: () =>
                    import('../mode-paiement/mode-paiement.routes').then(
                        (m) => m.MODE_PAIEMENT_ROUTES
                    ),
                title: 'Modes de Paiement'
            },
            {
                path: 'Insurance',
                loadChildren: () =>
                    import('../assurance/assurance.routes')
                        .then(m => m.ASSURANCE_ROUTES),
                title: 'profil'
            },
            {
                path: 'carnet-entretien',
                loadChildren: () =>
                    import('../carnet-entretien/carnet-entretien.routes').then(
                        (m) => m.CARNET_ENTRETIEN_ROUTES
                    ),
                title: 'Carnet d\'Entretien',
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