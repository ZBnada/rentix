import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    TypeEntretien,
    CreateTypeEntretienInput,
    UpdateTypeEntretienInput,
} from '../../models/type-entretien.model';

/**
 * Reusable form component for creating/editing maintenance types
 */
@Component({
    selector: 'app-type-entretien-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './type-entretien-form.component.html',
    styleUrls: ['./type-entretien-form.component.css'],
})
export class TypeEntretienFormComponent implements OnInit {
    @Input() typeEntretien?: TypeEntretien;
    @Input() isEditMode: boolean = false;
    @Output() submitForm = new EventEmitter<CreateTypeEntretienInput>();
    @Output() submitFormUpdate = new EventEmitter<UpdateTypeEntretienInput>();
    @Output() cancel = new EventEmitter<void>();

    typeEntretienForm!: FormGroup;
    isSubmitting: boolean = false;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
        if (this.isEditMode && this.typeEntretien) {
            this.populateForm();
        }
    }

    /**
     * Initialize the form with validation rules
     */
    private initializeForm(): void {
        this.typeEntretienForm = this.formBuilder.group({
            codeEntretien: [
                '',
                [Validators.required, Validators.maxLength(50)],
            ],
            designation: [
                '',
                [Validators.required, Validators.maxLength(255)],
            ],
            description: [''],
            frequenceJoursRecommandee: [null, [Validators.min(1)]],
            frequenceKmRecommandee: [null, [Validators.min(1)]],
            coutMoyenEstime: [0, [Validators.required, Validators.min(0)]],
            estObligatoire: [false],
        });
    }

    /**
     * Populate form with existing data for edit mode
     */
    private populateForm(): void {
        if (this.typeEntretien) {
            this.typeEntretienForm.patchValue({
                codeEntretien: this.typeEntretien.codeEntretien,
                designation: this.typeEntretien.designation,
                description: this.typeEntretien.description,
                frequenceJoursRecommandee: this.typeEntretien.frequenceJoursRecommandee,
                frequenceKmRecommandee: this.typeEntretien.frequenceKmRecommandee,
                coutMoyenEstime: this.typeEntretien.coutMoyenEstime,
                estObligatoire: this.typeEntretien.estObligatoire,
            });
        }
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.typeEntretienForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const formValue = this.typeEntretienForm.value;

            if (this.isEditMode && this.typeEntretien) {
                const updateInput: UpdateTypeEntretienInput = {
                    id: this.typeEntretien.id,
                    ...formValue,
                };
                this.submitFormUpdate.emit(updateInput);
            } else {
                const createInput: CreateTypeEntretienInput = formValue;
                this.submitForm.emit(createInput);
            }
        }
    }

    /**
     * Handle form cancellation
     */
    onCancel(): void {
        this.cancel.emit();
    }

    /**
     * Reset form to initial state
     */
    resetForm(): void {
        this.typeEntretienForm.reset({
            codeEntretien: '',
            designation: '',
            description: '',
            frequenceJoursRecommandee: null,
            frequenceKmRecommandee: null,
            coutMoyenEstime: 0,
            estObligatoire: false,
        });
        this.isSubmitting = false;
    }

    /**
     * Check if a field has errors and has been touched
     */
    hasError(fieldName: string): boolean {
        const field = this.typeEntretienForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    /**
     * Get error message for a specific field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.typeEntretienForm.get(fieldName);
        if (!field) return '';

        if (field.hasError('required')) {
            return 'Ce champ est requis';
        }
        if (field.hasError('maxlength')) {
            const maxLength = field.getError('maxlength').requiredLength;
            return `Maximum ${maxLength} caractères`;
        }
        if (field.hasError('min')) {
            const min = field.getError('min').min;
            return `La valeur minimale est ${min}`;
        }
        return '';
    }
}