// src/app/features/profile/components/profile-header/profile-header.component.ts

import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfile, getInitials } from '../../models/profile.interface';
import { FileUploadService } from '../../../../core/services/file-upload.service';

@Component({
    selector: 'app-profile-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './profile-header.component.html',
    styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent {
    @Input() profile: UserProfile | null = null;
    @Input() profileCompleteness: number = 0;

    private fileUploadService = inject(FileUploadService);

    get fullName(): string {
        if (!this.profile) return '';
        return `${this.profile.firstName} ${this.profile.lastName}`;
    }

    get initials(): string {
        if (!this.profile) return '';
        return getInitials(this.profile);
    }

    get imageUrl(): string | null {
        if (!this.profile) return null;
        return this.fileUploadService.getFullImageUrl(this.profile.profileImage);
    }

    get memberSinceDays(): number {
        if (!this.profile) return 0;
        const created = new Date(this.profile.createdAt);
        const now = new Date();
        const diff = now.getTime() - created.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get daysSinceLastLogin(): number {
        if (!this.profile?.lastLoginAt) return 0;
        const lastLogin = new Date(this.profile.lastLoginAt);
        const now = new Date();
        const diff = now.getTime() - lastLogin.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
}