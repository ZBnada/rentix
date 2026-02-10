import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EntretienFormComponent } from '../../components/entretien-form/entretien-form.component';
import { EntretienService } from '../../services/entretien.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
    Entretien,
    UpdateEntretienInput,
    TypeEntretien,
    Vehicule,
} from '../../models/entretien.model';
import { Apollo, gql } from 'apollo-angular';

/**
 * Page for editing an existing maintenance record
 * ✅ VERSION SIMPLIFIÉE - Chargement séquentiel pour éviter les problèmes forkJoin
 */
@Component({
    selector: 'app-entretien-edit',
    standalone: true,
    imports: [CommonModule, EntretienFormComponent],
    templateUrl: './entretien-edit.component.html',
    styleUrls: ['./entretien-edit.component.css'],
})
export class EntretienEditComponent implements OnInit, OnDestroy {
    @ViewChild(EntretienFormComponent)
    formComponent!: EntretienFormComponent;

    entretien?: Entretien;
    typesEntretien: TypeEntretien[] = [];
    vehicules: Vehicule[] = [];
    isLoading: boolean = true;
    entretienId: string = '';

    private destroy$ = new Subject<void>();

    constructor(
        private entretienService: EntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        private apollo: Apollo
    ) {}

    ngOnInit(): void {
        this.entretienId = this.route.snapshot.paramMap.get('id') || '';
        console.log('🔍 Edit component initialized with ID:', this.entretienId);

        if (this.entretienId) {
            this.loadEntretien();
        } else {
            this.notificationService.error('Maintenance record ID missing');
            this.router.navigate(['/entretien']);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * ÉTAPE 1 : Charger l'entretien
     */
    loadEntretien(): void {
        console.log('⏳ [1/3] Loading entretien...');

        this.entretienService
            .getEntretienById(this.entretienId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (entretien) => {
                    console.log('✅ [1/3] Entretien loaded:', entretien.id);
                    this.entretien = entretien;
                    this.loadTypesEntretien(); // ← Passer à l'étape 2
                },
                error: (error) => {
                    console.error('❌ [1/3] Error loading entretien:', error);
                    this.isLoading = false;
                    this.notificationService.error('Error loading maintenance record');

                    setTimeout(() => {
                        this.router.navigate(['/entretien']);
                    }, 2000);
                },
            });
    }

    /**
     * ÉTAPE 2 : Charger les types d'entretien
     */
    loadTypesEntretien(): void {
        console.log('⏳ [2/3] Loading types entretien...');

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
                    console.log('✅ [2/3] Types loaded:', result.data.typesEntretien.length);
                    this.typesEntretien = result.data.typesEntretien;
                    this.loadVehicules(); // ← Passer à l'étape 3
                },
                error: (error) => {
                    console.error('❌ [2/3] Error loading types:', error);
                    this.isLoading = false;
                    this.notificationService.error('Error loading maintenance types');
                },
            });
    }

    /**
     * ÉTAPE 3 : Charger les véhicules
     */
    loadVehicules(): void {
        console.log('⏳ [3/3] Loading vehicules...');

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
                    console.log('✅ [3/3] Vehicules loaded:', result.data.vehicules.length);
                    this.vehicules = result.data.vehicules;

                    // ✅ TOUT EST CHARGÉ
                    this.isLoading = false;
                    console.log('🎉 All data loaded successfully!');
                },
                error: (error) => {
                    console.error('❌ [3/3] Error loading vehicules:', error);
                    this.isLoading = false;
                    this.notificationService.error('Error loading vehicles');
                },
            });
    }

    /**
     * Handle form submission
     */
    async onSubmit(input: UpdateEntretienInput): Promise<void> {
        if (!this.entretien) {
            console.error('❌ No entretien to update');
            return;
        }

        console.log('📝 Submitting update:', input);

        const confirmed = await this.notificationService.confirm(
            'Update Maintenance Record',
            'Are you sure you want to update this maintenance record?',
            'Update',
            'Cancel'
        );

        if (!confirmed) {
            if (this.formComponent) {
                this.formComponent.isSubmitting = false;
            }
            return;
        }

        this.notificationService.loading('Updating...');

        this.entretienService
            .updateEntretien(input)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    console.log('✅ Update successful:', result);
                    this.notificationService.closeLoading();
                    this.notificationService.success('Maintenance record updated successfully');
                    this.router.navigate(['/entretien']);
                },
                error: (error) => {
                    console.error('❌ Error updating maintenance record:', error);
                    this.notificationService.closeLoading();

                    if (this.formComponent) {
                        this.formComponent.isSubmitting = false;
                    }

                    this.notificationService.error(
                        error.message || 'Error updating maintenance record'
                    );
                },
            });
    }

    /**
     * Handle form cancellation
     */
    onCancel(): void {
        console.log('❌ Edit cancelled');
        this.router.navigate(['/dashboard/entretien']);
    }
}