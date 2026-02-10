import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TypeEntretienFormComponent } from '../../components/type-entretien-form/type-entretien-form.component';
import { TypeEntretienService } from '../../services/type-entretien.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
    TypeEntretien,
    UpdateTypeEntretienInput,
} from '../../models/type-entretien.model';

/**
 * Page for editing an existing maintenance type
 */
@Component({
    selector: 'app-type-entretien-edit',
    standalone: true,
    imports: [CommonModule, TypeEntretienFormComponent],
    templateUrl: './type-entretien-edit.component.html',
    styleUrls: ['./type-entretien-edit.component.css'],
})
export class TypeEntretienEditComponent implements OnInit, OnDestroy {
    @ViewChild(TypeEntretienFormComponent)
    formComponent!: TypeEntretienFormComponent;

    typeEntretien?: TypeEntretien;
    isLoading: boolean = true;
    typeId: string = '';

    private destroy$ = new Subject<void>();

    constructor(
        private typeEntretienService: TypeEntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.typeId = this.route.snapshot.paramMap.get('id') || '';
        if (this.typeId) {
            this.loadTypeEntretien();
        } else {
            this.notificationService.error('ID du type d\'entretien manquant');
            this.router.navigate(['..'], { relativeTo: this.route });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load maintenance type data
     */
    loadTypeEntretien(): void {
        this.isLoading = true;
        this.typeEntretienService
            .getTypeEntretienById(this.typeId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (type) => {
                    this.typeEntretien = type;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading maintenance type:', error);
                    this.notificationService.error(
                        'Erreur lors du chargement du type d\'entretien'
                    );
                    this.router.navigate(['..'], { relativeTo: this.route });
                },
            });
    }

    /**
     * Handle form submission
     */
    async onSubmit(input: UpdateTypeEntretienInput): Promise<void> {
        if (!this.typeEntretien) return;

        const confirmed =
            await this.notificationService.confirmUpdateTypeEntretien(
                this.typeEntretien.designation
            );

        if (!confirmed) {
            this.formComponent.isSubmitting = false;
            return;
        }

        this.notificationService.loading('Modification en cours...');

        this.typeEntretienService
            .updateTypeEntretien(input)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    this.notificationService.closeLoading();
                    this.notificationService.typeEntretienUpdated(result.designation);
                    this.router.navigate(['../..'], { relativeTo: this.route });
                },
                error: (error) => {
                    console.error('Error updating maintenance type:', error);
                    this.notificationService.closeLoading();
                    this.formComponent.isSubmitting = false;

                    if (error.message?.includes('existe déjà')) {
                        this.notificationService.codeAlreadyExists(input.codeEntretien!);
                    } else {
                        this.notificationService.typeEntretienUpdateError(
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
        this.router.navigate(['../..'], { relativeTo: this.route });
    }
}