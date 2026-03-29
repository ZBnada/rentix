import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    MODE_PAIEMENT_FORM_CONFIG,
    ModePaiementFormBuilder,
    FormFieldConfig,
} from '../../config/mode-paiement-form.config';

interface ModePaiementFormData {
    id?: string;
    type?: string;
    libelle?: string;
    description?: string;
    icon?: string;
}

@Component({
    selector: 'app-mode-paiement-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './mode-paiement-form.component.html',
})
export class ModePaiementFormComponent implements OnInit, OnChanges {
    @Input() initialData?: ModePaiementFormData;
    @Input() isEditMode = false;
    @Input() isSaving = false;   // ← le parent contrôle le spinner
    @Output() submitForm = new EventEmitter<ModePaiementFormData>();
    @Output() cancel = new EventEmitter<void>();

    form!: FormGroup;
    formFields: FormFieldConfig[] = MODE_PAIEMENT_FORM_CONFIG;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
        if (this.initialData) {
            this.form.patchValue(this.initialData);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Quand initialData change (ouverture modal edit/create)
        if (changes['initialData'] && this.form) {
            this.form.reset();
            if (this.initialData) {
                this.form.patchValue(this.initialData);
            }
        }
    }

    private initializeForm(): void {
        const controls = ModePaiementFormBuilder.buildFormControls();
        this.form = this.formBuilder.group(controls);
    }

    onSubmit(): void {
        if (this.form.valid) {
            const formData: ModePaiementFormData = {
                ...this.form.value,
                ...(this.initialData?.id && { id: this.initialData.id }),
            };
            this.submitForm.emit(formData);
        } else {
            this.markFormGroupTouched(this.form);
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            formGroup.get(key)?.markAsTouched();
        });
    }

    hasError(fieldName: string, errorType?: string): boolean {
        const control = this.form.get(fieldName);
        if (!control) return false;
        if (errorType) return control.hasError(errorType) && control.touched;
        return control.invalid && control.touched;
    }

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

    getFieldClasses(fieldName: string): string {
        const base = 'w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm bg-gray-50';
        const error = 'border-red-300 focus:ring-red-400 focus:border-red-400';
        const normal = 'border-gray-200 focus:ring-slate-400 focus:border-transparent';
        return `${base} ${this.hasError(fieldName) ? error : normal}`;
    }
}