import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    Entretien,
    CreateEntretienInput,
    UpdateEntretienInput,
} from '../models/entretien.model';
import { PdfService } from './pdf.service';

/**
 * Service for managing maintenance records via GraphQL
 * ✅ Includes PDF export functionality
 */
@Injectable({
    providedIn: 'root',
})
export class EntretienService {
    constructor(
        private apollo: Apollo,
        private pdfService: PdfService
    ) {}

    /**
     * Get all active maintenance records
     */
    getAllEntretiens(): Observable<Entretien[]> {
        return this.apollo
            .watchQuery<{ entretiens: Entretien[] }>({
                query: gql`
                    query GetAllEntretiens {
                        entretiens {
                            id
                            typeEntretienId
                            typeEntretien {
                                id
                                codeEntretien
                                designation
                                description
                            }
                            vehiculeId
                            vehicule {
                                id
                                matricule
                                marque {
                                    id
                                    libelle
                                }
                                type
                                energie
                                classeVehicule
                                compteur
                            }
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            kilometrageLimiteProchainEntretien
                            dateLimiteProchainEntretien
                            codePersonnel
                            nomPrenomPersonnel
                            observations
                            coutTotal
                            etat
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(map((result) => result.data.entretiens));
    }

    /**
     * Get a maintenance record by ID
     */
    getEntretienById(id: string): Observable<Entretien> {
        return this.apollo
            .watchQuery<{ entretien: Entretien }>({
                query: gql`
                    query GetEntretienById($id: String!) {
                        entretien(id: $id) {
                            id
                            typeEntretienId
                            typeEntretien {
                                id
                                codeEntretien
                                designation
                                description
                            }
                            vehiculeId
                            vehicule {
                                id
                                matricule
                                marque {
                                    id
                                    libelle
                                }
                                type
                                energie
                                classeVehicule
                                compteur
                            }
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            kilometrageLimiteProchainEntretien
                            dateLimiteProchainEntretien
                            codePersonnel
                            nomPrenomPersonnel
                            observations
                            coutTotal
                            etat
                            saisiPar
                            modifiePar
                            saisiLe
                            modifieLe
                            estActif
                        }
                    }
                `,
                variables: { id },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(map((result) => result.data.entretien));
    }

    /**
     * Get maintenance records by vehicle
     */
    getEntretiensByVehicule(vehiculeId: string): Observable<Entretien[]> {
        return this.apollo
            .watchQuery<{ entretiensByVehicule: Entretien[] }>({
                query: gql`
                    query GetEntretiensByVehicule($vehiculeId: String!) {
                        entretiensByVehicule(vehiculeId: $vehiculeId) {
                            id
                            typeEntretienId
                            typeEntretien {
                                id
                                codeEntretien
                                designation
                            }
                            vehiculeId
                            vehicule {
                                id
                                matricule
                            }
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            kilometrageLimiteProchainEntretien
                            dateLimiteProchainEntretien
                            coutTotal
                            etat
                            saisiLe
                        }
                    }
                `,
                variables: { vehiculeId },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(map((result) => result.data.entretiensByVehicule));
    }

    /**
     * Get maintenance records by vehicle and type
     */
    getEntretiensByVehiculeAndType(
        vehiculeId: string,
        typeEntretienId: string
    ): Observable<Entretien[]> {
        return this.apollo
            .watchQuery<{ entretiensByVehiculeAndType: Entretien[] }>({
                query: gql`
                    query GetEntretiensByVehiculeAndType(
                        $vehiculeId: String!
                        $typeEntretienId: String!
                    ) {
                        entretiensByVehiculeAndType(
                            vehiculeId: $vehiculeId
                            typeEntretienId: $typeEntretienId
                        ) {
                            id
                            typeEntretienId
                            typeEntretien {
                                codeEntretien
                                designation
                            }
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            coutTotal
                            etat
                        }
                    }
                `,
                variables: { vehiculeId, typeEntretienId },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                map((result) => result.data.entretiensByVehiculeAndType)
            );
    }

    /**
     * Get the last maintenance of a given type for a vehicle
     */
    getDernierEntretienByTypeEtVehicule(
        vehiculeId: string,
        typeEntretienId: string
    ): Observable<Entretien | null> {
        return this.apollo
            .watchQuery<{ dernierEntretienByTypeEtVehicule: Entretien | null }>({
                query: gql`
                    query GetDernierEntretienByTypeEtVehicule(
                        $vehiculeId: String!
                        $typeEntretienId: String!
                    ) {
                        dernierEntretienByTypeEtVehicule(
                            vehiculeId: $vehiculeId
                            typeEntretienId: $typeEntretienId
                        ) {
                            id
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            kilometrageLimiteProchainEntretien
                            dateLimiteProchainEntretien
                            coutTotal
                        }
                    }
                `,
                variables: { vehiculeId, typeEntretienId },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                map((result) => result.data.dernierEntretienByTypeEtVehicule)
            );
    }

    /**
     * Get maintenance records within a period
     */
    getEntretiensByPeriode(
        dateDebut: Date,
        dateFin: Date
    ): Observable<Entretien[]> {
        return this.apollo
            .watchQuery<{ entretiensByPeriode: Entretien[] }>({
                query: gql`
                    query GetEntretiensByPeriode($dateDebut: Date!, $dateFin: Date!) {
                        entretiensByPeriode(dateDebut: $dateDebut, dateFin: $dateFin) {
                            id
                            typeEntretien {
                                codeEntretien
                                designation
                            }
                            vehicule {
                                matricule
                            }
                            dateDebutOperation
                            dateFinOperation
                            coutTotal
                            etat
                        }
                    }
                `,
                variables: { dateDebut, dateFin },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(map((result) => result.data.entretiensByPeriode));
    }

    /**
     * Create a new maintenance record
     */
    createEntretien(input: CreateEntretienInput): Observable<Entretien> {
        return this.apollo
            .mutate<{ createEntretien: Entretien }>({
                mutation: gql`
                    mutation CreateEntretien($input: CreateEntretienInput!) {
                        createEntretien(input: $input) {
                            id
                            typeEntretienId
                            typeEntretien {
                                codeEntretien
                                designation
                            }
                            vehiculeId
                            vehicule {
                                matricule
                            }
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            kilometrageLimiteProchainEntretien
                            dateLimiteProchainEntretien
                            codePersonnel
                            nomPrenomPersonnel
                            observations
                            coutTotal
                            etat
                            saisiLe
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
                    if (!result.data?.createEntretien) {
                        throw new Error('No data returned from server');
                    }
                    return result.data.createEntretien;
                })
            );
    }

    /**
     * Update an existing maintenance record
     */
    updateEntretien(input: UpdateEntretienInput): Observable<Entretien> {
        return this.apollo
            .mutate<{ updateEntretien: Entretien }>({
                mutation: gql`
                    mutation UpdateEntretien($input: UpdateEntretienInput!) {
                        updateEntretien(input: $input) {
                            id
                            typeEntretienId
                            vehiculeId
                            dateDebutOperation
                            dateFinOperation
                            kilometrageArret
                            kilometrageLimiteProchainEntretien
                            dateLimiteProchainEntretien
                            codePersonnel
                            nomPrenomPersonnel
                            observations
                            coutTotal
                            etat
                            modifieLe
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
                    if (!result.data?.updateEntretien) {
                        throw new Error('No data returned from server');
                    }
                    return result.data.updateEntretien;
                })
            );
    }

    /**
     * Delete a maintenance record (soft delete)
     */
    deleteEntretien(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteEntretien: boolean }>({
                mutation: gql`
                    mutation DeleteEntretien($id: String!) {
                        deleteEntretien(id: $id)
                    }
                `,
                variables: { id },
            })
            .pipe(
                map((result) => {
                    if (result.errors) {
                        throw new Error(result.errors[0].message);
                    }
                    if (result.data?.deleteEntretien === undefined) {
                        throw new Error('No data returned from server');
                    }
                    return result.data.deleteEntretien;
                })
            );
    }

    /**
     * Calculate total cost of maintenance for a vehicle
     */
    calculerCoutTotalParVehicule(vehiculeId: string): Observable<number> {
        return this.apollo
            .watchQuery<{ coutTotalEntretiensVehicule: number }>({
                query: gql`
                    query CalculerCoutTotalParVehicule($vehiculeId: String!) {
                        coutTotalEntretiensVehicule(vehiculeId: $vehiculeId)
                    }
                `,
                variables: { vehiculeId },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                map((result) => result.data.coutTotalEntretiensVehicule)
            );
    }

    /**
     * ✅ Export maintenance records to PDF
     */
    exportToPDF(entretiens: Entretien[], filename: string = 'maintenance-records.pdf'): void {
        this.pdfService.exportMaintenanceList(entretiens, filename);
    }

    /**
     *  Export vehicle maintenance history to PDF
     */
    exportVehicleHistoryToPDF(
        vehicule: { matricule: string; marque?: { libelle: string }; type?: string },
        entretiens: Entretien[],
        filename?: string
    ): void {
        this.pdfService.exportVehicleHistory(vehicule, entretiens, filename);
    }
}