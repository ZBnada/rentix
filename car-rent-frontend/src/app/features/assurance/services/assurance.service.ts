import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface pour Assurance
 */
export interface Assurance {
    id: string;
    vehiculeId: string;
    vehicule?: any;
    prestataire: string;
    dateDebut: Date;
    dateFinValidite: Date;
    montantTotal: number;
    dateOperation: Date;
    numeroPolice?: string;
    observations?: string;
    documentUrl?: string | null;
    reglements: AssuranceReglement[];
    saisiPar?: string;
    modifiePar?: string;
    saisiLe: Date;
    modifieLe: Date;
    estActif: boolean;
}

/**
 * Interface pour AssuranceReglement
 */
export interface AssuranceReglement {
    id: string;
    assuranceId: string;
    modePaiementId: string;
    modePaiement?: any;
    designation?: string;
    montant: number;
    echeance?: Date;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
    dateOperation: Date;
    createdAt: Date;
    estActif: boolean;
}

/**
 * DTO pour création d'assurance
 */
export interface CreateAssuranceDto {
    vehiculeId: string;
    prestataire: string;
    dateDebut: string | Date;
    dateFinValidite: string | Date;
    montantTotal: number;
    dateOperation: string | Date;
    numeroPolice?: string;
    observations?: string;
    documentUrl?: string;
    reglements: CreateAssuranceReglementDto[];
    saisiPar?: string;
}

/**
 * DTO pour création de règlement
 */
export interface CreateAssuranceReglementDto {
    modePaiementId: string;
    designation?: string;
    montant: number;
    echeance?: string | Date;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
    dateOperation: string | Date;
}

/**
 * DTO pour mise à jour d'assurance
 */
export interface UpdateAssuranceDto extends Partial<CreateAssuranceDto> {
    id: string;
    modifiePar?: string;
}

/**
 * Service pour la gestion des assurances
 */
@Injectable({
    providedIn: 'root',
})
export class AssuranceService {
    // URL directe - MODIFIER selon votre configuration
    private readonly apiUrl = 'http://localhost:3000/graphql';

    constructor(private http: HttpClient) {}

