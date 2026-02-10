import { Routes } from '@angular/router';
import { TypeEntretienListComponent } from './components/type-entretien-list/type-entretien-list.component';
import { TypeEntretienCreateComponent } from './pages/type-entretien-create/type-entretien-create.component';
import { TypeEntretienEditComponent } from './pages/type-entretien-edit/type-entretien-edit.component';

/**
 * Routes for the Type Entretien module
 */
export const TYPE_ENTRETIEN_ROUTES: Routes = [
    {
        path: '',
        component: TypeEntretienListComponent,
        data: { title: 'Types d\'entretien' },
    },
    {
        path: 'create',
        component: TypeEntretienCreateComponent,
        data: { title: 'Nouveau type d\'entretien' },
    },
    {
        path: 'edit/:id',
        component: TypeEntretienEditComponent,
        data: { title: 'Modifier type d\'entretien' },
    },
];