import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

export interface CreateModePaiementDto {
    type: string;
    libelle: string;
    description?: string;
    icon?: string;
}

export interface UpdateModePaiementDto extends Partial<CreateModePaiementDto> {
    id: string;
}

interface GraphQLResponse<T> {
    data?: T;
    errors?: { message: string; extensions?: { code?: string } }[];
}

@Injectable({ providedIn: 'root' })
export class ModePaiementService {
    private readonly apiUrl = 'http://localhost:3000/graphql';

    constructor(private http: HttpClient) {}

    // ── Helpers ────────────────────────────────────────────────
    private cleanInput<T extends object>(input: T): Partial<T> {
        return Object.fromEntries(
            Object.entries(input).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        ) as Partial<T>;
    }

    private handleResponse<T>(response: GraphQLResponse<T>, key: keyof T): T[keyof T] {
        if (response.errors?.length) {
            throw new Error(response.errors.map(e => e.message).join(', '));
        }
        if (!response.data || response.data[key] === null || response.data[key] === undefined) {
            throw new Error('Invalid server response');
        }
        return response.data[key];
    }

    // ── Queries ────────────────────────────────────────────────
    findAllModesPaiement(): Observable<ModePaiement[]> {
        const query = `
            query {
                modesPaiement {
                    id type libelle description icon estActif createdAt updatedAt
                }
            }
        `;
        return this.http
            .post<GraphQLResponse<{ modesPaiement: ModePaiement[] }>>(this.apiUrl, { query })
            .pipe(
                map(res  => this.handleResponse(res, 'modesPaiement') as ModePaiement[]),
                catchError(err => throwError(() => new Error(err.message || 'Network error')))
            );
    }

    findModePaiementById(id: string): Observable<ModePaiement> {
        const query = `
            query($id: String!) {
                modePaiement(id: $id) {
                    id type libelle description icon estActif createdAt updatedAt
                }
            }
        `;
        return this.http
            .post<GraphQLResponse<{ modePaiement: ModePaiement }>>(this.apiUrl, { query, variables: { id } })
            .pipe(
                map(res  => this.handleResponse(res, 'modePaiement') as ModePaiement),
                catchError(err => throwError(() => new Error(err.message || 'Network error')))
            );
    }

    searchModesPaiementByLibelle(searchTerm: string): Observable<ModePaiement[]> {
        const query = `
            query($searchTerm: String!) {
                searchModesPaiement(searchTerm: $searchTerm) {
                    id type libelle description icon estActif createdAt updatedAt
                }
            }
        `;
        return this.http
            .post<GraphQLResponse<{ searchModesPaiement: ModePaiement[] }>>(this.apiUrl, { query, variables: { searchTerm } })
            .pipe(
                map(res  => this.handleResponse(res, 'searchModesPaiement') as ModePaiement[]),
                catchError(err => throwError(() => new Error(err.message || 'Network error')))
            );
    }

    // ── Mutations ──────────────────────────────────────────────
    createModePaiement(input: CreateModePaiementDto): Observable<ModePaiement> {
        const mutation = `
            mutation($input: CreateModePaiementInput!) {
                createModePaiement(input: $input) {
                    id type libelle description icon estActif createdAt updatedAt
                }
            }
        `;
        const cleanedInput = this.cleanInput(input);
        return this.http
            .post<GraphQLResponse<{ createModePaiement: ModePaiement }>>(
                this.apiUrl,
                { query: mutation, variables: { input: cleanedInput } }
            )
            .pipe(
                map(res  => this.handleResponse(res, 'createModePaiement') as ModePaiement),
                catchError(err => throwError(() => new Error(err.message || 'Network error')))
            );
    }

    updateModePaiement(input: UpdateModePaiementDto): Observable<ModePaiement> {
        const mutation = `
            mutation($input: UpdateModePaiementInput!) {
                updateModePaiement(input: $input) {
                    id type libelle description icon estActif createdAt updatedAt
                }
            }
        `;
        const { id, ...rest } = input;
        const cleanedInput    = { id, ...this.cleanInput(rest) };
        return this.http
            .post<GraphQLResponse<{ updateModePaiement: ModePaiement }>>(
                this.apiUrl,
                { query: mutation, variables: { input: cleanedInput } }
            )
            .pipe(
                map(res  => this.handleResponse(res, 'updateModePaiement') as ModePaiement),
                catchError(err => throwError(() => new Error(err.message || 'Network error')))
            );
    }

    deleteModePaiement(id: string): Observable<boolean> {
        const mutation = `
            mutation($id: String!) {
                deleteModePaiement(id: $id)
            }
        `;
        return this.http
            .post<GraphQLResponse<{ deleteModePaiement: boolean }>>(
                this.apiUrl,
                { query: mutation, variables: { id } }
            )
            .pipe(
                map(res => {
                    if (res.errors?.length) {
                        throw new Error(res.errors.map(e => e.message).join(', '));
                    }
                    return res.data?.deleteModePaiement ?? false;
                }),
                catchError(err => throwError(() => new Error(err.message || 'Network error')))
            );
    }
}