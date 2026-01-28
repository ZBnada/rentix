import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleService } from '../../services';
import { CreateRoleInput, UpdateRoleInput } from '../../models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-role-create-page',
    standalone: true,
    imports: [CommonModule, RouterLink, RoleFormComponent],
    templateUrl: './role-create-page.component.html'
})
export class RoleCreatePageComponent {
    constructor(
        private readonly roleService: RoleService,
        private readonly router: Router,
        private readonly notificationService: NotificationService
    ) {}

    async onFormSubmit(input: CreateRoleInput | UpdateRoleInput): Promise<void> {
        // Cast to CreateRoleInput since we're in create mode
        const createInput = input as CreateRoleInput;

        // Demander confirmation avant création
        const confirmed = await this.notificationService.confirmCreateRole();

        if (!confirmed) {
            return;
        }

        // Afficher le loader
        this.notificationService.loading('Création en cours...', 'Veuillez patienter');

        this.roleService.createRole(createInput).subscribe({
            next: (role) => {
                this.notificationService.closeLoading();
                this.notificationService.roleCreated(role.name);

                // Redirection après un court délai pour laisser voir la notification
                setTimeout(() => {
                    this.router.navigate(['/dashboard/roles', role.id]);
                }, 1500);
            },
            error: (error) => {
                this.notificationService.closeLoading();
                this.notificationService.roleCreateError();
                console.error('Error creating role:', error);
            }
        });
    }

    onFormCancel(): void {
        this.router.navigate(['/dashboard/roles']);
    }
}