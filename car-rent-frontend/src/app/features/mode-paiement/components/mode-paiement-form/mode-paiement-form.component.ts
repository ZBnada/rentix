import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    MODE_PAIEMENT_FORM_CONFIG,
    ModePaiementFormBuilder,
    FormFieldConfig,
} from '../../config/mode-paiement-form.config';

/**
 * Interface pour Mode Paiement (remplacée par le modèle auto-généré)
 */
interface ModePaiementFormData {
    id?: string;
    type?: string;
    libelle?: string;
    description?: string;
    icon?: string;
}

/**
 * Composant de formulaire dynamique pour Mode Paiement
 */
@Component({
    selector: 'app-mode-paiement-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './mode-paiement-form.component.html',
})
export class ModePaiementFormComponent implements OnInit {
    @Input() initialData?: ModePaiementFormData;
    @Input() isEditMode = false;
    @Output() submitForm = new EventEmitter<ModePaiementFormData>();
    @Output() cancel = new EventEmitter<void>();

    form!: FormGroup;
    formFields: FormFieldConfig[] = MODE_PAIEMENT_FORM_CONFIG;
    isSubmitting = false;

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
        const controls = ModePaiementFormBuilder.buildFormControls();
        this.form = this.formBuilder.group(controls);
    }

    /**
     * Soumettre le formulaire
     */
    onSubmit(): void {
        if (this.form.valid) {
            this.isSubmitting = true;
            const formData: ModePaiementFormData = {
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
     * Marquer tous les champs comme touchés pour afficher les erreurs
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();
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
     * Obtenir le message d'erreur pour un champ
     */
    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) return '';

        const errors = control.errors;
        if (errors['required']) return 'Ce champ est obligatoire';
        if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères`;
        if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères`;
        if (errors['email']) return 'Email invalide';
        if (errors['pattern']) return 'Format invalide';

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
}