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

    loadVehicules(): void {
        this.isLoading.set(true);

        this.vehicleService.getAllVehicles().subscribe({
            next: (vehicles: VehicleModel[]) => {
                const requests = vehicles.map((v: VehicleModel) =>
                    this.carnetService.getEntretiensVehicule(v.id)
                );

                forkJoin(requests).subscribe({
                    next: (allEntretiens: CarnetEntretien[][]) => {
                        const mapped: VehiculeWithEntretiens[] = vehicles.map(
                            (v: VehicleModel, index: number) => ({
                                id: v.id,
                                matricule: v.registrationNumber,
                                marque: v.brand.label,
                                type: v.type,
                                nombreEntretiens: allEntretiens[index].length,
                            })
                        );
                        this.vehicules.set(mapped);
                        this.filteredVehicules.set(mapped);
                        this.isLoading.set(false);
                    },
                    error: (error: any) => {
                        console.error('❌ Error loading counters:', error);
                        const mapped: VehiculeWithEntretiens[] = vehicles.map(
                            (v: VehicleModel) => ({
                                id: v.id,
                                matricule: v.registrationNumber,
                                marque: v.brand.label,
                                type: v.type,
                                nombreEntretiens: 0,
                            })
                        );
                        this.vehicules.set(mapped);
                        this.filteredVehicules.set(mapped);
                        this.isLoading.set(false);
                    },
                });
            },
            error: (error: any) => {
                console.error('❌ Error loading vehicles:', error);
                this.errorMessage.set('Error loading vehicles');
                this.isLoading.set(false);
            },
        });
    }

    onSearch(event: Event): void {
        const term = (event.target as HTMLInputElement).value.toLowerCase().trim();
        this.searchTerm.set(term);

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

    selectVehicule(vehicule: VehiculeWithEntretiens): void {
        this.selectedVehicule.set(vehicule);
        this.isLoadingEntretiens.set(true);

        this.carnetService.getEntretiensVehicule(vehicule.id).subscribe({
            next: (entretiens: CarnetEntretien[]) => {
                this.entretiens.set(entretiens);
                this.isLoadingEntretiens.set(false);

                const updatedVehicules = this.vehicules().map((v) =>
                    v.id === vehicule.id
                        ? { ...v, nombreEntretiens: entretiens.length }
                        : v
                );
                this.vehicules.set(updatedVehicules);
                this.filteredVehicules.set(updatedVehicules);
            },
            error: (error: any) => {
                console.error('❌ Error loading maintenances:', error);
                this.errorMessage.set('Error loading maintenances');
                this.isLoadingEntretiens.set(false);
            },
        });
    }

    openEditModal(entretien: CarnetEntretien): void {
        this.selectedEntretien.set(entretien);
        this.showModal.set(true);
    }

    closeModal(): void {
        this.showModal.set(false);
        this.selectedEntretien.set(null);
    }

    onSaveEntretien(updatedEntretien: CarnetEntretien): void {
        if (this.selectedVehicule()) {
            this.selectVehicule(this.selectedVehicule()!);
        }
        this.closeModal();
    }

    onDeleteEntretien(entretien: CarnetEntretien, event: Event): void {
        event.stopPropagation();
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

    getStatutConfig(statut: string): { label: string; dot: string; badge: string } {
        const configs: Record<string, { label: string; dot: string; badge: string }> = {
            EN_ATTENTE: {
                label: 'Pending',
                dot: 'bg-amber-400',
                badge: 'bg-amber-50 text-amber-700 border border-amber-200',
            },
            EN_COURS: {
                label: 'In Progress',
                dot: 'bg-blue-500',
                badge: 'bg-blue-50 text-blue-700 border border-blue-200',
            },
            TERMINE: {
                label: 'Completed',
                dot: 'bg-emerald-500',
                badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            },
            ANNULE: {
                label: 'Cancelled',
                dot: 'bg-red-500',
                badge: 'bg-red-50 text-red-600 border border-red-200',
            },
        };
        return configs[statut] || {
            label: statut,
            dot: 'bg-gray-400',
            badge: 'bg-gray-50 text-gray-600 border border-gray-200',
        };
    }

    formatDate(date: Date | null): string {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-GB');
    }

    formatCurrency(amount: number | null): string {
        if (amount === null) return '—';
        return new Intl.NumberFormat('fr-TN', {
            style: 'currency',
            currency: 'TND',
            minimumFractionDigits: 3,
        }).format(amount);
    }

    getTotalCoutReel(): number {
        return this.entretiens().reduce((s, e) => s + Number(e.coutReel ?? 0), 0);
    }
}