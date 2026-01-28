import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Role } from '../../models';
import { RoleService } from '../../services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-role-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './role-detail.component.html',
    styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent implements OnInit {
    @Input() roleId!: string;

    role = signal<Role | null>(null);
    isLoading = signal<boolean>(true);
    errorMessage = signal<string | null>(null);

    constructor(
        private readonly roleService: RoleService,
        private readonly notificationService: NotificationService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.loadRole();
    }

    loadRole(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.roleService.getRoleById(this.roleId).subscribe({
            next: (role) => {
                this.role.set(role);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.errorMessage.set('Erreur lors du chargement du rôle');
                this.notificationService.error('Impossible de charger les détails du rôle. Veuillez réessayer.');
                console.error('Error loading role:', error);
                this.isLoading.set(false);
            }
        });
    }

    async deleteRole(): Promise<void> {
        const currentRole = this.role();
        if (!currentRole) return;

        // Afficher la confirmation de suppression
        const confirmed = await this.notificationService.confirmDeleteRole(currentRole.name);

        if (!confirmed) {
            return;
        }

        // Afficher le loader
        this.notificationService.loading('Suppression en cours...', 'Veuillez patienter');

        this.roleService.deleteRole(currentRole.id).subscribe({
            next: () => {
                this.notificationService.closeLoading();
                this.notificationService.roleDeleted(currentRole.name);

                // Redirection après un court délai pour laisser voir la notification
                setTimeout(() => {
                    this.router.navigate(['/dashboard/roles']);
                }, 1500);
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

    formatDate(date: string): string {
        return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
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

    getProgressWidth(weight: number): number {
        return 100 - weight;
    }
}