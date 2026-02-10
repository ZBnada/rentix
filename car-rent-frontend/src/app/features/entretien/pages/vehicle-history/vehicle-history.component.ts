import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Entretien, Vehicule } from '../../models/entretien.model';
import { EntretienService } from '../../services/entretien.service';
import { NotificationService } from '@core/services/notification.service';
import { Apollo, gql } from 'apollo-angular';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Component for viewing vehicle maintenance history
 * ✅ CORRECTION: Gestion des dates au format YYYY-MM-DD du backend
 */
@Component({
    selector: 'app-vehicle-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vehicle-history.component.html',
    styleUrls: ['./vehicle-history.component.css'],
})
export class VehicleHistoryComponent implements OnInit, OnDestroy {
    vehicule?: Vehicule;
    entretiens: Entretien[] = [];
    isLoading: boolean = true;
    vehiculeId: string = '';
    totalCost: number = 0;

    // Statistics
    stats = {
        totalRecords: 0,
        totalCost: 0,
        averageCost: 0,
        completedRecords: 0,
    };

    private destroy$ = new Subject<void>();

    constructor(
        private entretienService: EntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        private apollo: Apollo
    ) {}

    ngOnInit(): void {
        this.vehiculeId = this.route.snapshot.paramMap.get('vehiculeId') || '';
        if (this.vehiculeId) {
            this.loadVehicleHistory();
        } else {
            this.notificationService.error('Vehicle ID missing');
            this.router.navigate(['/entretien']);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load vehicle history data
     */
    loadVehicleHistory(): void {
        this.isLoading = true;

        const vehiculeQuery = this.apollo.watchQuery<{ vehicule: Vehicule }>({
            query: gql`
                query GetVehiculeById($id: String!) {
                    vehicule(id: $id) {
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
            variables: { id: this.vehiculeId },
        }).valueChanges;

        const entretiensQuery =
            this.entretienService.getEntretiensByVehicule(this.vehiculeId);

        const costQuery =
            this.entretienService.calculerCoutTotalParVehicule(this.vehiculeId);

        forkJoin({
            vehicule: vehiculeQuery,
            entretiens: entretiensQuery,
            totalCost: costQuery,
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ vehicule, entretiens, totalCost }) => {
                    this.vehicule = vehicule.data.vehicule;
                    this.entretiens = entretiens;
                    this.totalCost = totalCost;
                    this.calculateStats();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading vehicle history:', error);
                    this.notificationService.error('Error loading vehicle history');
                    this.router.navigate(['/entretien']);
                },
            });
    }

    /**
     * Calculate statistics
     */
    calculateStats(): void {
        this.stats.totalRecords = this.entretiens.length;
        this.stats.totalCost = this.entretiens.reduce(
            (sum, e) => sum + e.coutTotal,
            0
        );
        this.stats.averageCost =
            this.stats.totalRecords > 0
                ? this.stats.totalCost / this.stats.totalRecords
                : 0;
        this.stats.completedRecords = this.entretiens.filter(
            (e) => e.etat === 'TERMINE'
        ).length;
    }

    /**
     * Navigate back to list
     */
    goBack(): void {
        this.router.navigate(['/entretien']);
    }

    /**
     * Navigate to edit
     */
    navigateToEdit(id: string): void {
        this.router.navigate(['/entretien/edit', id]);
    }

    /**
     * Export to PDF
     */
    exportToPDF(): void {
        if (!this.vehicule || this.entretiens.length === 0) {
            this.notificationService.warning('No data to export');
            return;
        }

        try {
            this.entretienService.exportVehicleHistoryToPDF(
                this.vehicule,
                this.entretiens
            );
            this.notificationService.success('PDF exported successfully');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.notificationService.error('Error exporting PDF');
        }
    }

    /**
     * Delete maintenance record
     */
    async deleteEntretien(entretien: Entretien): Promise<void> {
        const confirmed = await this.notificationService.confirm(
            'Delete Maintenance Record',
            `Are you sure you want to delete this maintenance record?`,
            'Delete',
            'Cancel'
        );

        if (!confirmed) return;

        this.notificationService.loading('Deleting...');

        this.entretienService
            .deleteEntretien(entretien.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.closeLoading();
                    this.notificationService.success(
                        'Maintenance record deleted successfully'
                    );
                    this.loadVehicleHistory();
                },
                error: (error) => {
                    console.error('Error deleting maintenance record:', error);
                    this.notificationService.closeLoading();
                    this.notificationService.error(
                        error.message || 'Error deleting maintenance record'
                    );
                },
            });
    }

    /**
     * Format date
     * ✅ CORRECTION: Gérer les dates au format YYYY-MM-DD
     */
    formatDate(date: string): string {
        if (!date) {
            return 'N/A';
        }

        try {
            // Si la date est au format YYYY-MM-DD, ajouter l'heure par défaut
            const dateStr = date.includes('T') ? date : `${date}T12:00:00`;
            const parsedDate = new Date(dateStr);

            // Vérifier que la date est valide
            if (isNaN(parsedDate.getTime())) {
                console.error('Invalid date:', date);
                return 'Invalid date';
            }

            return format(parsedDate, 'PPP', { locale: enUS });
        } catch (error) {
            console.error('Error formatting date:', date, error);
            return 'Invalid date';
        }
    }

    /**
     * Get status badge class
     */
    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'TERMINE':
                return 'bg-green-100 text-green-800';
            case 'EN_COURS':
                return 'bg-yellow-100 text-yellow-800';
            case 'PLANIFIE':
                return 'bg-blue-100 text-blue-800';
            case 'ANNULE':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    /**
     * Get status label
     */
    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            TERMINE: 'Completed',
            EN_COURS: 'In Progress',
            PLANIFIE: 'Planned',
            ANNULE: 'Cancelled',
        };
        return labels[status] || status;
    }

    /**
     * Track by function
     */
    trackByEntretienId(index: number, entretien: Entretien): string {
        return entretien.id;
    }
}