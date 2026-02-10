import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Entretien } from '../../models/entretien.model';
import { EntretienService } from '../../services/entretien.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatDistance } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Component for displaying and managing maintenance records list
 */
@Component({
    selector: 'app-entretien-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './entretien-list.component.html',
    styleUrls: ['./entretien-list.component.css'],
})
export class EntretienListComponent implements OnInit, OnDestroy {
    entretiens: Entretien[] = [];
    filteredEntretiens: Entretien[] = [];
    paginatedEntretiens = signal<Entretien[]>([]);
    isLoading: boolean = false;
    searchTerm: string = '';
    selectedStatus: string = '';
    selectedEntretien: Entretien | null = null;

    // Pagination
    currentPage = signal<number>(1);
    itemsPerPage = signal<number>(10);
    totalItems = signal<number>(0);

    // Expose Math to template
    protected readonly Math = Math;

    // Computed values
    totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

    statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'TERMINE', label: 'Completed' },
        { value: 'EN_COURS', label: 'In Progress' },
        { value: 'PLANIFIE', label: 'Planned' },
        { value: 'ANNULE', label: 'Cancelled' },
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private entretienService: EntretienService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.loadEntretiens();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all maintenance records
     */
    loadEntretiens(): void {
        this.isLoading = true;
        this.entretienService
            .getAllEntretiens()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (entretiens) => {
                    console.log('✅ Entretiens loaded:', entretiens.length);
                    this.entretiens = entretiens;
                    this.applyFilters();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('❌ Error loading maintenance records:', error);
                    console.error('❌ Error details:', error.message);
                    this.notificationService.error(
                        'Error loading maintenance records'
                    );
                    this.isLoading = false;
                },
            });
    }

    /**
     * Apply search and filter logic
     */
    applyFilters(): void {
        let filtered = [...this.entretiens];

        // Apply search filter
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (entretien) =>
                    entretien.vehicule?.matricule
                        .toLowerCase()
                        .includes(searchLower) ||
                    entretien.typeEntretien?.designation
                        .toLowerCase()
                        .includes(searchLower) ||
                    entretien.typeEntretien?.codeEntretien
                        .toLowerCase()
                        .includes(searchLower) ||
                    entretien.observations?.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (this.selectedStatus) {
            filtered = filtered.filter(
                (entretien) => entretien.etat === this.selectedStatus
            );
        }

        this.filteredEntretiens = filtered;
        this.totalItems.set(filtered.length);

        // Reset to first page when filters change
        this.currentPage.set(1);

        // Apply pagination
        this.updatePagination();
    }

    /**
     * Update pagination
     */
    updatePagination(): void {
        const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
        const endIndex = startIndex + this.itemsPerPage();
        this.paginatedEntretiens.set(
            this.filteredEntretiens.slice(startIndex, endIndex)
        );
    }

    /**
     * Handle search input change
     */
    onSearchChange(): void {
        this.applyFilters();
    }

    /**
     * Handle status filter change
     */
    onStatusFilterChange(): void {
        this.applyFilters();
    }

    /**
     * Navigate to page
     */
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
            this.updatePagination();
        }
    }

    /**
     * Go to previous page
     */
    previousPage(): void {
        if (this.currentPage() > 1) {
            this.goToPage(this.currentPage() - 1);
        }
    }

    /**
     * Go to next page
     */
    nextPage(): void {
        if (this.currentPage() < this.totalPages()) {
            this.goToPage(this.currentPage() + 1);
        }
    }

    /**
     * Navigate to create new maintenance record
     */
    navigateToCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    /**
     * Navigate to edit maintenance record
     */
    navigateToEdit(id: string): void {
        this.router.navigate(['edit', id], { relativeTo: this.route });
    }

    /**
     * Navigate to vehicle history
     */
    navigateToVehicleHistory(vehiculeId: string): void {
        this.router.navigate(['vehicle-history', vehiculeId], {
            relativeTo: this.route,
        });
    }

    /**
     * View maintenance record details
     */
    viewDetails(entretien: Entretien): void {
        this.selectedEntretien = entretien;
    }

    /**
     * Close details modal
     */
    closeDetails(): void {
        this.selectedEntretien = null;
    }

    /**
     * Delete a maintenance record
     */
    async deleteEntretien(entretien: Entretien): Promise<void> {
        const confirmed = await this.notificationService.confirm(
            'Delete Maintenance Record',
            `Are you sure you want to delete this maintenance record for ${entretien.vehicule?.matricule}?`,
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
                    this.notificationService.success('Maintenance record deleted successfully');
                    this.loadEntretiens();
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
     * Export to PDF
     */
    exportToPDF(): void {
        if (this.filteredEntretiens.length === 0) {
            this.notificationService.warning('No records to export');
            return;
        }

        try {
            this.entretienService.exportToPDF(this.filteredEntretiens);
            this.notificationService.success('PDF exported successfully');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.notificationService.error('Error exporting PDF');
        }
    }

    /**
     * Format date for display
     */
    formatDate(date: string): string {
        if (!date) {
            return 'N/A';
        }

        try {
            // Si la date est au format YYYY-MM-DD, ajouter l'heure par défaut
            // pour éviter les problèmes de timezone
            const dateStr = date.includes('T') ? date : `${date}T12:00:00`;
            const parsedDate = new Date(dateStr);

            // Vérifier que la date est valide
            if (isNaN(parsedDate.getTime())) {
                console.error('Invalid date:', date);
                return 'Invalid date';
            }

            return formatDistance(parsedDate, new Date(), {
                addSuffix: true,
                locale: enUS,
            });
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
        const option = this.statusOptions.find((s) => s.value === status);
        return option?.label || status;
    }

    /**
     * Get count by status
     */
    getCountByStatus(status: string): number {
        return this.entretiens.filter(e => e.etat === status).length;
    }

    /**
     * Track by function for ngFor optimization
     */
    trackByEntretienId(index: number, entretien: Entretien): string {
        return entretien.id;
    }
}