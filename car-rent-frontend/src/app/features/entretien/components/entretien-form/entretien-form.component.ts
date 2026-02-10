import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    Entretien,
    CreateEntretienInput,
    UpdateEntretienInput,
    TypeEntretien,
    Vehicule,
} from '../../models/entretien.model';
import { format } from 'date-fns';

/**
 * Reusable form component for creating/editing maintenance records
 */
@Component({
    selector: 'app-entretien-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './entretien-form.component.html',
    styleUrls: ['./entretien-form.component.css'],
})
export class EntretienFormComponent implements OnInit {
    @Input() entretien?: Entretien;
    @Input() isEditMode: boolean = false;
    @Input() typesEntretien: TypeEntretien[] = [];
    @Input() vehicules: Vehicule[] = [];
    @Output() submitForm = new EventEmitter<CreateEntretienInput>();
    @Output() submitFormUpdate = new EventEmitter<UpdateEntretienInput>();
    @Output() cancel = new EventEmitter<void>();

    entretienForm!: FormGroup;
    isSubmitting: boolean = false;
    selectedTypeEntretien?: TypeEntretien;
    selectedVehicule?: Vehicule;

    statusOptions = [
        { value: 'TERMINE', label: 'Completed', color: 'success' },
        { value: 'EN_COURS', label: 'In Progress', color: 'warning' },
        { value: 'PLANIFIE', label: 'Planned', color: 'info' },
        { value: 'ANNULE', label: 'Cancelled', color: 'error' },
    ];

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
        if (this.isEditMode && this.entretien) {
            this.populateForm();
        }
    }

    /**
     * Initialize the form with validation rules
     */
    private initializeForm(): void {
        this.entretienForm = this.formBuilder.group({
            typeEntretienId: ['', [Validators.required]],
            vehiculeId: ['', [Validators.required]],
            dateDebutOperation: ['', [Validators.required]],
            dateFinOperation: ['', [Validators.required]],
            kilometrageArret: [0, [Validators.required, Validators.min(0)]],
            kilometrageLimiteProchainEntretien: [null, [Validators.min(0)]],
            dateLimiteProchainEntretien: [''],
            codePersonnel: ['', [Validators.maxLength(100)]],
            nomPrenomPersonnel: ['', [Validators.maxLength(255)]],
            observations: [''],
            coutTotal: [0, [Validators.required, Validators.min(0)]],
            etat: ['TERMINE', [Validators.required]],
        });

        // Watch for type selection changes
        this.entretienForm.get('typeEntretienId')?.valueChanges.subscribe((typeId) => {
            this.onTypeEntretienChange(typeId);
        });

        // Watch for vehicle selection changes
        this.entretienForm.get('vehiculeId')?.valueChanges.subscribe((vehiculeId) => {
            this.onVehiculeChange(vehiculeId);
        });
    }

    /**
     * Populate form with existing data for edit mode
     */
    private populateForm(): void {
        if (this.entretien) {
            this.entretienForm.patchValue({
                typeEntretienId: this.entretien.typeEntretienId,
                vehiculeId: this.entretien.vehiculeId,
                dateDebutOperation: this.entretien.dateDebutOperation,
                dateFinOperation: this.entretien.dateFinOperation,
                kilometrageArret: this.entretien.kilometrageArret,
                kilometrageLimiteProchainEntretien:
                this.entretien.kilometrageLimiteProchainEntretien,
                dateLimiteProchainEntretien:
                this.entretien.dateLimiteProchainEntretien,
                codePersonnel: this.entretien.codePersonnel,
                nomPrenomPersonnel: this.entretien.nomPrenomPersonnel,
                observations: this.entretien.observations,
                coutTotal: this.entretien.coutTotal,
                etat: this.entretien.etat,
            });

            this.selectedTypeEntretien = this.entretien.typeEntretien;
            this.selectedVehicule = this.entretien.vehicule;
        }
    }

    /**
     * Handle maintenance type selection change
     */
    onTypeEntretienChange(typeId: string): void {
        this.selectedTypeEntretien = this.typesEntretien.find(
            (t) => t.id === typeId
        );

        if (this.selectedTypeEntretien && !this.isEditMode) {
            // Pre-fill estimated cost
            this.entretienForm.patchValue({
                coutTotal: this.selectedTypeEntretien.coutMoyenEstime,
            });

            // Calculate next maintenance dates if current mileage is available
            const currentKm = this.entretienForm.get('kilometrageArret')?.value;
            if (currentKm && this.selectedTypeEntretien.frequenceKmRecommandee) {
                this.entretienForm.patchValue({
                    kilometrageLimiteProchainEntretien:
                        currentKm + this.selectedTypeEntretien.frequenceKmRecommandee,
                });
            }

            if (this.selectedTypeEntretien.frequenceJoursRecommandee) {
                const today = new Date();
                const nextDate = new Date(today);
                nextDate.setDate(
                    today.getDate() + this.selectedTypeEntretien.frequenceJoursRecommandee
                );
                this.entretienForm.patchValue({
                    dateLimiteProchainEntretien: format(nextDate, 'yyyy-MM-dd'),
                });
            }
        }
    }

    /**
     * Handle vehicle selection change
     */
    onVehiculeChange(vehiculeId: string): void {
        this.selectedVehicule = this.vehicules.find((v) => v.id === vehiculeId);
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.entretienForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const formValue = this.entretienForm.value;

            // Validate dates
            if (formValue.dateFinOperation < formValue.dateDebutOperation) {
                alert('End date must be after start date');
                this.isSubmitting = false;
                return;
            }

            if (this.isEditMode && this.entretien) {
                const updateInput: UpdateEntretienInput = {
                    id: this.entretien.id,
                    ...formValue,
                };
                this.submitFormUpdate.emit(updateInput);
            } else {
                const createInput: CreateEntretienInput = formValue;
                this.submitForm.emit(createInput);
            }
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.entretienForm.controls).forEach((key) => {
                this.entretienForm.get(key)?.markAsTouched();
            });
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
        this.entretienForm.reset({
            typeEntretienId: '',
            vehiculeId: '',
            dateDebutOperation: '',
            dateFinOperation: '',
            kilometrageArret: 0,
            kilometrageLimiteProchainEntretien: null,
            dateLimiteProchainEntretien: '',
            codePersonnel: '',
            nomPrenomPersonnel: '',
            observations: '',
            coutTotal: 0,
            etat: 'TERMINE',
        });
        this.isSubmitting = false;
        this.selectedTypeEntretien = undefined;
        this.selectedVehicule = undefined;
    }

    /**
     * Check if a field has errors and has been touched
     */
    hasError(fieldName: string): boolean {
        const field = this.entretienForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    /**
     * Get error message for a specific field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.entretienForm.get(fieldName);
        if (!field) return '';

        if (field.hasError('required')) {
            return 'This field is required';
        }
        if (field.hasError('min')) {
            const min = field.getError('min').min;
            return `Minimum value is ${min}`;
        }
        if (field.hasError('maxlength')) {
            const maxLength = field.getError('maxlength').requiredLength;
            return `Maximum ${maxLength} characters`;
        }
        return '';
    }

    /**
     * Get status badge color
     */
    getStatusColor(status: string): string {
        const option = this.statusOptions.find((s) => s.value === status);
        return option?.color || 'gray';
    }
}