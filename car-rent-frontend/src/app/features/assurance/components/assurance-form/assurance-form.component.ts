import { Component, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AssuranceFormBuilder, FormFieldConfig, ASSURANCE_FORM_CONFIG } from '../../config/assurance-form.config';
import { AssuranceReglementFormComponent } from '../assurance-reglement-form/assurance-reglement-form.component';

/**
 * Interface pour les données du formulaire
 */
export interface AssuranceFormData {
    id?: string;
    vehiculeId: string;
    prestataire: string;
    numeroPolice?: string;
    dateDebut: Date;
    dateFinValidite: Date;
    montantTotal: number;
    dateOperation: Date;
    observations?: string;
    documentUrl?: string;
    reglements: any[];
    saisiPar?: string;
}

/**
 * Composant de formulaire Assurance
 */
@Component({
    selector: 'app-assurance-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AssuranceReglementFormComponent],
    templateUrl: './assurance-form.component.html',
})
export class AssuranceFormComponent implements OnInit {
    @Input() initialData?: AssuranceFormData;
    @Input() vehicules: any[] = [];
    @Input() modesPaiement: any[] = [];
    @Input() isEditMode = false;
    @Output() submitForm = new EventEmitter<AssuranceFormData>();
    @Output() cancel = new EventEmitter<void>();

    form!: FormGroup;
    formFields: FormFieldConfig[] = ASSURANCE_FORM_CONFIG;
    isSubmitting = signal<boolean>(false);
    selectedFile = signal<File | null>(null);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
        if (this.initialData) {
            this.form.patchValue(this.initialData);
        }
    }

    /**
     * Initialiser le formulaire
     */
    private initializeForm(): void {
        const controls = AssuranceFormBuilder.buildAssuranceFormControls();
        this.form = this.formBuilder.group(controls);
    }

    /**
     * Gérer la sélection de fichier
     */
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile.set(input.files[0]);
        }
    }

    /**
     * Soumettre le formulaire
     */
    onSubmit(): void {
        if (this.form.valid) {
            this.isSubmitting.set(true);
            const formData: AssuranceFormData = {
                ...this.form.value,
                ...(this.initialData?.id && { id: this.initialData.id }),
            };
            this.submitForm.emit(formData);
        } else {
            this.markFormGroupTouched(this.form);
        }
    }

    /**
     * Annuler le formulaire
     */
    onCancel(): void {
        this.cancel.emit();
    }

    /**
     * Marquer tous les champs comme touchés
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Vérifier si un champ a une erreur
     */
    hasError(fieldName: string, errorType?: string): boolean {
        const control = this.form.get(fieldName);
        if (!control) return false;

        if (errorType) {
            return control.hasError(errorType) && control.touched;
        }
        return control.invalid && control.touched;
    }

    /**
     * Obtenir le message d'erreur
     */
    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) return '';

        const errors = control.errors;
        if (errors['required']) return 'Ce champ est obligatoire';
        if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères`;
        if (errors['min']) return `Valeur minimum: ${errors['min'].min}`;
        if (errors['email']) return 'Email invalide';

        return 'Valeur invalide';
    }

    /**
     * Obtenir les classes CSS pour un champ
     */
    getFieldClasses(fieldName: string): string {
        const baseClasses = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
        const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
        const successClasses = 'border-gray-300 focus:ring-orange-500 focus:border-orange-500';

        return `${baseClasses} ${this.hasError(fieldName) ? errorClasses : successClasses}`;
    }

    /**
     * Obtenir le montant total pour le composant règlements
     */
    get montantTotal(): number {
        return parseFloat(this.form.get('montantTotal')?.value || 0);
    }
}