import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AssuranceFormComponent, AssuranceFormData } from '../../components/assurance-form/assurance-form.component';
import { AssuranceService } from '../../services/assurance.service';
import { ModePaiementService } from '../../../mode-paiement/services/mode-paiement.service';

/**
 * Page de formulaire Assurance (Création/Modification)
 */
@Component({
    selector: 'app-assurance-form-page',
    standalone: true,
    imports: [CommonModule, AssuranceFormComponent],
    templateUrl: './assurance-form-page.component.html',
})
export class AssuranceFormPageComponent implements OnInit {
    isEditMode = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    initialData = signal<AssuranceFormData | undefined>(undefined);
    pageTitle = signal<string>('Nouvelle assurance');

    vehicules = signal<any[]>([]);
    modesPaiement = signal<any[]>([]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private assuranceService: AssuranceService,
        private modePaiementService: ModePaiementService,
        // TODO: Injecter VehiculeService quand disponible
        // private vehiculeService: VehiculeService,
    ) {}

    ngOnInit(): void {
        this.loadDependencies();

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.pageTitle.set('Modifier l\'assurance');
            this.loadAssurance(id);
        }
    }

    /**
     * Charger les dépendances (véhicules, modes de paiement)
     */
    loadDependencies(): void {
        // Charger les modes de paiement
        this.modePaiementService.findAllModesPaiement().subscribe({
            next: (data) => {
                this.modesPaiement.set(data);
            },
            error: (error) => {
                console.error('Erreur chargement modes paiement:', error);
            },
        });

        // TODO: Charger les véhicules
        // this.vehiculeService.findAllVehicules().subscribe({
        //   next: (data) => {
        //     this.vehicules.set(data);
        //   },
        //   error: (error) => {
        //     console.error('Erreur chargement véhicules:', error);
        //   },
        // });

        // Mock data pour véhicules (à remplacer)
        this.vehicules.set([
            {
                id: '1',
                immatriculation: '123 TU 1234',
                marque: 'Renault',
                modele: 'Clio',
            },
            {
                id: '2',
                immatriculation: '456 TU 5678',
                marque: 'Peugeot',
                modele: '208',
            },
        ]);
    }

    /**
     * Charger les données pour l'édition
     */
    loadAssurance(id: string): void {
        this.isLoading.set(true);

        this.assuranceService.findAssuranceById(id).subscribe({
            next: (data) => {
                this.initialData.set(data as any);
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
     * Gérer la soumission du formulaire
     */
    onSubmit(formData: AssuranceFormData): void {
        if (this.isEditMode()) {
            this.updateAssurance(formData);
        } else {
            this.createAssurance(formData);
        }
    }

    /**
     * Créer une nouvelle assurance
     */
    createAssurance(formData: AssuranceFormData): void {
        this.assuranceService.createAssurance(formData as any).subscribe({
            next: (result) => {
                this.showSuccess('Assurance créée avec succès');
                this.router.navigate(['/dashboard/assurances', result.id]);
            },
            error: (error) => {
                console.error('Erreur création assurance:', error);
                this.showError(error.error?.message || 'Erreur lors de la création de l\'assurance');
            },
        });
    }

    /**
     * Mettre à jour une assurance existante
     */
    updateAssurance(formData: AssuranceFormData): void {
        this.assuranceService.updateAssurance(formData as any).subscribe({
            next: (result) => {
                this.showSuccess('Assurance mise à jour avec succès');
                this.router.navigate(['/dashboard/assurances', result.id]);
            },
            error: (error) => {
                console.error('Erreur mise à jour assurance:', error);
                this.showError(error.error?.message || 'Erreur lors de la mise à jour de l\'assurance');
            },
        });
    }

    /**
     * Gérer l'annulation
     */
    onCancel(): void {
        if (this.isEditMode() && this.initialData()?.id) {
            this.router.navigate(['/dashboard/assurances', this.initialData()!.id]);
        } else {
            this.router.navigate(['/dashboard/assurances']);
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