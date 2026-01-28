// src/app/features/profile/models/profile.interface.ts

export enum UserType {
    INDIVIDUAL = 'INDIVIDUAL',
    COMPANY = 'COMPANY',
}

export interface Role {
    id: string;
    name: string;
    description: string;
    weight: number;
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCodePhone: string;
    userType: UserType;

    // Company specific fields
    legalCompanyName?: string | null;
    countryOfRegistration?: string | null;

    // Address fields
    streetAddress?: string | null;
    houseNumber?: string | null;
    zipCode?: string | null;
    city?: string | null;

    // Profile & authentication
    profileImage?: string | null;
    initials: string; // Added: backend provides this
    isEmailVerified: boolean;
    emailVerifiedAt?: Date | null;
    lastLoginAt?: Date | null;
    isActive: boolean;

    // Relations
    role?: Role;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    countryCodePhone?: string;
    userType?: UserType;
    legalCompanyName?: string | null;
    countryOfRegistration?: string | null;
    streetAddress?: string | null;
    houseNumber?: string | null;
    zipCode?: string | null;
    city?: string | null;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ChangeEmailRequest {
    password: string;
    newEmail: string;
}

export interface ProfileStats {
    accountAge: number; // in days
    lastLogin: Date | null;
    isEmailVerified: boolean;
    profileCompleteness: number; // percentage
}

// Helper functions
export function getFullName(profile: UserProfile): string {
    return `${profile.firstName} ${profile.lastName}`.trim();
}

export function getInitials(profile: UserProfile): string {
    // Use backend-provided initials if available
    if (profile.initials) {
        return profile.initials;
    }
    // Fallback calculation
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
}

export function getProfileImageUrl(profile: UserProfile): string | null {
    // Backend already returns full URLs via UserMapper
    return profile.profileImage || null;
}

export function calculateProfileCompleteness(profile: UserProfile): number {
    const fields = [
        profile.firstName,
        profile.lastName,
        profile.email,
        profile.phoneNumber,
        profile.streetAddress,
        profile.city,
        profile.zipCode,
        profile.profileImage,
    ];

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
}