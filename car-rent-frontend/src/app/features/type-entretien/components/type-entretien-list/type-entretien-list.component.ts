import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TypeEntretien } from '../../models/type-entretien.model';
import { TypeEntretienService } from '../../services/type-entretien.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Component for displaying and managing maintenance types list
 */
@Component({
    selector: 'app-type-entretien-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './type-entretien-list.component.html',
    styleUrls: ['./type-entretien-list.component.css'],
})
export class TypeEntretienListComponent implements OnInit, OnDestroy {
    typesEntretien: TypeEntretien[] = [];
    filteredTypesEntretien: TypeEntretien[] = [];
    isLoading: boolean = false;
    searchTerm: string = '';
    showOnlyMandatory: boolean = false;
    selectedTypeEntretien: TypeEntretien | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private typeEntretienService: TypeEntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.loadTypesEntretien();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all maintenance types
     */
    loadTypesEntretien(): void {
        this.isLoading = true;
        this.typeEntretienService
            .getAllTypesEntretien()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (types) => {
                    this.typesEntretien = types;
                    this.applyFilters();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading maintenance types:', error);
                    this.notificationService.error(
                        'Erreur lors du chargement des types d\'entretien'
                    );
                    this.isLoading = false;
                },
            });
    }

    /**
     * Apply search and filter logic
     */
    applyFilters(): void {
        let filtered = [...this.typesEntretien];

        // Apply search filter
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (type) =>
                    type.codeEntretien.toLowerCase().includes(searchLower) ||
                    type.designation.toLowerCase().includes(searchLower) ||
                    type.description?.toLowerCase().includes(searchLower)
            );
        }

        // Apply mandatory filter
        if (this.showOnlyMandatory) {
            filtered = filtered.filter((type) => type.estObligatoire);
        }

        this.filteredTypesEntretien = filtered;
    }

    /**
     * Handle search input change
     */
    onSearchChange(): void {
        this.applyFilters();
    }

    /**
     * Toggle mandatory filter
     */
    toggleMandatoryFilter(): void {
        this.showOnlyMandatory = !this.showOnlyMandatory;
        this.applyFilters();
    }

    /**
     * Navigate to create new type
     */
    navigateToCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    /**
     * Navigate to edit type
     */
    navigateToEdit(id: string): void {
        this.router.navigate(['edit', id], { relativeTo: this.route });
    }

    /**
     * View type details
     */
    viewDetails(typeEntretien: TypeEntretien): void {
        this.selectedTypeEntretien = typeEntretien;
    }

    /**
     * Close details modal
     */
    closeDetails(): void {
        this.selectedTypeEntretien = null;
    }

    /**
     * Delete a maintenance type
     */
    async deleteTypeEntretien(typeEntretien: TypeEntretien): Promise<void> {
        const confirmed =
            await this.notificationService.confirmDeleteTypeEntretien(
                typeEntretien.designation
            );

        if (!confirmed) return;

        this.notificationService.loading('Suppression en cours...');

        this.typeEntretienService
            .deleteTypeEntretien(typeEntretien.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.closeLoading();
                    this.notificationService.typeEntretienDeleted(
                        typeEntretien.designation
                    );
                    this.loadTypesEntretien();
                },
                error: (error) => {
                    console.error('Error deleting maintenance type:', error);
                    this.notificationService.closeLoading();

                    if (error.message?.includes('en cours d\'utilisation')) {
                        this.notificationService.typeEntretienInUseError();
                    } else {
                        this.notificationService.typeEntretienDeleteError(
                            error.message
                        );
                    }
                },
            });
    }

    /**
     * Format frequency display
     */
    formatFrequency(jours?: number | null, km?: number | null): string {
        const parts: string[] = [];

        if (jours) {
            parts.push(`${jours} jours`);
        }
        if (km) {
            parts.push(`${km.toLocaleString('fr-FR')} km`);
        }

        return parts.length > 0 ? parts.join(' ou ') : 'Non définie';
    }

    /**
     * Format date for display
     */
    formatDate(date: Date): string {
        return formatDistance(new Date(date), new Date(), {
            addSuffix: true,
            locale: fr,
        });
    }

    /**
     * Get badge class for mandatory status
     */
    getMandatoryBadgeClass(estObligatoire: boolean): string {
        return estObligatoire
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800';
    }

    /**
     * Track by function for ngFor optimization
     */
    trackByTypeId(index: number, type: TypeEntretien): string {
        return type.id;
    }
}