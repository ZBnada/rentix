import { Component, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, CreateRoleInput, UpdateRoleInput } from '../../models';

@Component({
    selector: 'app-role-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {
    @Input() role?: Role;
    @Input() isEditMode: boolean = false;
    @Output() formSubmit = new EventEmitter<CreateRoleInput | UpdateRoleInput>();
    @Output() formCancel = new EventEmitter<void>();

    roleForm!: FormGroup;
    isSubmitting = signal<boolean>(false);
    selectedWeight = signal<number>(60);

    // Predefined role templates
    roleTemplates = [
        { name: 'Super Admin', weight: 0, description: 'Accès complet au système' },
        { name: 'Admin', weight: 10, description: 'Administrateur avec privilèges élevés' },
        { name: 'Manager', weight: 30, description: 'Gestionnaire de contenu et utilisateurs' },
        { name: 'Employee', weight: 50, description: 'Employé avec accès limité' },
        { name: 'Client', weight: 60, description: 'Client avec accès basique' },
        { name: 'Guest', weight: 80, description: 'Invité avec accès minimal' }
    ];

    constructor(private readonly fb: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();

        if (this.role) {
            this.populateForm(this.role);
            this.selectedWeight.set(this.role.weight);
        }

        // Watch weight changes
        this.roleForm.get('weight')?.valueChanges.subscribe((weight: number) => {
            this.selectedWeight.set(weight);
        });
    }

    private initializeForm(): void {
        this.roleForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(50)]],
            description: ['', [Validators.maxLength(500)]],
            weight: [60, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    private populateForm(role: Role): void {
        this.roleForm.patchValue({
            name: role.name,
            description: role.description,
            weight: role.weight
        });
    }

    applyTemplate(template: { name: string; weight: number; description: string }): void {
        this.roleForm.patchValue({
            name: template.name,
            description: template.description,
            weight: template.weight
        });
    }

    onSubmit(): void {
        if (this.roleForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);
            const formValue = this.roleForm.value;

            if (this.isEditMode && this.role) {
                // For edit mode, emit UpdateRoleInput with id
                const updateInput: UpdateRoleInput = {
                    id: this.role.id,
                    name: formValue.name,
                    description: formValue.description,
                    weight: formValue.weight
                };
                this.formSubmit.emit(updateInput);
            } else {
                // For create mode, emit CreateRoleInput
                const createInput: CreateRoleInput = {
                    name: formValue.name,
                    description: formValue.description,
                    weight: formValue.weight
                };
                this.formSubmit.emit(createInput);
            }
        } else {
            this.markFormGroupTouched(this.roleForm);
        }
    }

    onCancel(): void {
        this.formCancel.emit();
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.roleForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.roleForm.get(fieldName);

        if (field?.errors) {
            if (field.errors['required']) return 'Ce champ est requis';
            if (field.errors['min']) return `Le poids minimum est ${field.errors['min'].min}`;
            if (field.errors['max']) return `Le poids maximum est ${field.errors['max'].max}`;
            if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
        }

        return '';
    }

    getWeightLabel(): string {
        const weight = this.selectedWeight();
        if (weight === 0) return 'Super Admin - Tous les privilèges';
        if (weight <= 20) return 'Très Élevé - Privilèges administratifs';
        if (weight <= 40) return 'Élevé - Gestion avancée';
        if (weight <= 60) return 'Moyen - Accès standard';
        return 'Bas - Accès limité';
    }

    getWeightColor(): string {
        const weight = this.selectedWeight();
        if (weight === 0) return 'text-purple-600 dark:text-purple-400';
        if (weight <= 20) return 'text-red-600 dark:text-red-400';
        if (weight <= 40) return 'text-orange-600 dark:text-orange-400';
        if (weight <= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-green-600 dark:text-green-400';
    }

    resetSubmitting(): void {
        this.isSubmitting.set(false);
    }
}