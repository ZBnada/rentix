// src/app/features/users/pages/user-create-page/user-create-page.component.ts

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserService } from '../../services/user.service';
import { CreateUserInput, UpdateUserInput } from '../../models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-user-create-page',
    standalone: true,
    imports: [CommonModule, UserFormComponent],
    templateUrl: './user-create-page.component.html'
})
export class UserCreatePageComponent {
    @ViewChild(UserFormComponent) userFormComponent?: UserFormComponent;

    constructor(
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly notificationService: NotificationService
    ) {}

    onFormSubmit(data: { input: CreateUserInput | UpdateUserInput; profileImageFile?: File | null }): void {
        // Cast to CreateUserInput since we're in create mode
        const createInput = data.input as CreateUserInput;
        const profileImageFile = data.profileImageFile;

        this.userService.createUser(createInput, profileImageFile).subscribe({
            next: (user) => {
                this.notificationService.userCreated(`${user.firstName} ${user.lastName}`);
                this.router.navigate(['/dashboard/users', user.id]);
            },
            error: (error: Error) => {
                this.handleCreateError(error);
                this.userFormComponent?.resetSubmitting();
                console.error('Error creating user:', error);
            }
        });
    }

    onFormCancel(): void {
        this.router.navigate(['/dashboard/users']);
    }

    private handleCreateError(error: Error): void {
        if (error.message?.includes('409') || error.message?.includes('email')) {
            this.notificationService.emailAlreadyExists();
        } else if (error.message?.includes('400')) {
            this.notificationService.userCreateError('Les données fournies sont invalides.');
        } else if (error.message?.includes('fichier') || error.message?.includes('image')) {
            this.notificationService.userCreateError('Erreur lors de l\'upload de la photo de profil.');
        } else {
            this.notificationService.userCreateError();
        }
    }
}