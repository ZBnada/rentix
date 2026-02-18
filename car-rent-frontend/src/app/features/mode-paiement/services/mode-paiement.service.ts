import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface pour ModePaiement
 */
export interface ModePaiement {
    id: string;
    type: string;
    libelle: string;
    description?: string;
    icon?: string;
    estActif: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Interface pour la création/modification
 */
export interface CreateModePaiementDto {
    type: string;
    libelle: string;
    description?: string;
    icon?: string;
}

export interface UpdateModePaiementDto extends Partial<CreateModePaiementDto> {
    id: string;
}

/**
 * Service pour la gestion des modes de paiement
 */
@Injectable({
    providedIn: 'root',
})
export class ModePaiementService {
    // URL directe - MODIFIER ICI selon votre configuration
    private readonly apiUrl = 'http://localhost:3000/graphql';

    constructor(private http: HttpClient) {}

    /**
     * Récupérer tous les modes de paiement actifs
     */
    findAllModesPaiement(): Observable<ModePaiement[]> {
        const query = `
      query {
        modesPaiement {
          id
          type
          libelle
          description
          icon
          estActif
          createdAt
          updatedAt
        }
      }
    `;

        return this.http
            .post<{ data: { modesPaiement: ModePaiement[] } }>(this.apiUrl, {
                query,
            })
            .pipe(map((response) => response.data.modesPaiement));
    }

    /**
     * Récupérer un mode de paiement par son ID
     */
    findModePaiementById(id: string): Observable<ModePaiement> {
        const query = `
      query($id: String!) {
        modePaiement(id: $id) {
          id
          type
          libelle
          description
          icon
          estActif
          createdAt
          updatedAt
        }
      }
    `;

        return this.http
            .post<{ data: { modePaiement: ModePaiement } }>(this.apiUrl, {
                query,
                variables: { id },
            })
            .pipe(map((response) => response.data.modePaiement));
    }

    /**
     * Rechercher des modes de paiement par libellé
     */
    searchModesPaiementByLibelle(searchTerm: string): Observable<ModePaiement[]> {
        const query = `
      query($searchTerm: String!) {
        searchModesPaiement(searchTerm: $searchTerm) {
          id
          type
          libelle
          description
          icon
          estActif
          createdAt
          updatedAt
        }
      }
    `;

        return this.http
            .post<{ data: { searchModesPaiement: ModePaiement[] } }>(this.apiUrl, {
                query,
                variables: { searchTerm },
            })
            .pipe(map((response) => response.data.searchModesPaiement));
    }

    /**
     * Créer un nouveau mode de paiement
     */
    createModePaiement(input: CreateModePaiementDto): Observable<ModePaiement> {
        const mutation = `
      mutation($input: CreateModePaiementInput!) {
        createModePaiement(input: $input) {
          id
          type
          libelle
          description
          icon
          estActif
          createdAt
          updatedAt
        }
      }
    `;

        return this.http
            .post<{ data: { createModePaiement: ModePaiement } }>(this.apiUrl, {
                query: mutation,
                variables: { input },
            })
            .pipe(map((response) => response.data.createModePaiement));
    }

    /**
     * Mettre à jour un mode de paiement
     */
    updateModePaiement(input: UpdateModePaiementDto): Observable<ModePaiement> {
        const mutation = `
      mutation($input: UpdateModePaiementInput!) {
        updateModePaiement(input: $input) {
          id
          type
          libelle
          description
          icon
          estActif
          createdAt
          updatedAt
        }
      }
    `;

        return this.http
            .post<{ data: { updateModePaiement: ModePaiement } }>(this.apiUrl, {
                query: mutation,
                variables: { input },
            })
            .pipe(map((response) => response.data.updateModePaiement));
    }

    /**
     * Supprimer un mode de paiement (soft delete)
     */
    deleteModePaiement(id: string): Observable<boolean> {
        const mutation = `
      mutation($id: String!) {
        deleteModePaiement(id: $id)
      }
    `;

        return this.http
            .post<{ data: { deleteModePaiement: boolean } }>(this.apiUrl, {
                query: mutation,
                variables: { id },
            })
            .pipe(map((response) => response.data.deleteModePaiement));
    }
}