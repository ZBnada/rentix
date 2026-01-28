import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleService } from '../../services';
import { CreateRoleInput, Role, UpdateRoleInput } from '../../models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-role-edit-page',
    standalone: true,
    imports: [CommonModule, RouterLink, RoleFormComponent],
    templateUrl: './role-edit-page.component.html'
})
export class RoleEditPageComponent implements OnInit {
    role = signal<Role | null>(null);
    isLoading = signal<boolean>(true);
    errorMessage = signal<string | null>(null);

    constructor(
        private readonly roleService: RoleService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        const roleId = this.route.snapshot.paramMap.get('id');
        if (roleId) {
            this.loadRole(roleId);
        }
    }

    loadRole(roleId: string): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.roleService.getRoleById(roleId).subscribe({
            next: (role) => {
                this.role.set(role);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.errorMessage.set('Erreur lors du chargement du rôle');
                this.notificationService.error('Impossible de charger les données du rôle. Veuillez réessayer.');
                console.error('Error loading role:', error);
                this.isLoading.set(false);
            }
        });
    }

    async onFormSubmit(input: CreateRoleInput | UpdateRoleInput): Promise<void> {
        const currentRole = this.role();
        if (!currentRole) return;

        // Demander confirmation avant modification
        const confirmed = await this.notificationService.confirmUpdateRole(currentRole.name);

        if (!confirmed) {
            return;
        }

        // Cast to UpdateRoleInput and add the id
        const updateInput: UpdateRoleInput = {
            id: currentRole.id,
            ...(input as CreateRoleInput)
        };

        // Afficher le loader
        this.notificationService.loading('Modification en cours...', 'Veuillez patienter');

        this.roleService.updateRole(currentRole.id, updateInput).subscribe({
            next: (role) => {
                this.notificationService.closeLoading();
                this.notificationService.roleUpdated(role.name);

                // Redirection après un court délai pour laisser voir la notification
                setTimeout(() => {
                    this.router.navigate(['/dashboard/roles', role.id]);
                }, 1500);
            },
            error: (error) => {
                this.notificationService.closeLoading();
                this.notificationService.roleUpdateError();
                console.error('Error updating role:', error);
            }
        });
    }

    onFormCancel(): void {
        const currentRole = this.role();
        if (currentRole) {
            this.router.navigate(['/dashboard/roles', currentRole.id]);
        } else {
            this.router.navigate(['/dashboard/roles']);
        }
    }
}