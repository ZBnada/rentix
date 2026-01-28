/**
 * Énumérations et Types pour le Module d'Authentification
 */

export enum UserType {
    INDIVIDUAL = 'INDIVIDUAL',
    COMPANY = 'COMPANY'
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    countryCodePhone: string;
    phoneNumber: string;
    userType: UserType;
    legalCompanyName?: string;
    countryOfRegistration?: string;
    streetAddress?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
}

export interface VerifyEmailInput {
    email: string;
    code: string;
}

export interface ForgotPasswordInput {
    email: string;
}

export interface ResetPasswordInput {
    email: string;
    code: string;
    newPassword: string;
}

/**
 * Ressource Utilisateur
 * MISE À JOUR avec profileImage et initials
 */
export interface UserResource {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userType: UserType;
    isEmailVerified: boolean;
    profileImage?: string | null;  // ← AJOUTÉ: URL complète de l'image de profil
    initials?: string;             // ← AJOUTÉ: Initiales calculées (ex: "JD")
    role: {
        name: string;
        weight: number;
    };
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResource;
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

export interface ResendCodeResponse {
    success: boolean;
    message: string;
    expiresAt: Date;
}

export interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

export const COUNTRIES: Country[] = [
    { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳' },
    { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
    { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
    { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
    { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
    { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' }
];