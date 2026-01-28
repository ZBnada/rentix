// src/app/modules/users/components/user-form/user-form.component.ts

import { Component, OnInit, Input, Output, EventEmitter, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserType, CreateUserInput, UpdateUserInput } from '../../models';
import { RoleService } from '../../../roles/services';
import { Role } from '../../../roles/models';
import { FileUploadService, ImagePreview } from '../../../../core/services/file-upload.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
    @Input() user?: User;
    @Input() isEditMode: boolean = false;
    @Output() formSubmit = new EventEmitter<{ input: CreateUserInput | UpdateUserInput; profileImageFile?: File | null }>();
    @Output() formCancel = new EventEmitter<void>();

    userForm!: FormGroup;
    isSubmitting = signal<boolean>(false);
    roles = signal<Role[]>([]);
    selectedUserType = signal<UserType>(UserType.INDIVIDUAL);

    // Profile picture management
    profilePicturePreview = signal<ImagePreview | null>(null);
    selectedProfileImageFile = signal<File | null>(null);
    isDragging = signal<boolean>(false);

    readonly UserType = UserType;

    constructor(
        private readonly fb: FormBuilder,
        private readonly roleService: RoleService,
        private readonly fileUploadService: FileUploadService,
        private readonly notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadRoles();

        if (this.user) {
            this.populateForm(this.user);
            this.selectedUserType.set(this.user.userType);
        }

        this.userForm.get('userType')?.valueChanges.subscribe((type: UserType) => {
            this.selectedUserType.set(type);
            this.updateValidators(type);
        });
    }

    ngOnDestroy(): void {
        const preview = this.profilePicturePreview();
        if (preview?.url) {
            this.fileUploadService.revokeObjectUrl(preview.url);
        }
    }

    private initializeForm(): void {
        this.userForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(100)]],
            lastName: ['', [Validators.required, Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
            phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
            countryCodePhone: ['+216', [Validators.required]],
            userType: [UserType.INDIVIDUAL, [Validators.required]],
            roleName: ['', [Validators.required]],
            legalCompanyName: [''],
            countryOfRegistration: [''],
            streetAddress: [''],
            houseNumber: [''],
            zipCode: [''],
            city: [''],
            isActive: [true],
            isEmailVerified: [false]
        });
    }

    private updateValidators(userType: UserType): void {
        const legalCompanyName = this.userForm.get('legalCompanyName');
        const countryOfRegistration = this.userForm.get('countryOfRegistration');

        if (userType === UserType.COMPANY) {
            legalCompanyName?.setValidators([Validators.required, Validators.maxLength(255)]);
            countryOfRegistration?.setValidators([Validators.required, Validators.maxLength(100)]);
        } else {
            legalCompanyName?.clearValidators();
            countryOfRegistration?.clearValidators();
        }

        legalCompanyName?.updateValueAndValidity();
        countryOfRegistration?.updateValueAndValidity();
    }

    private populateForm(user: User): void {
        this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            countryCodePhone: user.countryCodePhone,
            userType: user.userType,
            roleName: user.role.name,
            legalCompanyName: user.legalCompanyName,
            countryOfRegistration: user.countryOfRegistration,
            streetAddress: user.streetAddress,
            houseNumber: user.houseNumber,
            zipCode: user.zipCode,
            city: user.city,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified
        });

        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
    }

    private loadRoles(): void {
        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles.set(roles);
            },
            error: (error) => {
                this.notificationService.error('Unable to load roles');
                console.error('Error loading roles:', error);
            }
        });
    }

    // ============================================
    // PHOTO UPLOAD MANAGEMENT
    // ============================================

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.processFile(input.files[0]);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);

        const files = event.dataTransfer?.files;
        if (files && files[0]) {
            this.processFile(files[0]);
        }
    }

    private processFile(file: File): void {
        const validation = this.fileUploadService.validateImageFile(file);

        if (!validation.isValid) {
            this.notificationService.error(validation.error || 'Invalid file', 'Profile Picture');
            return;
        }

        this.fileUploadService.createImagePreview(file).subscribe({
            next: (preview) => {
                const oldPreview = this.profilePicturePreview();
                if (oldPreview?.url) {
                    this.fileUploadService.revokeObjectUrl(oldPreview.url);
                }

                this.profilePicturePreview.set(preview);
                this.selectedProfileImageFile.set(file);
                this.notificationService.success('Photo added successfully', 'Profile Picture');
            },
            error: (error) => {
                this.notificationService.error('Error loading photo', 'Profile Picture');
                console.error('Error processing image:', error);
            }
        });
    }

    removeProfilePicture(): void {
        const preview = this.profilePicturePreview();
        if (preview?.url) {
            this.fileUploadService.revokeObjectUrl(preview.url);
        }
        this.profilePicturePreview.set(null);
        this.selectedProfileImageFile.set(null);
    }

    triggerFileInput(): void {
        const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
        fileInput?.click();
    }

    // ============================================
    // FORM MANAGEMENT
    // ============================================

    onSubmit(): void {
        if (this.userForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);

            const formValue = this.userForm.value;
            const profileImageFile = this.selectedProfileImageFile();

            if (this.isEditMode) {
                const updateInput: UpdateUserInput = {
                    firstName: formValue.firstName,
                    lastName: formValue.lastName,
                    email: formValue.email,
                    phoneNumber: formValue.phoneNumber,
                    countryCodePhone: formValue.countryCodePhone,
                    userType: formValue.userType,
                    legalCompanyName: formValue.legalCompanyName,
                    countryOfRegistration: formValue.countryOfRegistration,
                    streetAddress: formValue.streetAddress,
                    houseNumber: formValue.houseNumber,
                    zipCode: formValue.zipCode,
                    city: formValue.city,
                    isActive: formValue.isActive
                };

                this.formSubmit.emit({
                    input: updateInput,
                    profileImageFile
                });
            } else {
                const createInput: CreateUserInput = {
                    firstName: formValue.firstName,
                    lastName: formValue.lastName,
                    email: formValue.email,
                    password: formValue.password,
                    phoneNumber: formValue.phoneNumber,
                    countryCodePhone: formValue.countryCodePhone,
                    userType: formValue.userType,
                    roleName: formValue.roleName,
                    legalCompanyName: formValue.legalCompanyName,
                    countryOfRegistration: formValue.countryOfRegistration,
                    streetAddress: formValue.streetAddress,
                    houseNumber: formValue.houseNumber,
                    zipCode: formValue.zipCode,
                    city: formValue.city,
                    isActive: formValue.isActive,
                    isEmailVerified: formValue.isEmailVerified
                };

                this.formSubmit.emit({
                    input: createInput,
                    profileImageFile
                });
            }
        } else {
            this.markFormGroupTouched(this.userForm);
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
        const field = this.userForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.userForm.get(fieldName);

        if (field?.errors) {
            if (field.errors['required']) return 'This field is required';
            if (field.errors['email']) return 'Invalid email';
            if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters`;
            if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} characters`;
        }

        return '';
    }

    resetSubmitting(): void {
        this.isSubmitting.set(false);
    }
}