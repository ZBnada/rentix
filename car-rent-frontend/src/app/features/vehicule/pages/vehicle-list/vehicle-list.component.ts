import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleModel, getVehicleClassLabel, getEnergyTypeLabel } from '../../models/vehicle.model';

@Component({
    selector: 'app-vehicle-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
    vehicles = signal<VehicleModel[]>([]);
    filteredVehicles = signal<VehicleModel[]>([]);
    searchTerm = signal('');
    isLoading = signal(false);
    errorMessage = signal('');
    viewMode = signal<'grid' | 'table'>('table');

    private readonly destroySubject = new Subject<void>();

    constructor(
        private readonly vehicleService: VehicleService,
        private readonly router: Router,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.loadVehicles();
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    loadVehicles(): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.vehicleService
            .getAllVehicles()
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (vehiclesData) => {
                    this.vehicles.set(vehiclesData);
                    this.filteredVehicles.set(vehiclesData);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('[VehicleList] Error loading vehicles:', error);
                    this.errorMessage.set('Failed to load vehicles');
                    this.isLoading.set(false);
                }
            });
    }

    onSearch(event: Event): void {
        const term = (event.target as HTMLInputElement).value.toLowerCase().trim();
        this.searchTerm.set(term);

        if (!term) {
            this.filteredVehicles.set(this.vehicles());
            return;
        }

        const filtered = this.vehicles().filter(vehicle =>
            vehicle.registrationNumber.toLowerCase().includes(term) ||
            vehicle.brand.label.toLowerCase().includes(term) ||
            vehicle.type.toLowerCase().includes(term) ||
            vehicle.color?.toLowerCase().includes(term)
        );

        this.filteredVehicles.set(filtered);
    }

    toggleViewMode(): void {
        this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
    }

    onCreateVehicle(): void {
        this.router.navigate(['/dashboard/vehicles/create']);
    }

    onEditVehicle(vehicleId: string): void {
        this.router.navigate(['/dashboard/vehicles/edit', vehicleId]);
    }

    onViewVehicle(vehicleId: string): void {
        this.router.navigate(['/dashboard/vehicles', vehicleId]);
    }

    onDeleteVehicle(vehicleId: string, registrationNumber: string, event: Event): void {
        event.stopPropagation();
        Swal.fire({
            title: 'Delete Vehicle?',
            html: `Are you sure you want to delete vehicle <strong>${registrationNumber}</strong>?<br>This action cannot be undone.`,
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
                this.performDelete(vehicleId, registrationNumber);
            }
        });
    }

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
                        timer: 3000
                    });
                    this.loadVehicles();
                },
                error: (error) => {
                    console.error('[VehicleList] Error deleting vehicle:', error);
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

    getTotalDailyPrice(): number {
        return this.filteredVehicles().reduce((s, v) => s + Number(v.dailyRentalPrice), 0);
    }

    formatDate(date: Date): string {
        return format(new Date(date), 'MMM dd, yyyy', { locale: enUS });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-TN', {
            style: 'currency',
            currency: 'TND',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).format(amount);
    }

    getClassLabel(vehicleClass: any): string {
        return getVehicleClassLabel(vehicleClass);
    }

    getEnergyLabel(energy: any): string {
        return getEnergyTypeLabel(energy);
    }

    getSafeImageUrl(url: string | null | undefined): SafeUrl | null {
        if (!url) return null;
        return this.sanitizer.sanitize(1, url) ? url : null;
    }

    trackByVehicleId(index: number, vehicle: VehicleModel): string {
        return vehicle.id;
    }
}