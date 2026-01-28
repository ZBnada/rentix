import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services';
import { User, UserFilterParams, UserType } from '../../models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    users = signal<User[]>([]);
    totalUsers = signal<number>(0);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    filterParams = new UserFilterParams();
    searchTerm = signal<string>('');
    selectedUserType = signal<UserType | ''>('');
    selectedStatus = signal<boolean | ''>('');

    // Expose Math to template
    protected readonly Math = Math;

    // Computed values
    totalPages = computed(() => Math.ceil(this.totalUsers() / this.filterParams.limit));
    currentPage = computed(() => this.filterParams.page);

    // Pagination
    paginationRange = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();
        const range: number[] = [];

        const start = Math.max(1, current - 2);
        const end = Math.min(total, current + 2);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    });

    constructor(
        private readonly userService: UserService,
        private readonly notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        // Convert selectedStatus from boolean | '' to boolean | undefined
        const statusValue = this.selectedStatus();
        const isActive = statusValue === '' ? undefined : statusValue;

        const filters = {
            page: this.filterParams.page,
            limit: this.filterParams.limit,
            search: this.searchTerm() || undefined,
            userType: this.selectedUserType() || undefined,
            isActive: isActive,
            sortField: this.filterParams.sortField,
            sortOrder: this.filterParams.sortOrder
        };

        this.userService.getAllUsers(filters).subscribe({
            next: (response) => {
                this.users.set(response.users);
                this.totalUsers.set(response.total);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.errorMessage.set('Error loading users');
                this.notificationService.error(
                    'Impossible de charger la liste des utilisateurs. Veuillez réessayer.',
                    'Erreur de chargement'
                );
                console.error('Error loading users:', error);
                this.isLoading.set(false);
            }
        });
    }

    onSearch(): void {
        this.filterParams.page = 1;
        this.loadUsers();
    }

    onFilterChange(): void {
        this.filterParams.page = 1;
        this.loadUsers();
    }

    resetFilters(): void {
        this.searchTerm.set('');
        this.selectedUserType.set('');
        this.selectedStatus.set('');
        this.filterParams.reset();
        this.loadUsers();
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.filterParams.page = page;
            this.loadUsers();
        }
    }

    previousPage(): void {
        if (this.currentPage() > 1) {
            this.goToPage(this.currentPage() - 1);
        }
    }

    nextPage(): void {
        if (this.currentPage() < this.totalPages()) {
            this.goToPage(this.currentPage() + 1);
        }
    }

    async toggleActiveStatus(user: User): Promise<void> {
        const userName = `${user.firstName} ${user.lastName}`;
        const confirmed = await this.notificationService.confirmToggleUserStatus(userName, user.isActive);

        if (confirmed) {
            this.userService.toggleActiveStatus(user.id).subscribe({
                next: () => {
                    this.notificationService.userStatusToggled(userName, !user.isActive);
                    this.loadUsers();
                },
                error: (error: any) => {
                    this.notificationService.error(
                        'Impossible de modifier le statut de l\'utilisateur. Veuillez réessayer.',
                        'Erreur de modification'
                    );
                    console.error('Error toggling status:', error);
                }
            });
        }
    }

    async deleteUser(user: User): Promise<void> {
        const userName = `${user.firstName} ${user.lastName}`;
        const confirmed = await this.notificationService.confirmDeleteUser(userName);

        if (confirmed) {
            this.userService.deleteUser(user.id).subscribe({
                next: () => {
                    this.notificationService.userDeleted(userName);
                    this.loadUsers();
                },
                error: (error: any) => {
                    this.notificationService.userDeleteError();
                    console.error('Error deleting user:', error);
                }
            });
        }
    }

    getUserInitials(user: User): string {
        return this.userService.getUserInitials(user);
    }

    getProfileImageUrl(user: User): string | null {
        return this.userService.getProfileImageUrl(user);
    }

    formatUserType(type: UserType): string {
        return type === UserType.INDIVIDUAL ? 'Individual' : 'Company';
    }
}