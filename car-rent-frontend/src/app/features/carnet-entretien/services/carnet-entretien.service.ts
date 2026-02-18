import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    GET_CARNET_ENTRETIENS_VEHICULE,
    UPDATE_CARNET_ENTRETIEN,
    DELETE_CARNET_ENTRETIEN,
} from '../graphql/carnet-entretien.queries';
import { CarnetEntretien, UpdateCarnetEntretienInput } from '../models/carnet-entretien.model';

@Injectable({
    providedIn: 'root',
})
export class CarnetEntretienService {
    constructor(private apollo: Apollo) {}

    /**
     * Récupérer les entretiens d'un véhicule
     */
    getEntretiensVehicule(vehiculeId: string): Observable<CarnetEntretien[]> {
        return this.apollo
            .query<{ carnetEntretiensVehicule: CarnetEntretien[] }>({
                query: GET_CARNET_ENTRETIENS_VEHICULE,
                variables: { vehiculeId },
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.carnetEntretiensVehicule));
    }

    /**
     * Mettre à jour un entretien
     */
    updateEntretien(input: UpdateCarnetEntretienInput): Observable<CarnetEntretien> {
        return this.apollo
            .mutate<{ updateCarnetEntretien: CarnetEntretien }>({
                mutation: UPDATE_CARNET_ENTRETIEN,
                variables: { input },
            })
            .pipe(map((result) => result.data!.updateCarnetEntretien));
    }

    /**
     * Supprimer un entretien
     */
    deleteEntretien(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteCarnetEntretien: boolean }>({
                mutation: DELETE_CARNET_ENTRETIEN,
                variables: { id },
            })
            .pipe(map((result) => result.data!.deleteCarnetEntretien));
    }

}