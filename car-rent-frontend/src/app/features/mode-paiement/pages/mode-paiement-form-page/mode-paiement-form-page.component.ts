import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModePaiementFormComponent } from '../../components/mode-paiement-form/mode-paiement-form.component';

/**
 * Interface pour les données du formulaire
 */
interface ModePaiementFormData {
    id?: string;
    type?: string;
    libelle?: string;
    description?: string;
    icon?: string;
}

/**
 * Page de formulaire Mode Paiement (Création/Modification)
 */
@Component({
    selector: 'app-mode-paiement-form-page',
    standalone: true,
    imports: [CommonModule, ModePaiementFormComponent],
    templateUrl: './mode-paiement-form-page.component.html',
})
export class ModePaiementFormPageComponent implements OnInit {
    isEditMode = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    initialData = signal<ModePaiementFormData | undefined>(undefined);
    pageTitle = signal<string>('Nouveau mode de paiement');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        // Injecter le service auto-généré ici
        // private modePaiementService: ModePaiementService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.pageTitle.set('Modifier le mode de paiement');
            this.loadModePaiement(id);
        }
    }

    /**
     * Charger les données pour l'édition
     */
    loadModePaiement(id: string): void {
        this.isLoading.set(true);

        // TODO: Remplacer par l'appel au service auto-généré
        // this.modePaiementService.findModePaiementById(id).subscribe({
        //   next: (data) => {
        //     this.initialData.set(data);
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
            this.initialData.set({
                id: id,
                type: 'ESPECE',
                libelle: 'Espèces',
                description: 'Paiement en espèces',
                icon: '💵',
            });
            this.isLoading.set(false);
        }, 500);
    }

    /**
     * Gérer la soumission du formulaire
     */
    onSubmit(formData: ModePaiementFormData): void {
        if (this.isEditMode()) {
            this.updateModePaiement(formData);
        } else {
            this.createModePaiement(formData);
        }
    }

    /**
     * Créer un nouveau mode de paiement
     */
    createModePaiement(formData: ModePaiementFormData): void {
        // TODO: Remplacer par l'appel au service auto-généré
        // this.modePaiementService.createModePaiement(formData).subscribe({
        //   next: (result) => {
        //     this.showSuccess('Mode de paiement créé avec succès');
        //     this.router.navigate(['/modes-paiement', result.id]);
        //   },
        //   error: (error) => {
        //     console.error('Erreur création mode paiement:', error);
        //     this.showError('Erreur lors de la création du mode de paiement');
        //   },
        // });

        // Simulation
        this.showSuccess('Mode de paiement créé avec succès');
        setTimeout(() => {
            this.router.navigate(['/dashboard/modes-paiement']);
        }, 1500);
    }

    /**
     * Mettre à jour un mode de paiement existant
     */
    updateModePaiement(formData: ModePaiementFormData): void {
        // TODO: Remplacer par l'appel au service auto-généré
        // this.modePaiementService.updateModePaiement(formData).subscribe({
        //   next: (result) => {
        //     this.showSuccess('Mode de paiement mis à jour avec succès');
        //     this.router.navigate(['/modes-paiement', result.id]);
        //   },
        //   error: (error) => {
        //     console.error('Erreur mise à jour mode paiement:', error);
        //     this.showError('Erreur lors de la mise à jour du mode de paiement');
        //   },
        // });

        // Simulation
        this.showSuccess('Mode de paiement mis à jour avec succès');
        setTimeout(() => {
            this.router.navigate(['/modes-paiement', formData.id]);
        }, 1500);
    }

    /**
     * Gérer l'annulation
     */
    onCancel(): void {
        this.router.navigate(['/dashboard/modes-paiement']);
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