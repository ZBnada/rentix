import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleBrandService } from '../../../marque/services/vehicle-brand.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../../models/vehicle.model';
import {
    VEHICLE_FORM_CONFIG,
    VEHICLE_FORM_DEFAULTS,
    FORM_SECTIONS,
    VehicleFormFieldConfig
} from '../../config/vehicle-form.config';

/**
 * Vehicle Form Component
 * Handles both create and edit operations using dynamic form configuration
 */
@Component({
    selector: 'app-vehicle-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './vehicle-form.component.html',
    styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit, OnDestroy {
    formGroup!: FormGroup;
    formConfig: VehicleFormFieldConfig[] = [];
    formSections = FORM_SECTIONS;

    isEditMode = signal(false);
    vehicleId = signal<string | null>(null);
    isLoading = signal(false);
    isSubmitting = signal(false);
    errorMessage = signal('');
    brands = signal<Array<{ value: string; label: string }>>([]);

    private readonly destroySubject = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly vehicleService: VehicleService,
        private readonly vehicleBrandService: VehicleBrandService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.formConfig = this.sortFormFields(VEHICLE_FORM_CONFIG);
        this.loadBrands();
        this.initializeForm();
        this.checkEditMode();
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    /**
     * Load vehicle brands for dropdown
     */
    private loadBrands(): void {
        this.vehicleBrandService
            .getAllBrands()
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (brandsData) => {
                    this.brands.set(brandsData.map(b => ({ value: b.id, label: b.label })));
                    // Update brandId field options
                    const brandField = this.formConfig.find(f => f.name === 'brandId');
                    if (brandField) {
                        brandField.options = this.brands();
                    }
                },
                error: (error) => {
                    console.error('[VehicleForm] Error loading brands:', error);
                }
            });
    }

    /**
     * Sort form fields by order
     */
    private sortFormFields(fields: VehicleFormFieldConfig[]): VehicleFormFieldConfig[] {
        return [...fields].sort((a, b) => a.order - b.order);
    }

    /**
     * Get fields by section
     */
    getFieldsBySection(sectionId: string): VehicleFormFieldConfig[] {
        return this.formConfig.filter(f => f.section === sectionId);
    }

    /**
     * Initialize dynamic form
     */
    private initializeForm(): void {
        const formGroupConfig: { [key: string]: FormControl } = {};

        this.formConfig.forEach(field => {
            const defaultValue = VEHICLE_FORM_DEFAULTS[field.name as keyof typeof VEHICLE_FORM_DEFAULTS];
            formGroupConfig[field.name] = new FormControl(
                defaultValue !== undefined ? defaultValue : '',
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
            this.vehicleId.set(id);
            this.loadVehicleData(id);
        }
    }

    /**
     * Load vehicle data for editing
     */
    private loadVehicleData(id: string): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.vehicleService
            .getVehicleById(id)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: (vehicle) => {
                    this.formGroup.patchValue({
                        registrationNumber: vehicle.registrationNumber,
                        brandId: vehicle.brandId,
                        type: vehicle.type,
                        firstRegistrationDate: this.formatDateForInput(vehicle.firstRegistrationDate),
                        power: vehicle.power,
                        energy: vehicle.energy,
                        mileage: vehicle.mileage,
                        color: vehicle.color || '',
                        purchasePrice: vehicle.purchasePrice,
                        vehicleClass: vehicle.vehicleClass,
                        dailyRentalPrice: vehicle.dailyRentalPrice,
                        lateHourPrice: vehicle.lateHourPrice,
                        spareWheel: vehicle.spareWheel,
                        jackHandle: vehicle.jackHandle,
                        coverSet: vehicle.coverSet,
                        babySeat: vehicle.babySeat,
                        carpetSet: vehicle.carpetSet,
                        radio: vehicle.radio,
                        hubcapSet: vehicle.hubcapSet,
                        observations: vehicle.observations || '',
                        imageUrl: vehicle.imageUrl || '',
                    });
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('[VehicleForm] Error loading vehicle:', error);
                    this.errorMessage.set('Failed to load vehicle data');
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Format date for input field
     */
    private formatDateForInput(date: Date): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
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

        if (this.isEditMode() && this.vehicleId()) {
            this.updateVehicle();
        } else {
            this.createVehicle();
        }
    }

    /**
     * Create new vehicle
     */
    private createVehicle(): void {
        const formValue = this.formGroup.value;

        // Convert string date to Date object
        const firstRegistrationDate = formValue.firstRegistrationDate
            ? new Date(formValue.firstRegistrationDate)
            : new Date();

        const dto = new CreateVehicleDto({
            registrationNumber: formValue.registrationNumber,
            brandId: formValue.brandId,
            type: formValue.type,
            firstRegistrationDate: firstRegistrationDate,
            power: Number(formValue.power) || 0,
            energy: formValue.energy,
            mileage: Number(formValue.mileage) || 0,
            color: formValue.color || undefined,
            purchasePrice: Number(formValue.purchasePrice) || 0,
            vehicleClass: formValue.vehicleClass,
            dailyRentalPrice: Number(formValue.dailyRentalPrice) || 0,
            lateHourPrice: Number(formValue.lateHourPrice) || 0,
            spareWheel: Boolean(formValue.spareWheel),
            jackHandle: Boolean(formValue.jackHandle),
            coverSet: Boolean(formValue.coverSet),
            babySeat: Boolean(formValue.babySeat),
            carpetSet: Boolean(formValue.carpetSet),
            radio: Boolean(formValue.radio),
            hubcapSet: Boolean(formValue.hubcapSet),
            observations: formValue.observations || undefined,
            imageUrl: formValue.imageUrl || undefined,
        });

        console.log('[VehicleForm] Creating vehicle with data:', dto);

        this.vehicleService
            .createVehicle(dto)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Vehicle created successfully',
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
                    this.router.navigate(['/dashboard/vehicles']);
                },
                error: (error) => {
                    console.error('[VehicleForm] Error creating vehicle:', error);
                    console.error('[VehicleForm] Error details:', error.networkError?.error);
                    this.errorMessage.set(this.extractErrorMessage(error));
                    this.isSubmitting.set(false);
                }
            });
    }

    /**
     * Update existing vehicle
     */
    private updateVehicle(): void {
        const formValue = this.formGroup.value;

        // Convert string date to Date object if present
        const firstRegistrationDate = formValue.firstRegistrationDate
            ? new Date(formValue.firstRegistrationDate)
            : undefined;

        const dto = new UpdateVehicleDto({
            id: this.vehicleId()!,
            registrationNumber: formValue.registrationNumber,
            brandId: formValue.brandId,
            type: formValue.type,
            firstRegistrationDate: firstRegistrationDate,
            power: Number(formValue.power) || 0,
            energy: formValue.energy,
            mileage: Number(formValue.mileage) || 0,
            color: formValue.color || undefined,
            purchasePrice: Number(formValue.purchasePrice) || 0,
            vehicleClass: formValue.vehicleClass,
            dailyRentalPrice: Number(formValue.dailyRentalPrice) || 0,
            lateHourPrice: Number(formValue.lateHourPrice) || 0,
            spareWheel: Boolean(formValue.spareWheel),
            jackHandle: Boolean(formValue.jackHandle),
            coverSet: Boolean(formValue.coverSet),
            babySeat: Boolean(formValue.babySeat),
            carpetSet: Boolean(formValue.carpetSet),
            radio: Boolean(formValue.radio),
            hubcapSet: Boolean(formValue.hubcapSet),
            observations: formValue.observations || undefined,
            imageUrl: formValue.imageUrl || undefined,
        });

        console.log('[VehicleForm] Updating vehicle with data:', dto);

        this.vehicleService
            .updateVehicle(dto)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Vehicle updated successfully',
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
                    this.router.navigate(['/dashboard/vehicles']);
                },
                error: (error) => {
                    console.error('[VehicleForm] Error updating vehicle:', error);
                    console.error('[VehicleForm] Error details:', error.networkError?.error);
                    this.errorMessage.set(this.extractErrorMessage(error));
                    this.isSubmitting.set(false);
                }
            });
    }

    /**
     * Cancel and navigate back
     */
    onCancel(): void {
        this.router.navigate(['/dashboard/vehicles']);
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
    getErrorMessage(field: VehicleFormFieldConfig): string {
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