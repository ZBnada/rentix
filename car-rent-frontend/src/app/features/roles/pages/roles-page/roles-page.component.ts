import { Component } from '@angular/core';
import { RoleListComponent } from '../../components/role-list/role-list.component';

@Component({
    selector: 'app-roles-page',
    standalone: true,
    imports: [RoleListComponent],
    template: `<app-role-list></app-role-list>`
})
export class RolesPageComponent {}