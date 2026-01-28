import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../services';
import { Role } from '../../models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-role-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
    roles = signal<Role[]>([]);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    constructor(
        private readonly roleService: RoleService,
        private readonly notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles.set(roles);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.errorMessage.set('Erreur lors du chargement des rôles');
                this.notificationService.error('Impossible de charger la liste des rôles. Veuillez réessayer.');
                console.error('Error loading roles:', error);
                this.isLoading.set(false);
            }
        });
    }

    async deleteRole(roleId: string, roleName: string): Promise<void> {
        // Afficher la confirmation de suppression
        const confirmed = await this.notificationService.confirmDeleteRole(roleName);

        if (!confirmed) {
            return;
        }

        // Afficher le loader
        this.notificationService.loading('Suppression en cours...', 'Veuillez patienter');

        this.roleService.deleteRole(roleId).subscribe({
            next: () => {
                this.notificationService.closeLoading();
                this.notificationService.roleDeleted(roleName);
                this.loadRoles();
            },
            error: (error) => {
                this.notificationService.closeLoading();

                if (error.status === 400) {
                    this.notificationService.roleInUseError();
                } else {
                    this.notificationService.roleDeleteError();
                }

                console.error('Error deleting role:', error);
            }
        });
    }

    getWeightLabel(weight: number): string {
        if (weight === 0) return 'Super Admin';
        if (weight <= 20) return 'Très Élevé';
        if (weight <= 40) return 'Élevé';
        if (weight <= 60) return 'Moyen';
        return 'Bas';
    }

    getWeightColor(weight: number): string {
        if (weight === 0) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        if (weight <= 20) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        if (weight <= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        if (weight <= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
}