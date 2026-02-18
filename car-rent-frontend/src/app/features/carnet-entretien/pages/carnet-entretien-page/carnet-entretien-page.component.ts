import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { VehicleService } from '../../../vehicule/services/vehicle.service';
import { CarnetEntretienService } from '../../services/carnet-entretien.service';
import { CarnetEntretien, VehiculeWithEntretiens } from '../../models/carnet-entretien.model';
import { EntretienDetailModalComponent } from '../../components/entretien-detail-modal/entretien-detail-modal.component';
import { VehicleModel } from '../../../vehicule/models/vehicle.model';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-carnet-entretien-page',
    standalone: true,
    imports: [CommonModule, FormsModule, EntretienDetailModalComponent],
    templateUrl: './carnet-entretien-page.component.html',
    styleUrls: ['./carnet-entretien-page.component.css'],
})
export class CarnetEntretienPageComponent implements OnInit {
    vehicules = signal<VehiculeWithEntretiens[]>([]);
    filteredVehicules = signal<VehiculeWithEntretiens[]>([]);
    selectedVehicule = signal<VehiculeWithEntretiens | null>(null);
    entretiens = signal<CarnetEntretien[]>([]);
    selectedEntretien = signal<CarnetEntretien | null>(null);
    isLoading = signal(false);
    isLoadingEntretiens = signal(false);
    searchTerm = signal('');
    showModal = signal(false);
    errorMessage = signal('');

    constructor(
        private vehicleService: VehicleService,
        private carnetService: CarnetEntretienService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadVehicules();
    }

    /**
     * Load all vehicles with their maintenance count
     */
    loadVehicules(): void {
        this.isLoading.set(true);
        console.log('🔄 FRONTEND: Loading vehicles...');

        this.vehicleService.getAllVehicles().subscribe({
            next: (vehicles: VehicleModel[]) => {
                console.log('✅ FRONTEND: Vehicles received:', vehicles.length);

                // Create a request for each vehicle to count its maintenances
                const requests = vehicles.map((v: VehicleModel) =>
                    this.carnetService.getEntretiensVehicule(v.id)
                );

                // Execute all requests in parallel
                forkJoin(requests).subscribe({
                    next: (allEntretiens: CarnetEntretien[][]) => {
                        const mapped: VehiculeWithEntretiens[] = vehicles.map((v: VehicleModel, index: number) => ({
                            id: v.id,
                            matricule: v.registrationNumber,
                            marque: v.brand.label,
                            type: v.type,
                            nombreEntretiens: allEntretiens[index].length,
                        }));

                        console.log('✅ FRONTEND: Vehicles with counters:', mapped);
                        this.vehicules.set(mapped);
                        this.filteredVehicules.set(mapped);
                        this.isLoading.set(false);
                    },
                    error: (error: any) => {
                        console.error('❌ FRONTEND: Error loading counters:', error);
                        // On error, still display vehicles with 0 maintenances
                        const mapped: VehiculeWithEntretiens[] = vehicles.map((v: VehicleModel) => ({
                            id: v.id,
                            matricule: v.registrationNumber,
                            marque: v.brand.label,
                            type: v.type,
                            nombreEntretiens: 0,
                        }));
                        this.vehicules.set(mapped);
                        this.filteredVehicules.set(mapped);
                        this.isLoading.set(false);
                    },
                });
            },
            error: (error: any) => {
                console.error('❌ FRONTEND: Error loading vehicles:', error);
                this.errorMessage.set('Error loading vehicles');
                this.isLoading.set(false);
            },
        });
    }

    /**
     * Search for a vehicle
     */
    onSearch(): void {
        const term = this.searchTerm().toLowerCase();
        if (!term) {
            this.filteredVehicules.set(this.vehicules());
            return;
        }

        const filtered = this.vehicules().filter(
            (v) =>
                v.matricule.toLowerCase().includes(term) ||
                v.marque.toLowerCase().includes(term) ||
                v.type.toLowerCase().includes(term)
        );
        this.filteredVehicules.set(filtered);
    }

