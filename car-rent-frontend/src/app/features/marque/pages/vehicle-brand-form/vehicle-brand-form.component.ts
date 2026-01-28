// ==========================================
// 📁 src/app/features/vehicle-brand/pages/vehicle-brand-form/vehicle-brand-form.component.ts
// ==========================================

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { VehicleBrandService } from '../../services/vehicle-brand.service';
import { CreateVehicleBrandDto, UpdateVehicleBrandDto } from '../../models/vehicle-brand.model';
import {
    VEHICLE_BRAND_FORM_CONFIG,
    VEHICLE_BRAND_FORM_DEFAULTS,
    FormFieldConfig
} from '../../config/vehicle-brand-form.config';

/**
 * Vehicle Brand Form Component
 * Handles both create and edit operations using dynamic form configuration
 */
@Component({
    selector: 'app-vehicle-brand-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './vehicle-brand-form.component.html',
    styleUrls: ['./vehicle-brand-form.component.css']
})
export class VehicleBrandFormComponent implements OnInit, OnDestroy {
    formGroup!: FormGroup;
    formConfig: FormFieldConfig[] = [];

    isEditMode = signal(false);
    brandId = signal<string | null>(null);
    isLoading = signal(false);
    isSubmitting = signal(false);
    errorMessage = signal('');

    private readonly destroySubject = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly vehicleBrandService: VehicleBrandService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.formConfig = this.sortFormFields(VEHICLE_BRAND_FORM_CONFIG);
        this.initializeForm();
        this.checkEditMode();
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    /**
     * Sort form fields by order
     */
    private sortFormFields(fields: FormFieldConfig[]): FormFieldConfig[] {
        return [...fields].sort((a, b) => a.order - b.order);
    }

    /**
     * Initialize dynamic form
     */
    private initializeForm(): void {
        const formGroupConfig: { [key: string]: FormControl } = {};

        this.formConfig.forEach(field => {
            const defaultValue = VEHICLE_BRAND_FORM_DEFAULTS[field.name as keyof typeof VEHICLE_BRAND_FORM_DEFAULTS];
            formGroupConfig[field.name] = new FormControl(
                defaultValue || '',
                field.validators || []
            );
        });

        this.formGroup = this.formBuilder.group(formGroupConfig);
    }

    /**
     * Check if we are in edit mode
     */
    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.isEditMode.set(true);
            this.brandId.set(id);
            this.loadBrandData(id);
        }
    }

    /**
     * Load brand data for editing
     */
    private loadBrandData(id: string): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.vehicleBrandService
            .getBrandById(id)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (brand) => {
                    this.formGroup.patchValue({
                        label: brand.label,
                        logoUrl: brand.logoUrl || '',
                        description: brand.description || '',
                    });
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('[VehicleBrandForm] Error loading brand:', error);
                    this.errorMessage.set('Failed to load brand data');
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Submit form
     */
    onSubmit(): void {
        if (this.formGroup.invalid) {
            this.markFormGroupTouched(this.formGroup);
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        if (this.isEditMode() && this.brandId()) {
            this.updateBrand();
        } else {
            this.createBrand();
        }
    }

    /**
     * Create new brand
     */
    private createBrand(): void {
        const dto = new CreateVehicleBrandDto(this.formGroup.value);

        this.vehicleBrandService
            .createBrand(dto)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Brand created successfully',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rentix-popup',
                            title: 'rentix-title',
                            confirmButton: 'rentix-confirm-btn'
                        },
                        buttonsStyling: false,
                        timer: 2000
                    });
                    this.router.navigate(['/dashboard/vehicle-brands']);
                },
                error: (error) => {
                    console.error('[VehicleBrandForm] Error creating brand:', error);
                    this.errorMessage.set(this.extractErrorMessage(error));
                    this.isSubmitting.set(false);
                }
            });
    }

    /**
     * Update existing brand
     */
    private updateBrand(): void {
        const dto = new UpdateVehicleBrandDto({
            id: this.brandId()!,
            ...this.formGroup.value
        });

        this.vehicleBrandService
            .updateBrand(dto)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Brand updated successfully',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rentix-popup',
                            title: 'rentix-title',
                            confirmButton: 'rentix-confirm-btn'
                        },
                        buttonsStyling: false,
                        timer: 2000
                    });
                    this.router.navigate(['/dashboard/vehicle-brands']);
                },
                error: (error) => {
                    console.error('[VehicleBrandForm] Error updating brand:', error);
                    this.errorMessage.set(this.extractErrorMessage(error));
                    this.isSubmitting.set(false);
                }
            });
    }

    /**
     * Cancel and navigate back
     */
    onCancel(): void {
        this.router.navigate(['/dashboard/vehicle-brands']);
    }

    /**
     * Get form control
     */
    getControl(fieldName: string): FormControl {
        return this.formGroup.get(fieldName) as FormControl;
    }

    /**
     * Check if field has error
     */
    hasError(fieldName: string): boolean {
        const control = this.getControl(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    /**
     * Check if field is required
     */
    isFieldRequired(fieldName: string): boolean {
        const control = this.getControl(fieldName);
        if (!control) return false;

        const validator = control.validator;
        if (!validator) return false;

        const validationResult = validator({} as any);
        return validationResult?.['required'] !== undefined;
    }

    /**
     * Get error message for field
     */
    getErrorMessage(field: FormFieldConfig): string {
        const control = this.getControl(field.name);

        if (!control || !control.errors) {
            return '';
        }

        const firstErrorKey = Object.keys(control.errors)[0];
        return field.errorMessages?.[firstErrorKey] || 'Validation error';
    }

    /**
     * Mark all fields as touched
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Extract error message from backend
     */
    private extractErrorMessage(error: any): string {
        if (error?.graphQLErrors?.length > 0) {
            return error.graphQLErrors[0].message;
        }
        if (error?.message) {
            return error.message;
        }
        return 'An error occurred';
    }
}