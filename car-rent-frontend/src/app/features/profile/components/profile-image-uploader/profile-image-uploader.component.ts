// src/app/features/profile/components/profile-image-uploader/profile-image-uploader.component.ts

import { Component, Input, Output, EventEmitter, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../../../core/services/file-upload.service';
import { ProfileService } from '../../services/profile.service';

@Component({
    selector: 'app-profile-image-uploader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile-image-uploader.component.html',
    styleUrls: ['./profile-image-uploader.component.css']
})
export class ProfileImageUploaderComponent implements OnDestroy {
    @Input() firstName: string = '';
    @Input() lastName: string = '';
    @Input() profileImage: string | null | undefined = null; // Fixed: Added undefined
    @Output() imageUploaded = new EventEmitter<string>();
    @Output() imageDeleted = new EventEmitter<void>();

    private fileUploadService = inject(FileUploadService);
    private profileService = inject(ProfileService);

    isUploading = false;
    errorMessage = '';
    private previewUrl: string | null = null;

    get initials(): string {
        return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
    }

    get imageUrl(): string | null {
        if (this.previewUrl) return this.previewUrl;
        // Handle undefined by converting to null
        return this.fileUploadService.getFullImageUrl(this.profileImage ?? null);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        this.errorMessage = '';

        // Validate file
        const validation = this.fileUploadService.validateImageFile(file);
        if (!validation.isValid) {
            this.errorMessage = validation.error || 'Invalid file';
            return;
        }

        // Upload file
        this.uploadFile(file);
    }

    private uploadFile(file: File): void {
        this.isUploading = true;
        this.errorMessage = '';

        // Create preview
        this.fileUploadService.createImagePreview(file).subscribe({
            next: (preview) => {
                this.previewUrl = preview.url;
            }
        });

        // Upload to server
        this.profileService.uploadProfileImage(file).subscribe({
            next: (profile) => {
                this.isUploading = false;
                this.imageUploaded.emit(profile.profileImage ?? '');

                // Clean up preview
                if (this.previewUrl) {
                    this.fileUploadService.revokeObjectUrl(this.previewUrl);
                    this.previewUrl = null;
                }
            },
            error: (error) => {
                this.isUploading = false;
                this.errorMessage = error.message || 'Failed to upload image';

                // Clean up preview on error
                if (this.previewUrl) {
                    this.fileUploadService.revokeObjectUrl(this.previewUrl);
                    this.previewUrl = null;
                }
            }
        });
    }

    deleteImage(): void {
        if (!confirm('Are you sure you want to delete your profile picture?')) {
            return;
        }

        this.isUploading = true;
        this.errorMessage = '';

        this.profileService.deleteProfileImage().subscribe({
            next: () => {
                this.isUploading = false;
                this.imageDeleted.emit();
            },
            error: (error) => {
                this.isUploading = false;
                this.errorMessage = error.message || 'Failed to delete image';
            }
        });
    }

    ngOnDestroy(): void {
        if (this.previewUrl) {
            this.fileUploadService.revokeObjectUrl(this.previewUrl);
        }
    }
}