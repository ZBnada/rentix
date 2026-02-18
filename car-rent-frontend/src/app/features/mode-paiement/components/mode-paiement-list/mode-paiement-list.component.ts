import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
    ModePaiementType,
    ModePaiementUtils,
} from '../../models/mode-paiement-config.model';
import { ModePaiementService, ModePaiement } from '../../services/mode-paiement.service';

/**
 * Composant de liste des modes de paiement
 */
@Component({
    selector: 'app-mode-paiement-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './mode-paiement-list.component.html',
})
export class ModePaiementListComponent implements OnInit {
    // Signaux pour la réactivité
    modesPaiement = signal<ModePaiement[]>([]);
    searchTerm = signal<string>('');
    isLoading = signal<boolean>(false);

    // Utilitaires
    ModePaiementUtils = ModePaiementUtils;

    // Liste filtrée (computed)
    filteredModesPaiement = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) {
            return this.modesPaiement();
        }

        return this.modesPaiement().filter(
            (mp) =>
                mp.libelle.toLowerCase().includes(term) ||
                mp.type.toLowerCase().includes(term) ||
                mp.description?.toLowerCase().includes(term),
        );
    });

    constructor(
        private modePaiementService: ModePaiementService,
    ) {}

    ngOnInit(): void {
        this.loadModesPaiement();
    }

    /**
     * Charger tous les modes de paiement
     */
    loadModesPaiement(): void {
        this.isLoading.set(true);

        this.modePaiementService.findAllModesPaiement().subscribe({
            next: (data) => {
                this.modesPaiement.set(data);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement modes paiement:', error);
                this.isLoading.set(false);
                this.showError('Impossible de charger les modes de paiement');
            },
        });
    }

    /**
     * Rechercher des modes de paiement
     */
    onSearch(term: string): void {
        this.searchTerm.set(term);
    }

    /**
     * Supprimer un mode de paiement
     */
    async deleteModePaiement(id: string, libelle: string): Promise<void> {
        const result = await Swal.fire({
            title: 'Confirmer la suppression',
            html: `Êtes-vous sûr de vouloir supprimer le mode de paiement <strong>${libelle}</strong> ?`,
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
            this.modePaiementService.deleteModePaiement(id).subscribe({
                next: () => {
                    this.showSuccess('Mode de paiement supprimé avec succès');
                    this.loadModesPaiement();
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