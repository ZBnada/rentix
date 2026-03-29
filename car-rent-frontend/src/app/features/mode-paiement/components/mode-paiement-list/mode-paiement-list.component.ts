import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModePaiementUtils } from '../../models/mode-paiement-config.model';
import {
    ModePaiementService,
    ModePaiement,
    CreateModePaiementDto,
    UpdateModePaiementDto,
} from '../../services/mode-paiement.service';
import { ModePaiementFormComponent } from '../mode-paiement-form/mode-paiement-form.component';

interface ModePaiementFormData {
    id?: string;
    type?: string;
    libelle?: string;
    description?: string;
    icon?: string;
}

@Component({
    selector: 'app-mode-paiement-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ModePaiementFormComponent],
    templateUrl: './mode-paiement-list.component.html',
})
export class ModePaiementListComponent implements OnInit {
    modesPaiement = signal<ModePaiement[]>([]);
    searchTerm    = signal<string>('');
    isLoading     = signal<boolean>(false);
    viewMode      = signal<'table' | 'grid'>('table');
    isSaving      = signal<boolean>(false);

    // Create/Edit Modal
    showModal   = signal<boolean>(false);
    isEditMode  = signal<boolean>(false);
    initialData = signal<ModePaiementFormData | undefined>(undefined);

    // Detail Modal
    showDetailModal = signal<boolean>(false);
    selectedMp      = signal<ModePaiement | null>(null);

    ModePaiementUtils = ModePaiementUtils;