    /**
     * Select a vehicle and load its maintenances
     */
    selectVehicule(vehicule: VehiculeWithEntretiens): void {
        console.log('🔍 FRONTEND: Selecting vehicle:', vehicule);
        console.log('🔍 FRONTEND: vehiculeId =', vehicule.id);

        this.selectedVehicule.set(vehicule);
        this.isLoadingEntretiens.set(true);

        this.carnetService.getEntretiensVehicule(vehicule.id).subscribe({
            next: (entretiens: CarnetEntretien[]) => {
                console.log('✅ FRONTEND: Maintenances received:', entretiens);
                console.log('✅ FRONTEND: Number of maintenances:', entretiens.length);

                this.entretiens.set(entretiens);
                this.isLoadingEntretiens.set(false);

                // Update the maintenance count
                const updatedVehicules = this.vehicules().map((v) =>
                    v.id === vehicule.id ? { ...v, nombreEntretiens: entretiens.length } : v
                );
                this.vehicules.set(updatedVehicules);
                this.filteredVehicules.set(updatedVehicules);
            },
            error: (error: any) => {
                console.error('❌ FRONTEND: Error loading maintenances:', error);
                console.error('❌ FRONTEND: Error details:', JSON.stringify(error, null, 2));
                this.errorMessage.set('Error loading maintenances');
                this.isLoadingEntretiens.set(false);
            },
        });
    }

    /**
     * Open the edit modal
     */
    openEditModal(entretien: CarnetEntretien): void {
        this.selectedEntretien.set(entretien);
        this.showModal.set(true);
    }

    /**
     * Close the modal
     */
    closeModal(): void {
        this.showModal.set(false);
        this.selectedEntretien.set(null);
    }

    /**
     * Save changes
     */
    onSaveEntretien(updatedEntretien: CarnetEntretien): void {
        // Reload maintenances
        if (this.selectedVehicule()) {
            this.selectVehicule(this.selectedVehicule()!);
        }
        this.closeModal();
    }

    /**
     * Delete a maintenance record
     */
    onDeleteEntretien(entretien: CarnetEntretien): void {
        Swal.fire({
            title: 'Delete this maintenance?',
            html: `Are you sure you want to delete maintenance <strong>${entretien.codeEntretien}</strong>?<br>This action is irreversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rentix-popup',
                title: 'rentix-title',
                confirmButton: 'rentix-confirm-btn',
                cancelButton: 'rentix-cancel-btn',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                this.carnetService.deleteEntretien(entretien.id).subscribe({
                    next: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The maintenance record has been deleted successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'rentix-popup',
                                title: 'rentix-title',
                                confirmButton: 'rentix-confirm-btn',
                            },
                            buttonsStyling: false,
                            timer: 3000,
                        });
                        // Reload
                        if (this.selectedVehicule()) {
                            this.selectVehicule(this.selectedVehicule()!);
                        }
                    },
                    error: (error: any) => {
                        console.error('Delete error:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Unable to delete the maintenance record.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'rentix-popup',
                                title: 'rentix-title',
                                confirmButton: 'rentix-confirm-btn',
                            },
                            buttonsStyling: false,
                        });
                    },
                });
            }
        });
    }

    /**
     * Get the status CSS class
     */
    getStatutClass(statut: string): string {
        const classes: Record<string, string> = {
            EN_ATTENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500',
            EN_COURS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500',
            TERMINE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500',
            ANNULE: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500',
        };
        return classes[statut] || 'bg-gray-100 text-gray-800';
    }

    /**
     * Format a date
     */
    formatDate(date: Date | null): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-GB');
    }

    /**
     * Format a currency amount
     */
    formatCurrency(amount: number | null): string {
        if (amount === null) return '-';
        return new Intl.NumberFormat('fr-TN', {
            style: 'currency',
            currency: 'TND',
            minimumFractionDigits: 3,
        }).format(amount);
    }
}