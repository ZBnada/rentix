import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    TypeEntretien,
    CreateTypeEntretienInput,
    UpdateTypeEntretienInput,
} from '../models/type-entretien.model';

/**
 * Service for managing maintenance types via GraphQL
 */
@Injectable({
    providedIn: 'root',
})
export class TypeEntretienService {
    constructor(private apollo: Apollo) {}

    /**
     * Get all active maintenance types
     */
    getAllTypesEntretien(): Observable<TypeEntretien[]> {
        return this.apollo
            .watchQuery<{ typesEntretien: TypeEntretien[] }>({
                query: gql`
                    query GetAllTypesEntretien {
                        typesEntretien {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
            })
            .valueChanges.pipe(map((result) => result.data.typesEntretien));
    }

    /**
     * Get a maintenance type by ID
     */
    getTypeEntretienById(id: string): Observable<TypeEntretien> {
        return this.apollo
            .watchQuery<{ typeEntretien: TypeEntretien }>({
                query: gql`
                    query GetTypeEntretienById($id: String!) {
                        typeEntretien(id: $id) {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                variables: { id },
            })
            .valueChanges.pipe(map((result) => result.data.typeEntretien));
    }

    /**
     * Get a maintenance type by code
     */
    getTypeEntretienByCode(code: string): Observable<TypeEntretien> {
        return this.apollo
            .watchQuery<{ typeEntretienByCode: TypeEntretien }>({
                query: gql`
                    query GetTypeEntretienByCode($code: String!) {
                        typeEntretienByCode(code: $code) {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                variables: { code },
            })
            .valueChanges.pipe(map((result) => result.data.typeEntretienByCode));
    }

    /**
     * Search maintenance types by designation
     */
    searchTypesByDesignation(searchTerm: string): Observable<TypeEntretien[]> {
        return this.apollo
            .watchQuery<{ searchTypesEntretien: TypeEntretien[] }>({
                query: gql`
                    query SearchTypesEntretien($searchTerm: String!) {
                        searchTypesEntretien(searchTerm: $searchTerm) {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                variables: { searchTerm },
            })
            .valueChanges.pipe(map((result) => result.data.searchTypesEntretien));
    }

    /**
     * Get mandatory maintenance types only
     */
    getTypesObligatoires(): Observable<TypeEntretien[]> {
        return this.apollo
            .watchQuery<{ typesEntretienObligatoires: TypeEntretien[] }>({
                query: gql`
                    query GetTypesObligatoires {
                        typesEntretienObligatoires {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
            })
            .valueChanges.pipe(
                map((result) => result.data.typesEntretienObligatoires)
            );
    }

    /**
     * Create a new maintenance type
     */
    createTypeEntretien(
        input: CreateTypeEntretienInput
    ): Observable<TypeEntretien> {
        return this.apollo
            .mutate<{ createTypeEntretien: TypeEntretien }>({
                mutation: gql`
                    mutation CreateTypeEntretien($input: CreateTypeEntretienInput!) {
                        createTypeEntretien(input: $input) {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                variables: { input },
            })
            .pipe(
                map((result) => {
                    if (result.errors) {
                        throw new Error(result.errors[0].message);
                    }
                    if (!result.data?.createTypeEntretien) {
                        throw new Error('Aucune donnée retournée par le serveur');
                    }
                    return result.data.createTypeEntretien;
                })
            );
    }

    /**
     * Update an existing maintenance type
     */
    updateTypeEntretien(
        input: UpdateTypeEntretienInput
    ): Observable<TypeEntretien> {
        return this.apollo
            .mutate<{ updateTypeEntretien: TypeEntretien }>({
                mutation: gql`
                    mutation UpdateTypeEntretien($input: UpdateTypeEntretienInput!) {
                        updateTypeEntretien(input: $input) {
                            id
                            codeEntretien
                            designation
                            description
                            frequenceJoursRecommandee
                            frequenceKmRecommandee
                            coutMoyenEstime
                            estObligatoire
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                variables: { input },
            })
            .pipe(
                map((result) => {
                    if (result.errors) {
                        throw new Error(result.errors[0].message);
                    }
                    if (!result.data?.updateTypeEntretien) {
                        throw new Error('Aucune donnée retournée par le serveur');
                    }
                    return result.data.updateTypeEntretien;
                })
            );
    }

    /**
     * Delete a maintenance type (soft delete)
     */
    deleteTypeEntretien(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteTypeEntretien: boolean }>({
                mutation: gql`
                    mutation DeleteTypeEntretien($id: String!) {
                        deleteTypeEntretien(id: $id)
                    }
                `,
                variables: { id },
            })
            .pipe(
                map((result) => {
                    if (result.errors) {
                        throw new Error(result.errors[0].message);
                    }
                    if (result.data?.deleteTypeEntretien === undefined) {
                        throw new Error('Aucune donnée retournée par le serveur');
                    }
                    return result.data.deleteTypeEntretien;
                })
            );
    }
}