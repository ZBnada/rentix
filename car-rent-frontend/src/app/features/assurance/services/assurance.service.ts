import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

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

export interface UpdateAssuranceDto extends Partial<CreateAssuranceDto> {
    id: string;
    modifiePar?: string;
}

/**
 * Payload reçu lors d'un event subscription.
 * "action" indique ce qui s'est passé côté serveur.
 */
export interface AssuranceSubscriptionPayload {
    assuranceUpdated: Partial<Assurance>;
    action: 'create' | 'update' | 'delete';
}

// Champs GraphQL réutilisables
const ASSURANCE_FIELDS = `
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
`;

// Subscription GQL (définie une fois, réutilisée)

const ASSURANCE_UPDATED_SUBSCRIPTION = gql`
  subscription OnAssuranceUpdated($ids: [String!]) {
    assuranceUpdated(ids: $ids) {
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


@Injectable({
    providedIn: 'root',
})
export class AssuranceService {
    private readonly apollo = inject(Apollo);
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/graphql';

    // ── Queries ──────────────────────────────────

    /**
     * Récupérer toutes les assurances actives
     */
    findAllAssurances(): Observable<Assurance[]> {
        const query = `
      query {
        assurances {
          ${ASSURANCE_FIELDS}
        }
      }
    `;
        return this.http.post<any>(this.apiUrl, { query }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.assurances || [];
            }),
        );
    }

    /**
     * Récupérer une assurance par son ID
     */
    findAssuranceById(id: string): Observable<Assurance> {
        const query = `
      query($id: String!) {
        assurance(id: $id) {
          ${ASSURANCE_FIELDS}
        }
      }
    `;
        return this.http.post<any>(this.apiUrl, { query, variables: { id } }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.assurance;
            }),
        );
    }

    /**
     * Récupérer les assurances d'un véhicule
     */
    findAssurancesByVehicule(vehiculeId: string): Observable<Assurance[]> {
        const query = `
      query($vehiculeId: String!) {
        assurancesByVehicule(vehiculeId: $vehiculeId) {
          ${ASSURANCE_FIELDS}
        }
      }
    `;
        return this.http.post<any>(this.apiUrl, { query, variables: { vehiculeId } }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.assurancesByVehicule || [];
            }),
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
        return this.http.post<any>(this.apiUrl, { query, variables: { daysBeforeExpiry } }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.assurancesExpiringSoon || [];
            }),
        );
    }

    // ── Mutations ───────────────────────────────

    /**
     * Créer une nouvelle assurance
     */
    createAssurance(input: CreateAssuranceDto): Observable<Assurance> {
        const formattedInput = this.formatAssuranceInput(input);
        const mutation = `
      mutation($input: CreateAssuranceInput!) {
        createAssurance(input: $input) {
          ${ASSURANCE_FIELDS}
        }
      }
    `;
        return this.http.post<any>(this.apiUrl, { query: mutation, variables: { input: formattedInput } }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.createAssurance;
            }),
        );
    }

    /**
     * Mettre à jour une assurance
     */
    updateAssurance(input: UpdateAssuranceDto): Observable<Assurance> {
        const formattedInput = this.formatAssuranceInput(input);
        const mutation = `
      mutation($input: UpdateAssuranceInput!) {
        updateAssurance(input: $input) {
          ${ASSURANCE_FIELDS}
        }
      }
    `;
        return this.http.post<any>(this.apiUrl, { query: mutation, variables: { input: formattedInput } }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.updateAssurance;
            }),
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
        return this.http.post<any>(this.apiUrl, { query: mutation, variables: { id } }).pipe(
            map((response) => {
                if (response.errors) throw new Error(response.errors[0]?.message);
                return response.data?.deleteAssurance || false;
            }),
        );
    }


    //  --Subscription----------------
    assuranceUpdated(ids?: string[]): Observable<AssuranceSubscriptionPayload> {
        return this.apollo
            .subscribe<{ assuranceUpdated: Assurance }>({
                query: ASSURANCE_UPDATED_SUBSCRIPTION,
                variables: { ids: ids ?? [] },
            })
            .pipe(
                map((result) => {
                    const assurance = result.data?.assuranceUpdated;

                    // On déduit l'action à partir des données reçues :
                    //   estActif = false  → c'est un delete (soft delete)
                    //   sinon             → update ou create (le composant gère les deux pareil)
                    const action: 'create' | 'update' | 'delete' =
                        assurance?.estActif === false ? 'delete' : 'update';

                    return {
                        assuranceUpdated: assurance ?? {},
                        action,
                    };
                }),
            );
    }

    // ── Helpers privés ───────────────────────────

    /**
     * Formater les dates d'un input assurance avant envoi à l'API.
     * Convertit Date / string "YYYY-MM-DD" → ISO string.
     */
    private formatAssuranceInput(input: any): any {
        const formatted: any = { ...input };

        if (input.dateDebut) formatted.dateDebut = this.toISO(input.dateDebut);
        if (input.dateFinValidite) formatted.dateFinValidite = this.toISO(input.dateFinValidite);
        if (input.dateOperation) formatted.dateOperation = this.toISO(input.dateOperation);

        if (input.reglements) {
            formatted.reglements = input.reglements.map((r: any) => ({
                ...r,
                dateOperation: this.toISO(r.dateOperation),
                echeance: r.echeance ? this.toISO(r.echeance) : undefined,
            }));
        }

        return formatted;
    }

    /**
     * Convertir une date (string ou Date) en ISO string pour l'API.
     */
    private toISO(date: string | Date | undefined): string | undefined {
        if (!date) return undefined;
        if (typeof date === 'string') {
            // Déjà ISO (contient "T") → laisser tel quel
            if (date.includes('T')) return date;
            // Format "YYYY-MM-DD" → convertir
            return new Date(date).toISOString();
        }
        return date.toISOString();
    }
}