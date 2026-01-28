import { Routes } from '@angular/router';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { RoleCreatePageComponent } from './pages/role-create/role-create-page.component';
import { RoleEditPageComponent } from './pages/role-edit/role-edit-page.component';
import { RoleDetailPageComponent } from './pages/role-detail/role-detail-page.component';

export const ROLES_ROUTES: Routes = [
    {
        path: '',
        component: RolesPageComponent,
        title: 'Gestion des Rôles'
    },
    {
        path: 'create',
        component: RoleCreatePageComponent,
        title: 'Créer un Rôle'
    },
    {
        path: ':id',
        component: RoleDetailPageComponent,
        title: 'Détails du Rôle'
    },
    {
        path: ':id/edit',
        component: RoleEditPageComponent,
        title: 'Modifier le Rôle'
    }
];