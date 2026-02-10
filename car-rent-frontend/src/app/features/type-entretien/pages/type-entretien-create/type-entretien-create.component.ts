import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TypeEntretienFormComponent } from '../../components/type-entretien-form/type-entretien-form.component';
import { TypeEntretienService } from '../../services/type-entretien.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateTypeEntretienInput } from '../../models/type-entretien.model';

/**
 * Page for creating a new maintenance type
 */
@Component({
    selector: 'app-type-entretien-create',
    standalone: true,
    imports: [CommonModule, TypeEntretienFormComponent],
    templateUrl: './type-entretien-create.component.html',
    styleUrls: ['./type-entretien-create.component.css'],
})
export class TypeEntretienCreateComponent implements OnDestroy {
    @ViewChild(TypeEntretienFormComponent)
    formComponent!: TypeEntretienFormComponent;

    private destroy$ = new Subject<void>();

    constructor(
        private typeEntretienService: TypeEntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Handle form submission
     */
    async onSubmit(input: CreateTypeEntretienInput): Promise<void> {
        const confirmed =
            await this.notificationService.confirmCreateTypeEntretien();

        if (!confirmed) {
            this.formComponent.isSubmitting = false;
            return;
        }

        this.notificationService.loading('Création en cours...');

        this.typeEntretienService
            .createTypeEntretien(input)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    this.notificationService.closeLoading();
                    this.notificationService.typeEntretienCreated(result.designation);
                    this.router.navigate(['..'], { relativeTo: this.route });
                },
                error: (error) => {
                    console.error('Error creating maintenance type:', error);
                    this.notificationService.closeLoading();
                    this.formComponent.isSubmitting = false;

                    if (error.message?.includes('existe déjà')) {
                        this.notificationService.codeAlreadyExists(input.codeEntretien);
                    } else {
                        this.notificationService.typeEntretienCreateError(
                            error.message
                        );
                    }
                },
            });
    }

    /**
     * Handle form cancellation
     */
    onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}