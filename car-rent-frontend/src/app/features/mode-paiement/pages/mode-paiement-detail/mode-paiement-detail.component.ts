import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
    ModePaiementType,
    ModePaiementUtils,
} from '../../models/mode-paiement-config.model';

/**
 * Interface pour Mode Paiement (remplacée par le modèle auto-généré)
 */
interface ModePaiement {
    id: string;
    type: ModePaiementType;
    libelle: string;
    description?: string;
    icon?: string;
    estActif: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Page de détail d'un mode de paiement
 */
@Component({
    selector: 'app-mode-paiement-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './mode-paiement-detail.component.html',
})
export class ModePaiementDetailComponent implements OnInit {
    modePaiement = signal<ModePaiement | null>(null);
    isLoading = signal<boolean>(true);

    // Utilitaires
    ModePaiementUtils = ModePaiementUtils;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        // Injecter le service auto-généré ici
        // private modePaiementService: ModePaiementService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadModePaiement(id);
        }
    }

    /**
     * Charger les détails du mode de paiement
     */
    loadModePaiement(id: string): void {
        this.isLoading.set(true);

        // TODO: Remplacer par l'appel au service auto-généré
        // this.modePaiementService.findModePaiementById(id).subscribe({
        //   next: (data) => {
        //     this.modePaiement.set(data);
        //     this.isLoading.set(false);
        //   },
        //   error: (error) => {
        //     console.error('Erreur chargement mode paiement:', error);
        //     this.isLoading.set(false);
        //     this.showError('Impossible de charger le mode de paiement');
        //     this.router.navigate(['/modes-paiement']);
        //   },
        // });

        // Mock data pour démonstration
        setTimeout(() => {
            this.modePaiement.set({
                id: id,
                type: ModePaiementType.ESPECE,
                libelle: 'Espèces',
                description: 'Paiement en espèces',
                icon: '💵',
                estActif: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            this.isLoading.set(false);
        }, 500);
    }

    /**
     * Supprimer le mode de paiement
     */
    async deleteModePaiement(): Promise<void> {
        const mp = this.modePaiement();
        if (!mp) return;

        const result = await Swal.fire({
            title: 'Confirmer la suppression',
            html: `Êtes-vous sûr de vouloir supprimer le mode de paiement <strong>${mp.libelle}</strong> ?`,
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
            // TODO: Appel au service
            // this.modePaiementService.deleteModePaiement(mp.id).subscribe({
            //   next: () => {
            //     this.showSuccess('Mode de paiement supprimé avec succès');
            //     this.router.navigate(['/modes-paiement']);
            //   },
            //   error: (error) => {
            //     this.showError('Erreur lors de la suppression');
            //   },
            // });

            this.showSuccess('Mode de paiement supprimé avec succès');
            this.router.navigate(['/dashboard/modes-paiement']);
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
    /**
     * Cancel and navigate back
     */
    onCancel(): void {
        this.router.navigate(['/dashboard/modes-paiement']);
    }
}