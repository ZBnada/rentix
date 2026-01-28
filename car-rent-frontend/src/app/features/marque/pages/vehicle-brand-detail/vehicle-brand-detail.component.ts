// ==========================================
// 📁 src/app/features/vehicle-brand/pages/vehicle-brand-detail/vehicle-brand-detail.component.ts
// ==========================================

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { VehicleBrandService } from '../../services/vehicle-brand.service';
import { VehicleBrandModel } from '../../models/vehicle-brand.model';

/**
 * Vehicle Brand Detail Page Component
 * Displays detailed information about a single vehicle brand
 */
@Component({
    selector: 'app-vehicle-brand-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vehicle-brand-detail.component.html',
    styleUrls: ['./vehicle-brand-detail.component.css']
})
export class VehicleBrandDetailComponent implements OnInit, OnDestroy {
    brand = signal<VehicleBrandModel | null>(null);
    isLoading = signal(false);
    errorMessage = signal('');

    private readonly destroySubject = new Subject<void>();

    constructor(
        private readonly vehicleBrandService: VehicleBrandService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        const brandId = this.route.snapshot.paramMap.get('id');

        if (brandId) {
            this.loadBrandDetail(brandId);
        } else {
            this.router.navigate(['/dashboard/vehicle-brands']);
        }
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    /**
     * Load brand details
     */
    loadBrandDetail(id: string): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.vehicleBrandService
            .getBrandById(id)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (brandData) => {
                    this.brand.set(brandData);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('[VehicleBrandDetail] Error loading brand:', error);
                    this.errorMessage.set('Brand not found');
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Navigate to edit page
     */
    onEdit(): void {
        const currentBrand = this.brand();
        if (currentBrand) {
            this.router.navigate(['/dashboard/vehicle-brands/edit', currentBrand.id]);
        }
    }

    /**
     * Navigate back to list
     */
    onBack(): void {
        this.router.navigate(['/dashboard/vehicle-brands']);
    }

    /**
     * Delete brand
     */
    onDelete(): void {
        const currentBrand = this.brand();
        if (!currentBrand) return;

        Swal.fire({
            title: 'Delete Brand?',
            html: `Are you sure you want to delete <strong>${currentBrand.label}</strong>?<br>This action cannot be undone.`,
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
                this.performDelete(currentBrand.id, currentBrand.label);
            }
        });
    }

    /**
     * Perform delete operation
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
                        timer: 2000
                    });
                    this.router.navigate(['/dashboard/vehicle-brands']);
                },
                error: (error) => {
                    console.error('[VehicleBrandDetail] Error deleting brand:', error);
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
        return format(new Date(date), 'MMMM dd, yyyy \'at\' HH:mm', { locale: enUS });
    }

    /**
     * Sanitize image URL for security
     */
    getSafeImageUrl(url: string | undefined): SafeUrl | null {
        if (!url) return null;
        return this.sanitizer.sanitize(1, url) ? url : null;
    }
}