// src/app/features/profile/services/profile.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
    UserProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    ChangeEmailRequest,
} from '../models/profile.interface';

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{ message: string; extensions?: any }>;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly http = inject(HttpClient);
    private readonly graphqlUrl = 'http://localhost:3000/graphql';
    private readonly apiUrl = 'http://localhost:3000';

    // Current user profile state
    private currentProfileSubject = new BehaviorSubject<UserProfile | null>(null);
    public currentProfile$ = this.currentProfileSubject.asObservable();

    /**
     * Execute GraphQL query/mutation
     * L'interceptor ajoute automatiquement le header Authorization
     */
    private executeGraphQL<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
        const body = {
            query,
            variables: variables || {}
        };

        console.log('GraphQL Request:', { query, variables });

        return this.http.post<GraphQLResponse<T>>(this.graphqlUrl, body).pipe(
            tap(response => {
                console.log('GraphQL Response:', response);
            }),
            map(response => {
                if (response.errors && response.errors.length > 0) {
                    const error = response.errors[0];
                    console.error('GraphQL Error:', error);
                    throw new Error(error.message);
                }
                return response.data;
            }),
            catchError(error => {
                console.error('GraphQL Request Failed:', error);
                const message = error.error?.errors?.[0]?.message || error.message || 'An error occurred';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * Get current user profile (GraphQL)
     */
    getCurrentProfile(): Observable<UserProfile> {
        const query = `
            query GetMyProfile {
                me {
                    id
                    firstName
                    lastName
                    email
                    phoneNumber
                    countryCodePhone
                    userType
                    legalCompanyName
                    countryOfRegistration
                    streetAddress
                    houseNumber
                    zipCode
                    city
                    profileImage
                    isEmailVerified
                    emailVerifiedAt
                    lastLoginAt
                    isActive
                    initials
                    role {
                        id
                        name
                        description
                        weight
                    }
                    createdAt
                    updatedAt
                }
            }
        `;

        return this.executeGraphQL<{ me: UserProfile }>(query).pipe(
            map(response => response.me),
            tap(profile => {
                console.log('Profile loaded successfully:', profile);
                this.currentProfileSubject.next(profile);
            }),
            catchError(error => {
                console.error('Failed to load profile:', error);
                this.currentProfileSubject.next(null);
                return throwError(() => error);
            })
        );
    }

    /**
     * Update current user profile (GraphQL)
     */
    updateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
        const mutation = `
            mutation UpdateMyProfile($input: UpdateUserInput!) {
                updateUser(updateUserInput: $input) {
                    id
                    firstName
                    lastName
                    email
                    phoneNumber
                    countryCodePhone
                    userType
                    legalCompanyName
                    countryOfRegistration
                    streetAddress
                    houseNumber
                    zipCode
                    city
                    profileImage
                    isActive
                    initials
                    role {
                        id
                        name
                        description
                    }
                    updatedAt
                }
            }
        `;

        const currentProfile = this.currentProfileSubject.value;
        if (!currentProfile) {
            return throwError(() => new Error('No profile loaded'));
        }

        const input = {
            id: currentProfile.id,
            ...data
        };

        return this.executeGraphQL<{ updateUser: UserProfile }>(mutation, { input }).pipe(
            map(response => response.updateUser),
            tap(profile => this.currentProfileSubject.next(profile))
        );
    }

    /**
     * Change password (GraphQL)
     */
    changePassword(data: ChangePasswordRequest): Observable<boolean> {
        const mutation = `
            mutation ChangePassword($input: ChangePasswordInput!) {
                changePassword(changePasswordInput: $input)
            }
        `;

        return this.executeGraphQL<{ changePassword: boolean }>(mutation, { input: data }).pipe(
            map(response => response.changePassword)
        );
    }

    /**
     * Change email (GraphQL)
     */
    changeEmail(data: ChangeEmailRequest): Observable<{ message: string; newEmail: string }> {
        const mutation = `
            mutation ChangeEmail($input: ChangeEmailInput!) {
                changeEmail(changeEmailInput: $input)
            }
        `;

        return this.executeGraphQL<{ changeEmail: string }>(mutation, { input: data }).pipe(
            map(response => ({
                message: response.changeEmail,
                newEmail: data.newEmail
            })),
            tap(() => {
                const currentProfile = this.currentProfileSubject.value;
                if (currentProfile) {
                    this.currentProfileSubject.next({
                        ...currentProfile,
                        email: data.newEmail,
                        isEmailVerified: false,
                        emailVerifiedAt: null
                    });
                }
            })
        );
    }

    /**
     * Upload profile image (REST API - multipart/form-data)
     * L'interceptor ajoute automatiquement le header Authorization
     */
    uploadProfileImage(file: File): Observable<UserProfile> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<UserProfile>(
            `${this.apiUrl}/users/me/profile-image`,
            formData
        ).pipe(
            tap(profile => {
                this.currentProfileSubject.next(profile);
            }),
            catchError(error => {
                const message = error.error?.message || error.message || 'Failed to upload image';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * Delete profile image (REST API)
     * L'interceptor ajoute automatiquement le header Authorization
     */
    deleteProfileImage(): Observable<UserProfile> {
        return this.http.delete<UserProfile>(
            `${this.apiUrl}/users/me/profile-image`
        ).pipe(
            tap(profile => {
                this.currentProfileSubject.next(profile);
            }),
            catchError(error => {
                const message = error.error?.message || error.message || 'Failed to delete image';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * Get profile from cache
     */
    getCachedProfile(): UserProfile | null {
        return this.currentProfileSubject.value;
    }

    /**
     * Clear profile cache
     */
    clearProfile(): void {
        this.currentProfileSubject.next(null);
    }

    /**
     * Get full profile image URL
     */
    getProfileImageUrl(profileImage: string | null): string | null {
        if (!profileImage) return null;
        return profileImage;
    }
}