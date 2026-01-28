// src/app/features/profile/pages/profile-page/profile-page.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ProfileImageUploaderComponent } from '../../components/profile-image-uploader/profile-image-uploader.component';
import { ProfileInfoComponent } from '../../components/profile-info/profile-info.component';
import { UserProfile, calculateProfileCompleteness } from '../../models/profile.interface';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ProfileImageUploaderComponent,
        ProfileInfoComponent
    ],
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
    private profileService = inject(ProfileService);

    profile: UserProfile | null = null;
    isLoading = false;
    errorMessage = '';

    get profileCompleteness(): number {
        if (!this.profile) return 0;
        return calculateProfileCompleteness(this.profile);
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.profileService.getCurrentProfile().subscribe({
            next: (profile) => {
                this.profile = profile;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error.message || 'Failed to load profile';
                this.isLoading = false;
            }
        });
    }

    onImageUploaded(newImagePath: string): void {
        if (this.profile) {
            this.profile = {
                ...this.profile,
                profileImage: newImagePath
            };
        }
    }

    onImageDeleted(): void {
        if (this.profile) {
            this.profile = {
                ...this.profile,
                profileImage: null
            };
        }
    }
}