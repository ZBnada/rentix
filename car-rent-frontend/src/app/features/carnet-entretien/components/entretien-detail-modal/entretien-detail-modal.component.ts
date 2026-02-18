import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CarnetEntretienService } from '../../services/carnet-entretien.service';
import { CarnetEntretien, UpdateCarnetEntretienInput } from '../../models/carnet-entretien.model';

@Component({
    selector: 'app-entretien-detail-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './entretien-detail-modal.component.html',
    styleUrls: ['./entretien-detail-modal.component.css'],
})
export class EntretienDetailModalComponent implements OnInit {
    @Input() entretien!: CarnetEntretien;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<CarnetEntretien>();

    formData = signal<UpdateCarnetEntretienInput>({
        id: '',
        dateFin: undefined,
        kilometrageFin: undefined,
        coutReel: undefined,
        notes: undefined,
        statut: undefined,
    });

    isSaving = signal(false);
    statuts = ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE'];

    constructor(private carnetService: CarnetEntretienService) {}

    ngOnInit(): void {
        // Initialize the form with existing data
        this.formData.set({
            id: this.entretien.id,
            dateFin: this.entretien.dateFin || undefined,
            kilometrageFin: this.entretien.kilometrageFin || undefined,
            coutReel: this.entretien.coutReel || undefined,
            notes: this.entretien.notes || undefined,
            statut: this.entretien.statut,
        });
    }

    /**
     * Save changes
     */
    onSubmit(): void {
        this.isSaving.set(true);

        const input: UpdateCarnetEntretienInput = {
            ...this.formData(),
            modifiePar: 'User', // TODO: Retrieve from AuthService
        };

        this.carnetService.updateEntretien(input).subscribe({
            next: (updated) => {
                Swal.fire({
                    title: 'Success!',
                    text: 'The maintenance record has been updated successfully.',
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
                this.isSaving.set(false);
                this.save.emit(updated);
            },
            error: (error) => {
                console.error('Update error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Unable to update the maintenance record.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rentix-popup',
                        title: 'rentix-title',
                        confirmButton: 'rentix-confirm-btn',
                    },
                    buttonsStyling: false,
                });
                this.isSaving.set(false);
            },
        });
    }

    /**
     * Close the modal
     */
    onClose(): void {
        this.close.emit();
    }

    /**
     * Close on backdrop click
     */
    onBackdropClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.onClose();
        }
    }

    /**
     * Update a form field
     */
    updateField(field: keyof UpdateCarnetEntretienInput, value: any): void {
        this.formData.update((data) => ({ ...data, [field]: value }));
    }

    /**
     * Format a date for date input
     */
    formatDateForInput(date: Date | null | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Handle end date change
     */
    onDateFinChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        this.updateField('dateFin', value ? new Date(value) : undefined);
    }
}