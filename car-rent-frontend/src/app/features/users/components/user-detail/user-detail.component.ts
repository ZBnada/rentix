import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User, UserType } from '../../models';
import { UserService } from '../../services';
import { NotificationService } from '../../../../core/services/notification.service';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    @Input() userId!: string;

    private readonly userService = inject(UserService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);

    user = signal<User | null>(null);
    isLoading = signal<boolean>(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.userService.getUserById(this.userId).subscribe({
            next: (user) => {
                this.user.set(user);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.errorMessage.set('Error loading user');
                this.notificationService.error('Unable to load user details');
                console.error('Error loading user:', error);
                this.isLoading.set(false);
            }
        });
    }

    getProfileImageUrl(user: User): string | null {
        return this.userService.getProfileImageUrl(user);
    }

    getUserInitials(user: User): string {
        return this.userService.getUserInitials(user);
    }

    formatUserType(type: UserType): string {
        return type === UserType.INDIVIDUAL ? 'Individual' : 'Company';
    }

    formatDate(date: string | null | undefined): string {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMMM dd, yyyy at HH:mm', { locale: enUS });
    }

    async toggleActiveStatus(): Promise<void> {
        const currentUser = this.user();
        if (!currentUser) return;

        const userName = `${currentUser.firstName} ${currentUser.lastName}`;

        // Utiliser la confirmation du NotificationService
        const confirmed = await this.notificationService.confirmToggleUserStatus(
            userName,
            currentUser.isActive
        );

        if (!confirmed) return;

        this.userService.toggleActiveStatus(currentUser.id).subscribe({
            next: () => {
                this.notificationService.userStatusToggled(userName, !currentUser.isActive);
                this.loadUser();
            },
            error: (error) => {
                this.notificationService.error('Error changing user status');
                console.error('Error toggling status:', error);
            }
        });
    }

    async verifyEmail(): Promise<void> {
        const currentUser = this.user();
        if (!currentUser) return;

        const userName = `${currentUser.firstName} ${currentUser.lastName}`;

        // Utiliser la confirmation du NotificationService
        const confirmed = await this.notificationService.confirmVerifyEmail(userName);

        if (!confirmed) return;

        this.userService.verifyUserEmail(currentUser.id).subscribe({
            next: () => {
                this.notificationService.userEmailVerified(userName);
                this.loadUser();
            },
            error: (error) => {
                this.notificationService.error('Error verifying email');
                console.error('Error verifying email:', error);
            }
        });
    }

    async deleteUser(): Promise<void> {
        const currentUser = this.user();
        if (!currentUser) return;

        const userName = `${currentUser.firstName} ${currentUser.lastName}`;

        // Utiliser la confirmation du NotificationService
        const confirmed = await this.notificationService.confirmDeleteUser(userName);

        if (!confirmed) return;

        this.userService.deleteUser(currentUser.id).subscribe({
            next: () => {
                this.notificationService.userDeleted(userName);
                // Rediriger après un court délai pour laisser voir la notification
                setTimeout(() => {
                    this.router.navigate(['/dashboard/users']);
                }, 1500);
            },
            error: (error) => {
                this.notificationService.userDeleteError();
                console.error('Error deleting user:', error);
            }
        });
    }
}