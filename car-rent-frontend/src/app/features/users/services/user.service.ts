// src/app/modules/users/services/user.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
    User,
    CreateUserInput,
    UpdateUserInput,
    UserFilterInput,
    UserListResponse,
    UserStats,
    getUserInitials,
    getProfileImageUrl
} from '../models';

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly graphqlUrl = 'http://localhost:3000/graphql';
    private readonly apiUrl = 'http://localhost:3000';
    private readonly baseUrl = 'http://localhost:3000';

    /**
     * Exécuter une requête GraphQL
     */
    private executeGraphQL<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            query,
            variables: variables || {}
        };

        return this.http.post<GraphQLResponse<T>>(this.graphqlUrl, body, { headers }).pipe(
            map(response => {
                if (response.errors && response.errors.length > 0) {
                    throw new Error(response.errors[0].message);
                }
                return response.data;
            }),
            catchError(error => {
                const message = error.error?.errors?.[0]?.message || error.message || 'Une erreur est survenue';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * CRÉER UN UTILISATEUR
     */
    createUser(input: CreateUserInput, profileImageFile?: File | null): Observable<User> {
        // Si une image est fournie, utiliser l'upload multipart
        if (profileImageFile) {
            return this.createUserWithImage(input, profileImageFile);
        }

        // Sinon, utiliser GraphQL classique
        const mutation = `
            mutation CreateUser($input: CreateUserInput!) {
                createUser(createUserInput: $input) {
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
                    isActive
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

        return this.executeGraphQL<{ createUser: User }>(mutation, { input }).pipe(
            map(response => response.createUser)
        );
    }

    /**
     * CRÉER UN UTILISATEUR AVEC IMAGE (multipart/form-data)
     */
    private createUserWithImage(input: CreateUserInput, file: File): Observable<User> {
        const formData = new FormData();

        // Ajouter le fichier
        formData.append('file', file);

        // Ajouter les données utilisateur
        formData.append('firstName', input.firstName);
        formData.append('lastName', input.lastName);
        formData.append('email', input.email);
        formData.append('password', input.password);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('countryCodePhone', input.countryCodePhone || '+216');
        formData.append('userType', input.userType);
        formData.append('roleName', input.roleName);
        formData.append('isActive', String(input.isActive ?? true));
        formData.append('isEmailVerified', String(input.isEmailVerified ?? false));

        // Ajouter les champs optionnels
        if (input.legalCompanyName) formData.append('legalCompanyName', input.legalCompanyName);
        if (input.countryOfRegistration) formData.append('countryOfRegistration', input.countryOfRegistration);
        if (input.streetAddress) formData.append('streetAddress', input.streetAddress);
        if (input.houseNumber) formData.append('houseNumber', input.houseNumber);
        if (input.zipCode) formData.append('zipCode', input.zipCode);
        if (input.city) formData.append('city', input.city);
        if (input.googleId) formData.append('googleId', input.googleId);

        return this.http.post<User>(`${this.apiUrl}/users/create-with-image`, formData).pipe(
            catchError(error => {
                const message = error.error?.message || error.message || 'Erreur lors de la création';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * METTRE À JOUR UN UTILISATEUR
     */
    updateUser(userId: string, input: UpdateUserInput, profileImageFile?: File | null): Observable<User> {
        if (profileImageFile) {
            return this.updateUserWithImage(userId, input, profileImageFile);
        }

        const mutation = `
            mutation UpdateUser($input: UpdateUserInput!) {
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
                    role {
                        id
                        name
                    }
                    updatedAt
                }
            }
        `;

        return this.executeGraphQL<{ updateUser: User }>(mutation, { input: { ...input, id: userId } }).pipe(
            map(response => response.updateUser)
        );
    }

    /**
     * METTRE À JOUR UN UTILISATEUR AVEC IMAGE
     */
    private updateUserWithImage(userId: string, input: UpdateUserInput, file: File): Observable<User> {
        const formData = new FormData();

        formData.append('file', file);

        if (input.firstName) formData.append('firstName', input.firstName);
        if (input.lastName) formData.append('lastName', input.lastName);
        if (input.email) formData.append('email', input.email);
        if (input.phoneNumber) formData.append('phoneNumber', input.phoneNumber);
        if (input.countryCodePhone) formData.append('countryCodePhone', input.countryCodePhone);
        if (input.userType) formData.append('userType', input.userType);
        if (input.legalCompanyName) formData.append('legalCompanyName', input.legalCompanyName);
        if (input.countryOfRegistration) formData.append('countryOfRegistration', input.countryOfRegistration);
        if (input.streetAddress) formData.append('streetAddress', input.streetAddress);
        if (input.houseNumber) formData.append('houseNumber', input.houseNumber);
        if (input.zipCode) formData.append('zipCode', input.zipCode);
        if (input.city) formData.append('city', input.city);
        if (input.isActive !== undefined) formData.append('isActive', String(input.isActive));

        return this.http.put<User>(`${this.apiUrl}/users/${userId}/update-with-image`, formData).pipe(
            catchError(error => {
                const message = error.error?.message || error.message || 'Erreur lors de la mise à jour';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * RÉCUPÉRER TOUS LES UTILISATEURS (sans filtre)
     */
    getAllUsers(filters?: UserFilterInput): Observable<UserListResponse> {
        if (filters) {
            return this.getUsersWithFilters(filters);
        }

        const query = `
            query GetAllUsers {
                users {
                    users {
                        id
                        firstName
                        lastName
                        email
                        phoneNumber
                        userType
                        profileImage
                        isActive
                        isEmailVerified
                        role {
                            id
                            name
                        }
                        createdAt
                    }
                    total
                }
            }
        `;

        return this.executeGraphQL<{ users: UserListResponse }>(query).pipe(
            map(response => response.users)
        );
    }

    /**
     * RÉCUPÉRER UN UTILISATEUR PAR ID
     */
    getUserById(id: string): Observable<User> {
        const query = `
            query GetUser($id: ID!) {
                user(id: $id) {
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
                    isActive
                    role {
                        id
                        name
                        description
                        weight
                    }
                    createdAt
                    updatedAt
                    lastLoginAt
                }
            }
        `;

        return this.executeGraphQL<{ user: User }>(query, { id }).pipe(
            map(response => response.user)
        );
    }

    /**
     * SUPPRIMER UN UTILISATEUR
     */
    deleteUser(id: string): Observable<boolean> {
        const mutation = `
            mutation DeleteUser($id: ID!) {
                removeUser(id: $id)
            }
        `;

        return this.executeGraphQL<{ removeUser: boolean }>(mutation, { id }).pipe(
            map(response => response.removeUser)
        );
    }

    /**
     * ACTIVER/DÉSACTIVER UN UTILISATEUR
     */
    toggleActiveStatus(userId: string): Observable<User> {
        const mutation = `
            mutation ToggleUserStatus($userId: ID!) {
                toggleUserStatus(userId: $userId) {
                    id
                    firstName
                    lastName
                    email
                    isActive
                    role {
                        id
                        name
                    }
                }
            }
        `;

        return this.executeGraphQL<{ toggleUserStatus: User }>(mutation, { userId }).pipe(
            map(response => response.toggleUserStatus)
        );
    }

    /**
     * VÉRIFIER L'EMAIL D'UN UTILISATEUR
     */
    verifyUserEmail(userId: string): Observable<User> {
        const mutation = `
            mutation VerifyUserEmail($userId: ID!) {
                verifyUserEmail(userId: $userId) {
                    id
                    firstName
                    lastName
                    email
                    isEmailVerified
                    emailVerifiedAt
                }
            }
        `;

        return this.executeGraphQL<{ verifyUserEmail: User }>(mutation, { userId }).pipe(
            map(response => response.verifyUserEmail)
        );
    }

    /**
     * RÉCUPÉRER LES STATISTIQUES
     */
    getUserStats(): Observable<UserStats> {
        const query = `
            query GetUserStats {
                userStats {
                    totalUsers
                    activeUsers
                    inactiveUsers
                    verifiedEmails
                    unverifiedEmails
                    individualUsers
                    companyUsers
                }
            }
        `;

        return this.executeGraphQL<{ userStats: UserStats }>(query).pipe(
            map(response => response.userStats)
        );
    }

    /**
     * RÉCUPÉRER LES UTILISATEURS AVEC FILTRES ET PAGINATION
     */
    getUsersWithFilters(filter: UserFilterInput): Observable<UserListResponse> {
        const query = `
            query GetUsersWithFilters($filter: UserFilterInput) {
                users(filter: $filter) {
                    users {
                        id
                        firstName
                        lastName
                        email
                        phoneNumber
                        userType
                        profileImage
                        isActive
                        isEmailVerified
                        role {
                            id
                            name
                        }
                        createdAt
                    }
                    total
                }
            }
        `;

        return this.executeGraphQL<{ users: UserListResponse }>(query, { filter }).pipe(
            map(response => response.users)
        );
    }

    /**
     * HELPER: Obtenir les initiales d'un utilisateur
     */
    getUserInitials(user: User): string {
        return getUserInitials(user);
    }

    /**
     * HELPER: Obtenir l'URL de la photo de profil
     */
    getProfileImageUrl(user: User): string | null {
        return getProfileImageUrl(user, this.baseUrl);
    }
}