import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    GET_VIGNETTES, GET_VIGNETTE, CREATE_VIGNETTE, UPDATE_VIGNETTE,
    VALIDER_VIGNETTE, ANNULER_VIGNETTE, DELETE_VIGNETTE,
    GET_VEHICULES, GET_MODES_PAIEMENT,
} from '../graphql/vignette.queries';
import {
    Vignette, CreateVignetteInput, UpdateVignetteInput, ModePaiement, Vehicule
} from '../models/vignette.model';

@Injectable({ providedIn: 'root' })
export class VignetteService {
    constructor(private readonly apollo: Apollo) {}

    findAllVignettes(): Observable<Vignette[]> {
        return this.apollo
            .watchQuery<{ vignettes: Vignette[] }>({ query: GET_VIGNETTES, fetchPolicy: 'network-only' })
            .valueChanges.pipe(map((r) => r.data.vignettes));
    }

    findVignetteById(id: string): Observable<Vignette> {
        return this.apollo
            .query<{ vignette: Vignette }>({ query: GET_VIGNETTE, variables: { id }, fetchPolicy: 'network-only' })
            .pipe(map((r) => r.data.vignette));
    }

    findAllVehicules(): Observable<Vehicule[]> {
        return this.apollo
            .query<{ vehicules: Vehicule[] }>({ query: GET_VEHICULES, fetchPolicy: 'network-only' })
            .pipe(map((r) => r.data.vehicules));
    }

    findAllModesPaiement(): Observable<ModePaiement[]> {
        return this.apollo
            .query<{ modesPaiement: ModePaiement[] }>({ query: GET_MODES_PAIEMENT, fetchPolicy: 'network-only' })
            .pipe(map((r) => r.data.modesPaiement));
    }

    createVignette(input: CreateVignetteInput): Observable<Vignette> {
        return this.apollo
            .mutate<{ createVignette: Vignette }>({
                mutation: CREATE_VIGNETTE, variables: { input },
                refetchQueries: [{ query: GET_VIGNETTES }],
            })
            .pipe(map((r) => r.data!.createVignette));
    }

    updateVignette(input: UpdateVignetteInput): Observable<Vignette> {
        return this.apollo
            .mutate<{ updateVignette: Vignette }>({
                mutation: UPDATE_VIGNETTE, variables: { input },
                refetchQueries: [{ query: GET_VIGNETTES }],
            })
            .pipe(map((r) => r.data!.updateVignette));
    }

    validerVignette(id: string, validerPar: string): Observable<Vignette> {
        return this.apollo
            .mutate<{ validerVignette: Vignette }>({
                mutation: VALIDER_VIGNETTE, variables: { id, validerPar },
                refetchQueries: [{ query: GET_VIGNETTES }],
            })
            .pipe(map((r) => r.data!.validerVignette));
    }

    annulerVignette(id: string, annulePar: string): Observable<Vignette> {
        return this.apollo
            .mutate<{ annulerVignette: Vignette }>({
                mutation: ANNULER_VIGNETTE, variables: { id, annulePar },
                refetchQueries: [{ query: GET_VIGNETTES }],
            })
            .pipe(map((r) => r.data!.annulerVignette));
    }

    deleteVignette(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteVignette: boolean }>({
                mutation: DELETE_VIGNETTE, variables: { id },
                refetchQueries: [{ query: GET_VIGNETTES }],
            })
            .pipe(map((r) => r.data!.deleteVignette));
    }
}