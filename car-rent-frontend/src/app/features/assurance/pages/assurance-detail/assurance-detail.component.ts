import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AssuranceUtils } from '../../models/assurance-config.model';
import { AssuranceService, Assurance } from '../../services/assurance.service';

/**
 * Page de détail d'une assurance
 */
@Component({
    selector: 'app-assurance-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './assurance-detail.component.html',
})
export class AssuranceDetailComponent implements OnInit {
    assurance = signal<Assurance | null>(null);
    isLoading = signal<boolean>(true);

    // Utilitaires
    AssuranceUtils = AssuranceUtils;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private assuranceService: AssuranceService,
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadAssurance(id);
        }
    }

    /**
     * Charger les détails de l'assurance
     */
    loadAssurance(id: string): void {
        this.isLoading.set(true);

        this.assuranceService.findAssuranceById(id).subscribe({
            next: (data) => {
                this.assurance.set(data);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement assurance:', error);
                this.isLoading.set(false);
                this.showError('Impossible de charger l\'assurance');
                this.router.navigate(['/dashboard/assurances']);
            },
        });
    }

    /**
     * Supprimer l'assurance
     */
    async deleteAssurance(): Promise<void> {
        const assur = this.assurance();
        if (!assur) return;

        const result = await Swal.fire({
            title: 'Confirmer la suppression',
            html: `Êtes-vous sûr de vouloir supprimer l'assurance <strong>${assur.prestataire}</strong> ?`,
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
            this.assuranceService.deleteAssurance(assur.id).subscribe({
                next: () => {
                    this.showSuccess('Assurance supprimée avec succès');
                    this.router.navigate(['/dashboard/assurances']);
                },
                error: (error) => {
                    console.error('Erreur suppression:', error);
                    this.showError('Erreur lors de la suppression');
                },
            });
        }
    }

    /**
     * Télécharger le document
     */
    downloadDocument(): void {
        const assur = this.assurance();
        if (assur?.documentUrl) {
            window.open(assur.documentUrl, '_blank');
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