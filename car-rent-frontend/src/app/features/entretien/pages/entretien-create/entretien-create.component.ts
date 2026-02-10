import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EntretienFormComponent } from '../../components/entretien-form/entretien-form.component';
import { EntretienService } from '../../services/entretien.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
    CreateEntretienInput,
    TypeEntretien,
    Vehicule,
} from '../../models/entretien.model';
import { Apollo, gql } from 'apollo-angular';

/**
 * Page for creating a new maintenance record
 * ✅ VERSION SIMPLIFIÉE - Chargement séquentiel pour éviter les problèmes forkJoin
 */
@Component({
    selector: 'app-entretien-create',
    standalone: true,
    imports: [CommonModule, EntretienFormComponent],
    templateUrl: './entretien-create.component.html',
    styleUrls: ['./entretien-create.component.css'],
})
export class EntretienCreateComponent implements OnInit, OnDestroy {
    @ViewChild(EntretienFormComponent)
    formComponent!: EntretienFormComponent;

    typesEntretien: TypeEntretien[] = [];
    vehicules: Vehicule[] = [];
    isLoading: boolean = true;

    private destroy$ = new Subject<void>();

    constructor(
        private entretienService: EntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private apollo: Apollo
    ) {}

    ngOnInit(): void {
        console.log('🚀 Create component initialized');
        this.loadTypesEntretien();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * ÉTAPE 1 : Charger les types d'entretien
     */
    loadTypesEntretien(): void {
        console.log('⏳ [1/2] Loading types entretien...');

        this.apollo
            .query<{ typesEntretien: TypeEntretien[] }>({
                query: gql`
                    query GetAllTypesEntretien {
                        typesEntretien {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                        }
                    }
                `,
                fetchPolicy: 'network-only',
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    console.log('✅ [1/2] Types loaded:', result.data.typesEntretien.length);
                    this.typesEntretien = result.data.typesEntretien;
                    this.loadVehicules(); // ← Passer à l'étape 2
                },
                error: (error) => {
                    console.error('❌ [1/2] Error loading types:', error);
                    this.isLoading = false;
                    this.notificationService.error('Error loading maintenance types');

                    setTimeout(() => {
                        this.router.navigate(['/dashboard/entretien']);
                    }, 2000);
                },
            });
    }

    /**
     * ÉTAPE 2 : Charger les véhicules
     */
    loadVehicules(): void {
        console.log('⏳ [2/2] Loading vehicules...');

        this.apollo
            .query<{ vehicules: Vehicule[] }>({
                query: gql`
                    query GetAllVehicules {
                        vehicules {
                            id
                            matricule
                            marque {
                                id
                                libelle
                            }
                            type
                            energie
                            classeVehicule
                            compteur
                        }
                    }
                `,
                fetchPolicy: 'network-only',
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    console.log('✅ [2/2] Vehicules loaded:', result.data.vehicules.length);
                    this.vehicules = result.data.vehicules;

                    // ✅ TOUT EST CHARGÉ
                    this.isLoading = false;
                    console.log('🎉 All data loaded successfully!');
                },
                error: (error) => {
                    console.error('❌ [2/2] Error loading vehicules:', error);
                    this.isLoading = false;
                    this.notificationService.error('Error loading vehicles');

                    setTimeout(() => {
                        this.router.navigate(['/dashboard/entretien']);
                    }, 2000);
                },
            });
    }

    /**
     * Handle form submission
     */
    async onSubmit(input: CreateEntretienInput): Promise<void> {
        console.log('📝 Creating new entretien:', input);

        const confirmed = await this.notificationService.confirm(
            'Create Maintenance Record',
            'Are you sure you want to create this maintenance record?',
            'Create',
            'Cancel'
        );

        if (!confirmed) {
            if (this.formComponent) {
                this.formComponent.isSubmitting = false;
            }
            return;
        }

        this.notificationService.loading('Creating...');

        this.entretienService
            .createEntretien(input)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    console.log('✅ Creation successful:', result);
                    this.notificationService.closeLoading();
                    this.notificationService.success('Maintenance record created successfully');
                    this.router.navigate(['/dashboard/entretien']);
                },
                error: (error) => {
                    console.error('❌ Error creating maintenance record:', error);
                    this.notificationService.closeLoading();

                    if (this.formComponent) {
                        this.formComponent.isSubmitting = false;
                    }

                    this.notificationService.error(
                        error.message || 'Error creating maintenance record'
                    );
                },
            });
    }

    /**
     * Handle form cancellation
     */
    onCancel(): void {
        console.log('❌ Create cancelled');
        this.router.navigate(['/dashboard/entretien']);
    }

}