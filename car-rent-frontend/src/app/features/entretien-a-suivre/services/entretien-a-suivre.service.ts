import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, forkJoin, map, switchMap, of, tap } from 'rxjs';
import {
    GET_ALL_VEHICULES,
    GET_CONFIGURATION_ENTRETIENS_VEHICULE,
    GET_ALL_TYPES_ENTRETIEN,
    TOGGLE_ENTRETIEN_VEHICULE,
} from '../graphql/entretien-a-suivre.queries';
import {
    EntretienConfiguration,
    LigneTableauEntretiens,
} from '../models/entretien-a-suivre.models';
import { TypeEntretien } from '../../type-entretien/models/type-entretien.model';

/**
 * Interface pour la réponse GraphQL des véhicules
 */
interface VehiculeGraphQLResponse {
    id: string;
    matricule: string;
    type: string;
    compteur: number;
    classeVehicule: string;
    energie: string;
    prixLocationJournee: number;
    estActif: boolean;
    marque: {
        id: string;
        libelle: string;
    };
}

@Injectable({
    providedIn: 'root',
})
export class EntretienASuivreService {
    constructor(private apollo: Apollo) {}

    /**
     * Récupérer tous les véhicules
     */
    getAllVehicules(): Observable<VehiculeGraphQLResponse[]> {
        return this.apollo
            .query<{ vehicules: VehiculeGraphQLResponse[] }>({
                query: GET_ALL_VEHICULES,
                fetchPolicy: 'network-only',
            })
            .pipe(
                map((result) => {
                    console.log('✅ Véhicules récupérés:', result.data.vehicules);
                    return result.data.vehicules;
                })
            );
    }

    /**
     * Récupérer tous les types d'entretien
     */
    getAllTypesEntretien(): Observable<TypeEntretien[]> {
        return this.apollo
            .query<{ typesEntretien: TypeEntretien[] }>({
                query: GET_ALL_TYPES_ENTRETIEN,
                fetchPolicy: 'network-only',
            })
            .pipe(
                map((result) => {
                    console.log('✅ Types entretien récupérés:', result.data.typesEntretien);
                    return result.data.typesEntretien;
                })
            );
    }

    /**
     * Récupérer la configuration des entretiens pour un véhicule
     */
    getConfigurationEntretiensVehicule(
        vehiculeId: string
    ): Observable<EntretienConfiguration[]> {
        return this.apollo
            .query<{
                configurationEntretiensVehicule: EntretienConfiguration[];
            }>({
                query: GET_CONFIGURATION_ENTRETIENS_VEHICULE,
                variables: { vehiculeId },
                fetchPolicy: 'network-only',
            })
            .pipe(
                map((result) => {
                    console.log(`✅ Configuration pour véhicule ${vehiculeId}:`, result.data.configurationEntretiensVehicule);
                    return result.data.configurationEntretiensVehicule;
                })
            );
    }

    /**
     * Récupérer toutes les configurations pour tous les véhicules
     */
    getAllConfigurationsEntretiens(): Observable<LigneTableauEntretiens[]> {
        return this.getAllVehicules().pipe(
            switchMap((vehicules) => {
                console.log('📊 Nombre de véhicules:', vehicules.length);

                if (vehicules.length === 0) {
                    console.log('⚠️ Aucun véhicule trouvé');
                    return of([]);
                }

                const requests = vehicules.map((vehicule) =>
                    this.getConfigurationEntretiensVehicule(vehicule.id).pipe(
                        map((configurations) => {
                            const ligne: LigneTableauEntretiens = {
                                vehicule: {
                                    id: vehicule.id,
                                    matricule: vehicule.matricule,
                                    marque: vehicule.marque.libelle,
                                    type: vehicule.type,
                                },
                                entretiensParCode: new Map(
                                    configurations.map((config) => [
                                        config.codeEntretien,
                                        config.estActive,
                                    ])
                                ),
                            };
                            console.log(`✅ Ligne créée pour ${vehicule.matricule}:`, ligne);
                            return ligne;
                        })
                    )
                );

                return forkJoin(requests);
            })
        );
    }

    /**
     * Toggle un entretien pour un véhicule
     * ✅ CRÉE AUTOMATIQUEMENT DANS LE CARNET SI COCHÉ
     */
    toggleEntretien(
        vehiculeId: string,
        typeEntretienId: string,
        estActive: boolean
    ): Observable<boolean> {
        console.log('🔄 Toggle entretien:', { vehiculeId, typeEntretienId, estActive });

        return this.apollo
            .mutate<{ toggleEntretienVehicule: boolean }>({
                mutation: TOGGLE_ENTRETIEN_VEHICULE,
                variables: {
                    vehiculeId,
                    typeEntretienId,
                    estActive,
                },
                // ✅ Invalider le cache pour forcer le refresh
                refetchQueries: [
                    {
                        query: GET_CONFIGURATION_ENTRETIENS_VEHICULE,
                        variables: { vehiculeId },
                    },
                ],
            })
            .pipe(
                tap(() => {
                    console.log('✅ Toggle réussi - Cache invalidé');
                }),
                map((result) => {
                    return result.data?.toggleEntretienVehicule ?? false;
                })
            );
    }
}