    /**
     * Récupérer toutes les assurances actives
     */
    findAllAssurances(): Observable<Assurance[]> {
        const query = `
      query {
        assurances {
          id
          vehiculeId
          prestataire
          dateDebut
          dateFinValidite
          montantTotal
          dateOperation
          numeroPolice
          observations
          documentUrl
          saisiPar
          modifiePar
          saisiLe
          modifieLe
          estActif
        }
      }
    `;

        return this.http
            .post<any>(this.apiUrl, { query })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.assurances || [];
                })
            );
    }

    /**
     * Récupérer une assurance par son ID
     */
    findAssuranceById(id: string): Observable<Assurance> {
        const query = `
      query($id: String!) {
        assurance(id: $id) {
          id
          vehiculeId
          prestataire
          dateDebut
          dateFinValidite
          montantTotal
          dateOperation
          numeroPolice
          observations
          documentUrl
          saisiPar
          modifiePar
          saisiLe
          modifieLe
          estActif
        }
      }
    `;

        return this.http
            .post<any>(this.apiUrl, {
                query,
                variables: { id },
            })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.assurance;
                })
            );
    }

    /**
     * Récupérer les assurances d'un véhicule
     */
    findAssurancesByVehicule(vehiculeId: string): Observable<Assurance[]> {
        const query = `
      query($vehiculeId: String!) {
        assurancesByVehicule(vehiculeId: $vehiculeId) {
          id
          vehiculeId
          prestataire
          dateDebut
          dateFinValidite
          montantTotal
          dateOperation
          numeroPolice
          observations
          documentUrl
          saisiLe
          modifieLe
          estActif
        }
      }
    `;

        return this.http
            .post<any>(this.apiUrl, {
                query,
                variables: { vehiculeId },
            })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.assurancesByVehicule || [];
                })
            );
    }

    /**
     * Récupérer les assurances qui expirent bientôt
     */
    findAssurancesExpiringSoon(daysBeforeExpiry: number = 30): Observable<Assurance[]> {
        const query = `
      query($daysBeforeExpiry: Int!) {
        assurancesExpiringSoon(daysBeforeExpiry: $daysBeforeExpiry) {
          id
          vehiculeId
          prestataire
          dateDebut
          dateFinValidite
          montantTotal
          numeroPolice
          estActif
        }
      }
    `;

        return this.http
            .post<any>(this.apiUrl, {
                query,
                variables: { daysBeforeExpiry },
            })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.assurancesExpiringSoon || [];
                })
            );
    }

    /**
     * Créer une nouvelle assurance
     */
    createAssurance(input: CreateAssuranceDto): Observable<Assurance> {
        // Convertir les dates en string ISO
        const formattedInput = {
            ...input,
            dateDebut: this.formatDateForAPI(input.dateDebut),
            dateFinValidite: this.formatDateForAPI(input.dateFinValidite),
            dateOperation: this.formatDateForAPI(input.dateOperation),
            reglements: input.reglements.map(r => ({
                ...r,
                dateOperation: this.formatDateForAPI(r.dateOperation),
                echeance: r.echeance ? this.formatDateForAPI(r.echeance) : undefined,
            })),
        };

        const mutation = `
      mutation($input: CreateAssuranceInput!) {
        createAssurance(input: $input) {
          id
          vehiculeId
          prestataire
          dateDebut
          dateFinValidite
          montantTotal
          dateOperation
          numeroPolice
          observations
          documentUrl
          saisiLe
          estActif
        }
      }
    `;

        return this.http
            .post<any>(this.apiUrl, {
                query: mutation,
                variables: { input: formattedInput },
            })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.createAssurance;
                })
            );
    }

    /**
     * Mettre à jour une assurance
     */
    updateAssurance(input: UpdateAssuranceDto): Observable<Assurance> {
        // Convertir les dates en string ISO
        const formattedInput: any = { ...input };
        if (input.dateDebut) formattedInput.dateDebut = this.formatDateForAPI(input.dateDebut);
        if (input.dateFinValidite) formattedInput.dateFinValidite = this.formatDateForAPI(input.dateFinValidite);
        if (input.dateOperation) formattedInput.dateOperation = this.formatDateForAPI(input.dateOperation);
        if (input.reglements) {
            formattedInput.reglements = input.reglements.map(r => ({
                ...r,
                dateOperation: this.formatDateForAPI(r.dateOperation),
                echeance: r.echeance ? this.formatDateForAPI(r.echeance) : undefined,
            }));
        }

        const mutation = `
      mutation($input: UpdateAssuranceInput!) {
        updateAssurance(input: $input) {
          id
          vehiculeId
          prestataire
          dateDebut
          dateFinValidite
          montantTotal
          dateOperation
          numeroPolice
          observations
          documentUrl
          modifieLe
          estActif
        }
      }
    `;

        return this.http
            .post<any>(this.apiUrl, {
                query: mutation,
                variables: { input: formattedInput },
            })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.updateAssurance;
                })
            );
    }

    /**
     * Supprimer une assurance (soft delete)
     */
    deleteAssurance(id: string): Observable<boolean> {
        const mutation = `
      mutation($id: String!) {
        deleteAssurance(id: $id)
      }
    `;

        return this.http
            .post<any>(this.apiUrl, {
                query: mutation,
                variables: { id },
            })
            .pipe(
                map((response) => {
                    if (response.errors) {
                        console.error('GraphQL Errors:', response.errors);
                        throw new Error(response.errors[0]?.message || 'GraphQL Error');
                    }
                    return response.data?.deleteAssurance || false;
                })
            );
    }

    /**
     * Upload d'un document d'assurance
     */
    uploadDocument(assuranceId: string, file: File): Observable<{ documentUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        // REST endpoint pour l'upload
        return this.http.post<{ documentUrl: string }>(
            `http://localhost:3000/assurances/${assuranceId}/document`,
            formData,
        );
    }

    /**
     * Supprimer un document d'assurance
     */
    deleteDocument(assuranceId: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(
            `http://localhost:3000/assurances/${assuranceId}/document`,
        );
    }

    /**
     * Formater une date pour l'API (ISO string)
     */
    private formatDateForAPI(date: string | Date | undefined): string | undefined {
        if (!date) return undefined;

        if (typeof date === 'string') {
            // Si c'est déjà une string, vérifier le format
            if (date.includes('T')) {
                return date; // Déjà au format ISO
            }
            // Format YYYY-MM-DD -> convertir en ISO
            return new Date(date).toISOString();
        }

        // Si c'est un objet Date
        return date.toISOString();
    }
}