// ==========================================
// 📁 src/app/features/vehicle-brand/pages/vehicle-brand-list/vehicle-brand-list.component.ts
// ==========================================

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { VehicleBrandService } from '../../services/vehicle-brand.service';
import { VehicleBrandModel } from '../../models/vehicle-brand.model';

/**
 * Vehicle Brand List Page Component
 * Displays all vehicle brands in a responsive grid
 */
@Component({
    selector: 'app-vehicle-brand-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './vehicle-brand-list.component.html',
    styleUrls: ['./vehicle-brand-list.component.css']
})
export class VehicleBrandListComponent implements OnInit, OnDestroy {
    brands = signal<VehicleBrandModel[]>([]);
    filteredBrands = signal<VehicleBrandModel[]>([]);
    searchTerm = signal('');
    isLoading = signal(false);
    errorMessage = signal('');

    private readonly destroySubject = new Subject<void>();

    constructor(
        private readonly vehicleBrandService: VehicleBrandService,
        private readonly router: Router,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.loadBrands();
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    /**
     * Load all vehicle brands
     */
    loadBrands(): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.vehicleBrandService
            .getAllBrands()
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (brandsData) => {
                    this.brands.set(brandsData);
                    this.filteredBrands.set(brandsData);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('[VehicleBrandList] Error loading brands:', error);
                    this.errorMessage.set('Failed to load vehicle brands');
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Search brands by label or description
     */
    onSearch(): void {
        const term = this.searchTerm().toLowerCase().trim();

        if (!term) {
            this.filteredBrands.set(this.brands());
            return;
        }

        const filtered = this.brands().filter(brand =>
            brand.label.toLowerCase().includes(term) ||
            brand.description?.toLowerCase().includes(term)
        );

        this.filteredBrands.set(filtered);
    }

    /**
     * Navigate to create brand page
     */
    onCreateBrand(): void {
        this.router.navigate(['/dashboard/vehicle-brands/create']);
    }

    /**
     * Navigate to edit brand page
     */
    onEditBrand(brandId: string): void {
        this.router.navigate(['/dashboard/vehicle-brands/edit', brandId]);
    }

    /**
     * Navigate to brand detail page
     */
    onViewBrand(brandId: string): void {
        this.router.navigate(['/dashboard/vehicle-brands', brandId]);
    }

    /**
     * Delete a vehicle brand
     */
    onDeleteBrand(brandId: string, brandLabel: string): void {
        Swal.fire({
            title: 'Delete Brand?',
            html: `Are you sure you want to delete <strong>${brandLabel}</strong>?<br>This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rentix-popup',
                title: 'rentix-title',
                confirmButton: 'rentix-confirm-btn',
                cancelButton: 'rentix-cancel-btn'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                this.performDelete(brandId, brandLabel);
            }
        });
    }

    /**
     * Perform the delete operation
     */
    private performDelete(brandId: string, brandLabel: string): void {
        this.vehicleBrandService
            .deleteBrand(brandId)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: `${brandLabel} has been deleted successfully.`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rentix-popup',
                            title: 'rentix-title',
                            confirmButton: 'rentix-confirm-btn'
                        },
                        buttonsStyling: false,
                        timer: 3000
                    });
                    this.loadBrands();
                },
                error: (error) => {
                    console.error('[VehicleBrandList] Error deleting brand:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete the brand. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rentix-popup',
                            title: 'rentix-title',
                            confirmButton: 'rentix-confirm-btn'
                        },
                        buttonsStyling: false
                    });
                }
            });
    }

    /**
     * Format date using date-fns
     */
    formatDate(date: Date): string {
        return format(new Date(date), 'MMM dd, yyyy', { locale: enUS });
    }

    /**
     * Track by function for ngFor optimization
     */
    trackByBrandId(index: number, brand: VehicleBrandModel): string {
        return brand.id;
    }

    /**
     * Sanitize image URL for security
     */
    getSafeImageUrl(url: string | undefined): SafeUrl | null {
        if (!url) return null;
        return this.sanitizer.sanitize(1, url) ? url : null;
    }
}