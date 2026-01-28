import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { UserCreatePageComponent } from './pages/user-create-page/user-create-page.component';
import { UserEditPageComponent } from './pages/user-edit-page/user-edit-page.component';
import { UserDetailPageComponent } from './pages/user-detail-page/user-detail-page.component';

export const USERS_ROUTES: Routes = [
    {
        path: '',
        component: UsersPageComponent,
        title: 'Gestion des Utilisateurs'
    },
    {
        path: 'create',
        component: UserCreatePageComponent,
        title: 'Créer un Utilisateur'
    },
    {
        path: ':id',
        component: UserDetailPageComponent,
        title: 'Détails de l\'Utilisateur'
    },
    {
        path: ':id/edit',
        component: UserEditPageComponent,
        title: 'Modifier l\'Utilisateur'
    }
];