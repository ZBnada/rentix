import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User, UpdateUserInput } from '../../models';

@Component({
    selector: 'app-user-edit-page',
    standalone: true,
    imports: [CommonModule, RouterLink, UserFormComponent],
    templateUrl: './user-edit-page.component.html'
})
export class UserEditPageComponent implements OnInit {
    @ViewChild(UserFormComponent) userFormComponent?: UserFormComponent;

    user = signal<User | null>(null);
    isLoading = signal<boolean>(true);
    errorMessage = signal<string | null>(null);
    userId: string = '';

    constructor(
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id') || '';
        if (this.userId) {
            this.loadUser(this.userId);
        }
    }

    private loadUser(userId: string): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.userService.getUserById(userId).subscribe({
            next: (user) => {
                this.user.set(user);
                this.isLoading.set(false);
            },
            error: (error: Error) => {
                this.errorMessage.set('Error loading user');
                this.notificationService.error('Unable to load user');
                console.error('Error loading user:', error);
                this.isLoading.set(false);
            }
        });
    }

    onFormSubmit(data: { input: UpdateUserInput; profileImageFile?: File | null }): void {
        const currentUser = this.user();
        if (!currentUser) return;

        const updateInput = data.input;
        const profileImageFile = data.profileImageFile;

        this.userService.updateUser(currentUser.id, updateInput, profileImageFile).subscribe({
            next: (user) => {
                this.notificationService.success(`User ${user.firstName} ${user.lastName} updated successfully`);
                this.router.navigate(['/dashboard/users', user.id]);
            },
            error: (error: Error) => {
                this.handleUpdateError(error);
                this.userFormComponent?.resetSubmitting();
                console.error('Error updating user:', error);
            }
        });
    }

    onFormCancel(): void {
        const currentUser = this.user();
        if (currentUser) {
            this.router.navigate(['/dashboard/users', currentUser.id]);
        } else {
            this.router.navigate(['/dashboard/users']);
        }
    }

    private handleUpdateError(error: Error): void {
        if (error.message?.includes('email')) {
            this.notificationService.error('Email already exists');
        } else if (error.message?.includes('file') || error.message?.includes('image')) {
            this.notificationService.error('Error uploading profile picture');
        } else {
            this.notificationService.error('Error updating user');
        }
    }
}