    filteredModesPaiement = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) return this.modesPaiement();
        return this.modesPaiement().filter(
            (mp) =>
                mp.libelle.toLowerCase().includes(term) ||
                mp.type.toLowerCase().includes(term) ||
                mp.description?.toLowerCase().includes(term),
        );
    });

    constructor(private modePaiementService: ModePaiementService) {}

    ngOnInit(): void { this.loadModesPaiement(); }

    // ── View toggle ────────────────────────────────────────────
    toggleViewMode(): void {
        this.viewMode.set(this.viewMode() === 'table' ? 'grid' : 'table');
    }

    // ── Detail Modal ───────────────────────────────────────────
    openDetailModal(mp: ModePaiement, event: Event): void {
        event.stopPropagation();
        this.selectedMp.set(mp);
        this.showDetailModal.set(true);
    }

    closeDetailModal(): void {
        this.showDetailModal.set(false);
        this.selectedMp.set(null);
    }

    openEditFromDetail(): void {
        const mp = this.selectedMp();
        if (!mp) return;
        this.closeDetailModal();
        this.isEditMode.set(true);
        this.isSaving.set(false);
        this.initialData.set({
            id:          mp.id,
            type:        mp.type,
            libelle:     mp.libelle,
            description: mp.description,
            icon:        mp.icon,
        });
        this.showModal.set(true);
    }

    // ── Create/Edit Modal ──────────────────────────────────────
    openCreateModal(): void {
        this.isEditMode.set(false);
        this.initialData.set(undefined);
        this.isSaving.set(false);
        this.showModal.set(true);
    }

    openEditModal(mp: ModePaiement, event: Event): void {
        event.stopPropagation();
        this.isEditMode.set(true);
        this.isSaving.set(false);
        this.initialData.set({
            id:          mp.id,
            type:        mp.type,
            libelle:     mp.libelle,
            description: mp.description,
            icon:        mp.icon,
        });
        this.showModal.set(true);
    }

    closeModal(): void {
        this.showModal.set(false);
        this.initialData.set(undefined);
        this.isSaving.set(false);
    }

    onSubmit(formData: ModePaiementFormData): void {
        if (this.isEditMode()) {
            this.updateModePaiement(formData);
        } else {
            this.createModePaiement(formData);
        }
    }

    // ── CRUD ───────────────────────────────────────────────────
    createModePaiement(formData: ModePaiementFormData): void {
        const sameLibelle = this.modesPaiement().some(
            (mp) => mp.libelle.toLowerCase().trim() === (formData.libelle ?? '').toLowerCase().trim()
        );
        const sameType = this.modesPaiement().some(
            (mp) => mp.type.toLowerCase().trim() === (formData.type ?? '').toLowerCase().trim()
        );

        if (sameLibelle) {
            Swal.fire({
                title: 'Already Exists',
                html: `A payment method with the label <strong>${formData.libelle}</strong> already exists.`,
                icon: 'warning', confirmButtonText: 'OK',
                customClass: { popup: 'rentix-popup', title: 'rentix-title', confirmButton: 'rentix-confirm-btn' },
                buttonsStyling: false,
            });
            this.isSaving.set(false);
            return;
        }

        if (sameType) {
            Swal.fire({
                title: 'Type Already Used',
                html: `A payment method with the type <strong>${formData.type}</strong> already exists.`,
                icon: 'warning', confirmButtonText: 'OK',
                customClass: { popup: 'rentix-popup', title: 'rentix-title', confirmButton: 'rentix-confirm-btn' },
                buttonsStyling: false,
            });
            this.isSaving.set(false);
            return;
        }

        this.isSaving.set(true);
        const dto: CreateModePaiementDto = {
            type: formData.type as string,
            libelle: formData.libelle as string,
            description: formData.description,
            icon: formData.icon,
        };
        this.modePaiementService.createModePaiement(dto).subscribe({
            next: () => {
                this.isSaving.set(false);
                this.closeModal();
                this.showSuccess('Payment method created successfully');
                this.loadModesPaiement();
            },
            error: (err) => {
                console.error(err);
                this.isSaving.set(false);
                this.showError(err.message || 'Error creating payment method');
            },
        });
    }

    updateModePaiement(formData: ModePaiementFormData): void {
        this.isSaving.set(true);
        const dto: UpdateModePaiementDto = {
            id:          formData.id as string,
            type:        formData.type as string,
            libelle:     formData.libelle as string,
            description: formData.description,
            icon:        formData.icon,
        };
        this.modePaiementService.updateModePaiement(dto).subscribe({
            next: () => {
                this.isSaving.set(false);
                this.closeModal();
                this.showSuccess('Payment method updated successfully');
                this.loadModesPaiement();
            },
            error: (err) => {
                console.error(err);
                this.isSaving.set(false);
                this.showError(err.message || 'Error updating payment method');
            },
        });
    }

    loadModesPaiement(): void {
        this.isLoading.set(true);
        this.modePaiementService.findAllModesPaiement().subscribe({
            next:  (data) => { this.modesPaiement.set(data); this.isLoading.set(false); },
            error: (err)  => {
                console.error(err);
                this.isLoading.set(false);
                this.showError('Unable to load payment methods');
            },
        });
    }

    onSearch(term: string): void { this.searchTerm.set(term); }

    async deleteModePaiement(id: string, libelle: string, event: Event): Promise<void> {
        event.stopPropagation();
        const result = await Swal.fire({
            title: 'Confirm Deletion',
            html: `Are you sure you want to delete <strong>${libelle}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rentix-popup', title: 'rentix-title',
                confirmButton: 'rentix-confirm-btn', cancelButton: 'rentix-cancel-btn',
            },
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            this.modePaiementService.deleteModePaiement(id).subscribe({
                next: () => {
                    this.closeDetailModal();
                    this.showSuccess('Payment method deleted successfully');
                    this.loadModesPaiement();
                },
                error: (err) => {
                    console.error(err);
                    this.showError(err.message || 'Error deleting payment method');
                },
            });
        }
    }

    // ── Notifications ──────────────────────────────────────────
    private showSuccess(message: string): void {
        Swal.fire({
            title: 'Success', text: message, icon: 'success',
            timer: 3000, showConfirmButton: false,
            customClass: { popup: 'rentix-popup', title: 'rentix-title' },
        });
    }

    private showError(message: string): void {
        Swal.fire({
            title: 'Error', text: message, icon: 'error', confirmButtonText: 'OK',
            customClass: { popup: 'rentix-popup', title: 'rentix-title', confirmButton: 'rentix-confirm-btn' },
            buttonsStyling: false,
        });
    }
}