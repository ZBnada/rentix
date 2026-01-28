// src/app/features/profile/components/profile-info/profile-info.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile, UserType, calculateProfileCompleteness } from '../../models/profile.interface';

@Component({
    selector: 'app-profile-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent {
    @Input() profile: UserProfile | null = null;

    userTypeEnum = UserType;

    get profileCompleteness(): number {
        if (!this.profile) return 0;
        return calculateProfileCompleteness(this.profile);
    }
}