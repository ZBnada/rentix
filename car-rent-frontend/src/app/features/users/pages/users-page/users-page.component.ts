import { Component } from '@angular/core';
import { UserListComponent } from '../../components/user-list/user-list.component';

@Component({
    selector: 'app-users-page',
    standalone: true,
    imports: [UserListComponent],
    template: `<app-user-list></app-user-list>`
})
export class UsersPageComponent {}