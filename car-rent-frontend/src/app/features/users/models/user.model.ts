// src/app/modules/users/models/user.model.ts

export enum UserType {
    INDIVIDUAL = 'INDIVIDUAL',
    COMPANY = 'COMPANY'
}

export interface Role {
    id: string;
    name: string;
    description: string;
    weight: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCodePhone: string;
    userType: UserType;
    legalCompanyName?: string;
    countryOfRegistration?: string;
    streetAddress?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    profileImage?: string | null;
    isEmailVerified: boolean;
    emailVerifiedAt?: string | null;
    googleId?: string;
    lastLoginAt?: string | null;
    isActive: boolean;
    role: Role;
    roleId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    countryCodePhone?: string;
    userType: UserType;
    roleName: string;
    legalCompanyName?: string;
    countryOfRegistration?: string;
    streetAddress?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    profileImage?: File | null; // Changed to File for file upload
    isEmailVerified?: boolean;
    isActive?: boolean;
    googleId?: string;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    countryCodePhone?: string;
    userType?: UserType;
    legalCompanyName?: string;
    countryOfRegistration?: string;
    streetAddress?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    isActive?: boolean;
    profileImage?: File | null;
}

export interface UserFilterInput {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: string;
    userType?: UserType;
    isEmailVerified?: boolean;
    isActive?: boolean;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface UserListResponse {
    users: User[];
    total: number;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedEmails: number;
    unverifiedEmails: number;
    individualUsers: number;
    companyUsers: number;
}

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

export interface ChangeEmailInput {
    newEmail: string;
    password: string;
}

// Helper function to get user initials
export function getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

// Helper function to get full name
export function getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
}

// Helper function to format user type
export function formatUserType(type: UserType): string {
    return type === UserType.INDIVIDUAL ? 'Particulier' : 'Entreprise';
}

// Helper function to get profile image URL or default
export function getProfileImageUrl(user: User, baseUrl: string = ''): string | null {
    if (!user.profileImage) {
        return null;
    }

    if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
        return user.profileImage;
    }

    return `${baseUrl}${user.profileImage}`;
}