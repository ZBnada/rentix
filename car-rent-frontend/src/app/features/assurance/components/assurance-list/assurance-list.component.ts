import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AssuranceUtils } from '../../models/assurance-config.model';
import { AssuranceService, Assurance } from '../../services/assurance.service';

/**
 * Composant de liste des assurances
 */
@Component({
    selector: 'app-assurance-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './assurance-list.component.html',
})
export class AssuranceListComponent implements OnInit {
    // Signaux pour la réactivité
    assurances = signal<Assurance[]>([]);
    searchTerm = signal<string>('');
    filterStatus = signal<'all' | 'active' | 'expiring' | 'expired'>('all');
    isLoading = signal<boolean>(false);

    // Utilitaires
    AssuranceUtils = AssuranceUtils;

    // Liste filtrée (computed)
    filteredAssurances = computed(() => {
        let filtered = this.assurances();

        // Filtre par recherche
        const term = this.searchTerm().toLowerCase();
        if (term) {
            filtered = filtered.filter(
                (assurance) =>
                    assurance.prestataire.toLowerCase().includes(term) ||
                    assurance.numeroPolice?.toLowerCase().includes(term) ||
                    (assurance.vehicule?.immatriculation || '').toLowerCase().includes(term),
            );
        }

        // Filtre par statut
        const status = this.filterStatus();
        if (status === 'active') {
            filtered = filtered.filter(
                (a) => !AssuranceUtils.isExpired(a) && !AssuranceUtils.isExpiringSoon(a),
            );
        } else if (status === 'expiring') {
            filtered = filtered.filter((a) => AssuranceUtils.isExpiringSoon(a));
        } else if (status === 'expired') {
            filtered = filtered.filter((a) => AssuranceUtils.isExpired(a));
        }

        return filtered;
    });

    // Statistiques (computed)
    stats = computed(() => {
        const all = this.assurances();
        return {
            total: all.length,
            active: all.filter(
                (a) => !AssuranceUtils.isExpired(a) && !AssuranceUtils.isExpiringSoon(a),
            ).length,
            expiring: all.filter((a) => AssuranceUtils.isExpiringSoon(a)).length,
            expired: all.filter((a) => AssuranceUtils.isExpired(a)).length,
        };
    });

    constructor(private assuranceService: AssuranceService) {}

    ngOnInit(): void {
        this.loadAssurances();
    }

    /**
     * Charger toutes les assurances
     */
    loadAssurances(): void {
        this.isLoading.set(true);

        this.assuranceService.findAllAssurances().subscribe({
            next: (data) => {
                console.log('✅ Assurances chargées:', data);
                this.assurances.set(data);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('❌ Erreur chargement assurances:', error);
                console.error('Détails:', error.error);
                this.isLoading.set(false);

                // Message d'erreur plus détaillé
                const errorMessage = error.error?.message || error.message || 'Impossible de charger les assurances';
                this.showError(`Erreur: ${errorMessage}`);
            },
        });
    }

    /**
     * Rechercher des assurances
     */
    onSearch(term: string): void {
        this.searchTerm.set(term);
    }

    /**
     * Changer le filtre de statut
     */
    onFilterChange(status: 'all' | 'active' | 'expiring' | 'expired'): void {
        this.filterStatus.set(status);
    }

    /**
     * Obtenir l'immatriculation du véhicule (avec fallback)
     */
    getVehiculeInfo(assurance: Assurance): string {
        if (assurance.vehicule?.immatriculation) {
            return `${assurance.vehicule.immatriculation} - ${assurance.vehicule.marque || ''} ${assurance.vehicule.modele || ''}`;
        }
        return `Véhicule ID: ${assurance.vehiculeId}`;
    }

    /**
     * Supprimer une assurance
     */
    async deleteAssurance(id: string, prestataire: string): Promise<void> {
        const result = await Swal.fire({
            title: 'Confirmer la suppression',
            html: `Êtes-vous sûr de vouloir supprimer l'assurance <strong>${prestataire}</strong> ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            customClass: {
                popup: 'rentix-popup',
                title: 'rentix-title',
                confirmButton: 'rentix-confirm-btn',
                cancelButton: 'rentix-cancel-btn',
            },
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            this.assuranceService.deleteAssurance(id).subscribe({
                next: () => {
                    this.showSuccess('Assurance supprimée avec succès');
                    this.loadAssurances();
                },
                error: (error) => {
                    console.error('Erreur suppression:', error);
                    this.showError('Erreur lors de la suppression');
                },
            });
        }
    }

    /**
     * Afficher un message de succès
     */
    private showSuccess(message: string): void {
        Swal.fire({
            title: 'Succès',
            text: message,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            customClass: {
                popup: 'rentix-popup',
                title: 'rentix-title',
            },
        });
    }

    /**
     * Afficher un message d'erreur
     */
    private showError(message: string): void {
        Swal.fire({
            title: 'Erreur',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'rentix-popup',
                title: 'rentix-title',
                confirmButton: 'rentix-confirm-btn',
            },
            buttonsStyling: false,
        });
    }
}