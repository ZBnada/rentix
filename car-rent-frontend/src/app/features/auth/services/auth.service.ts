import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthResponse,
  MessageResponse,
  ResendCodeResponse,
  UserResource,
  UserType
} from '../models/auth.types';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

/**
 * Interface pour le payload JWT décodé
 */
interface JwtPayload {
  sub: string;              // User ID
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  profileImage?: string | null;  // URL complète de l'image ou null
  initials?: string;             // Initiales calculées par le backend
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly graphqlUrl = 'http://localhost:3000/graphql';

  private currentUserSubject = new BehaviorSubject<UserResource | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Charger l'utilisateur depuis le localStorage au démarrage
   */
  private loadUserFromStorage(): void {
    const token = this.getAccessToken();
    const user = localStorage.getItem('currentUser');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

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
   * INSCRIPTION
   */
  register(input: RegisterInput): Observable<MessageResponse> {
    const mutation = `
      mutation Register($registerInput: RegisterInput!) {
        register(registerInput: $registerInput) {
          success
          message
        }
      }
    `;

    return this.executeGraphQL<{ register: MessageResponse }>(mutation, { registerInput: input }).pipe(
        map(response => response.register)
    );
  }

  /**
   * VÉRIFICATION EMAIL
   */
  verifyEmail(input: VerifyEmailInput): Observable<MessageResponse> {
    const mutation = `
      mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {
        verifyEmail(verifyEmailInput: $verifyEmailInput) {
          success
          message
        }
      }
    `;

    return this.executeGraphQL<{ verifyEmail: MessageResponse }>(mutation, { verifyEmailInput: input }).pipe(
        map(response => response.verifyEmail)
    );
  }

  /**
   * RENVOYER CODE DE VÉRIFICATION
   */
  resendVerificationCode(email: string): Observable<ResendCodeResponse> {
    const mutation = `
      mutation ResendCode($email: String!) {
        resendVerificationCode(email: $email) {
          success
          message
          expiresAt
        }
      }
    `;

    return this.executeGraphQL<{ resendVerificationCode: ResendCodeResponse }>(mutation, { email }).pipe(
        map(response => response.resendVerificationCode)
    );
  }

  /**
   * CONNEXION
   */
  login(input: LoginInput): Observable<AuthResponse> {
    const mutation = `
      mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
          accessToken
          refreshToken
          user {
            id
            firstName
            lastName
            email
            phoneNumber
            userType
            isEmailVerified
            profileImage
            initials
            role {
              name
              weight
            }
          }
        }
      }
    `;

    return this.executeGraphQL<{ login: AuthResponse }>(mutation, { loginInput: input }).pipe(
        map(response => response.login),
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        })
    );
  }

  /**
   * MOT DE PASSE OUBLIÉ
   */
  forgotPassword(input: ForgotPasswordInput): Observable<MessageResponse> {
    const mutation = `
      mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {
        forgotPassword(forgotPasswordInput: $forgotPasswordInput) {
          success
          message
        }
      }
    `;

    return this.executeGraphQL<{ forgotPassword: MessageResponse }>(mutation, { forgotPasswordInput: input }).pipe(
        map(response => response.forgotPassword)
    );
  }

  /**
   * RÉINITIALISER MOT DE PASSE
   */
  resetPassword(input: ResetPasswordInput): Observable<MessageResponse> {
    const mutation = `
      mutation ResetPassword($resetPasswordInput: ResetPasswordInput!) {
        resetPassword(resetPasswordInput: $resetPasswordInput) {
          success
          message
        }
      }
    `;

    return this.executeGraphQL<{ resetPassword: MessageResponse }>(mutation, { resetPasswordInput: input }).pipe(
        map(response => response.resetPassword)
    );
  }

  /**
   * RAFRAÎCHIR TOKEN
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const mutation = `
      mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
          accessToken
          refreshToken
        }
      }
    `;

    return this.executeGraphQL<{ refreshToken: AuthResponse }>(mutation, { refreshToken }).pipe(
        map(response => response.refreshToken),
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
        })
    );
  }

  /**
   * DÉCONNEXION
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  /**
   * GESTION DES TOKENS
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Récupérer l'utilisateur courant
   * Priorité : BehaviorSubject > localStorage > JWT
   */
  getCurrentUser(): UserResource | null {
    // 1. D'abord essayer depuis le BehaviorSubject (en mémoire)
    const userFromSubject = this.currentUserSubject.value;
    if (userFromSubject) {
      return userFromSubject;
    }

    // 2. Ensuite depuis localStorage
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        this.currentUserSubject.next(parsedUser);
        return parsedUser;
      } catch (error) {
        console.error('Error parsing user from storage:', error);
      }
    }

    // 3. En dernier recours, décoder depuis le JWT
    return this.getUserFromToken();
  }

  /**
   * Récupérer l'utilisateur depuis le JWT (fallback)
   * Utile si le localStorage est vidé mais le token existe encore
   */
  private getUserFromToken(): UserResource | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);

      // Construire un UserResource minimal depuis le JWT
      const user: UserResource = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: '',
        userType: UserType.INDIVIDUAL,  // Utiliser l'enum
        isEmailVerified: true,
        profileImage: payload.profileImage || null,
        initials: payload.initials || this.calculateInitials(payload.firstName, payload.lastName),
        role: {
          name: '',
          weight: 0
        }
      };

      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Décoder le JWT sans vérification de signature
   * (La vérification se fait côté backend)
   */
  private decodeToken(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
          atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid token format');
    }
  }

  /**
   * Calculer les initiales depuis le prénom et nom
   */
  private calculateInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  /**
   * Rafraîchir le profil utilisateur
   * Utile après upload d'une nouvelle photo de profil
   */
  refreshUserProfile(): void {
    const user = this.getUserFromToken();
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isUserAuthenticated(): boolean {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);

      // Vérifier si le token n'est pas expiré
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      }

      return true;
    } catch {
      return false;
    }
  }
}