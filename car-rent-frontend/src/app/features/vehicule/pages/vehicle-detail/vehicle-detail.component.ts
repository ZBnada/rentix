import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleModel, getVehicleClassLabel, getEnergyTypeLabel } from '../../models/vehicle.model';

/**
 * Vehicle Detail Page Component
 * Displays detailed information about a single vehicle
 */
@Component({
    selector: 'app-vehicle-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vehicle-detail.component.html',
    styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit, OnDestroy {
    vehicle = signal<VehicleModel | null>(null);
    isLoading = signal(false);
    errorMessage = signal('');

    private readonly destroySubject = new Subject<void>();

    constructor(
        private readonly vehicleService: VehicleService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        const vehicleId = this.route.snapshot.paramMap.get('id');

        if (vehicleId) {
            this.loadVehicleDetail(vehicleId);
        } else {
            this.router.navigate(['/dashboard/vehicles']);
        }
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    /**
     * Load vehicle details
     */
    loadVehicleDetail(id: string): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.vehicleService
            .getVehicleById(id)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (vehicleData) => {
                    this.vehicle.set(vehicleData);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('[VehicleDetail] Error loading vehicle:', error);
                    this.errorMessage.set('Vehicle not found');
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Navigate to edit page
     */
    onEdit(): void {
        const currentVehicle = this.vehicle();
        if (currentVehicle) {
            this.router.navigate(['/dashboard/vehicles/edit', currentVehicle.id]);
        }
    }

    /**
     * Navigate back to list
     */
    onBack(): void {
        this.router.navigate(['/dashboard/vehicles']);
    }

    /**
     * Delete vehicle
     */
    onDelete(): void {
        const currentVehicle = this.vehicle();
        if (!currentVehicle) return;

        Swal.fire({
            title: 'Delete Vehicle?',
            html: `Are you sure you want to delete vehicle <strong>${currentVehicle.registrationNumber}</strong>?<br>This action cannot be undone.`,
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
                this.performDelete(currentVehicle.id, currentVehicle.registrationNumber);
            }
        });
    }

    /**
     * Perform delete operation
     */
    private performDelete(vehicleId: string, registrationNumber: string): void {
        this.vehicleService
            .deleteVehicle(vehicleId)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: `Vehicle ${registrationNumber} has been deleted successfully.`,
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
                    this.router.navigate(['/dashboard/vehicles']);
                },
                error: (error) => {
                    console.error('[VehicleDetail] Error deleting vehicle:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete the vehicle. Please try again.',
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
     * Format date
     */
    formatDate(date: Date): string {
        return format(new Date(date), 'MMMM dd, yyyy \'at\' HH:mm', { locale: enUS });
    }

    /**
     * Format simple date
     */
    formatSimpleDate(date: Date): string {
        return format(new Date(date), 'MMM dd, yyyy', { locale: enUS });
    }

    /**
     * Format currency
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-TN', {
            style: 'currency',
            currency: 'TND',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).format(amount);
    }

    /**
     * Get vehicle class label
     */
    getClassLabel(vehicleClass: any): string {
        return getVehicleClassLabel(vehicleClass);
    }

    /**
     * Get energy type label
     */
    getEnergyLabel(energy: any): string {
        return getEnergyTypeLabel(energy);
    }

    /**
     * Sanitize image URL
     */
    getSafeImageUrl(url: string | null | undefined): SafeUrl | null {
        if (!url) return null;
        return this.sanitizer.sanitize(1, url) ? url : null;
    }

    /**
     * Get equipment list
     */
    getEquipmentList(): { label: string; value: boolean }[] {
        const v = this.vehicle();
        if (!v) return [];

        return [
            { label: 'Spare Wheel', value: v.spareWheel },
            { label: 'Jack & Handle', value: v.jackHandle },
            { label: 'Cover Set', value: v.coverSet },
            { label: 'Baby Seat', value: v.babySeat },
            { label: 'Carpet Set', value: v.carpetSet },
            { label: 'Radio', value: v.radio },
            { label: 'Hubcap Set', value: v.hubcapSet },
        ];
    }
}