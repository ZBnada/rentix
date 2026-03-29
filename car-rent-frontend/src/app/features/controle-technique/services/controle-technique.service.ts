import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    GET_CONTROLES_TECHNIQUES, GET_CONTROLE_TECHNIQUE,
    CREATE_CONTROLE_TECHNIQUE, UPDATE_CONTROLE_TECHNIQUE,
    VALIDER_CONTROLE_TECHNIQUE, ANNULER_CONTROLE_TECHNIQUE,
    DELETE_CONTROLE_TECHNIQUE, GET_VEHICULES, GET_MODES_PAIEMENT,
} from '../graphql/controle-technique.queries';
import {
    ControleTechnique, CreateControleTechniqueInput,
    UpdateControleTechniqueInput, ModePaiement, Vehicule,
} from '../models/controle-technique.model';

@Injectable({ providedIn: 'root' })
export class ControleTechniqueService {
    constructor(private readonly apollo: Apollo) {}

    findAllControlesTechniques(): Observable<ControleTechnique[]> {
        return this.apollo
            .watchQuery<{ controlesTechniques: ControleTechnique[] }>({
                query: GET_CONTROLES_TECHNIQUES,
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(map((r) => r.data.controlesTechniques));
    }

    findControleTechniqueById(id: string): Observable<ControleTechnique> {
        return this.apollo
            .query<{ controleTechnique: ControleTechnique }>({
                query: GET_CONTROLE_TECHNIQUE,
                variables: { id },
                fetchPolicy: 'network-only',
            })
            .pipe(map((r) => r.data.controleTechnique));
    }

    findAllVehicules(): Observable<Vehicule[]> {
        return this.apollo
            .query<{ vehicules: Vehicule[] }>({
                query: GET_VEHICULES,
                fetchPolicy: 'network-only',
            })
            .pipe(map((r) => r.data.vehicules));
    }

    findAllModesPaiement(): Observable<ModePaiement[]> {
        return this.apollo
            .query<{ modesPaiement: ModePaiement[] }>({
                query: GET_MODES_PAIEMENT,
                fetchPolicy: 'network-only',
            })
            .pipe(map((r) => r.data.modesPaiement));
    }

    createControleTechnique(input: CreateControleTechniqueInput): Observable<ControleTechnique> {
        return this.apollo
            .mutate<{ createControleTechnique: ControleTechnique }>({
                mutation: CREATE_CONTROLE_TECHNIQUE,
                variables: { input },
                refetchQueries: [{ query: GET_CONTROLES_TECHNIQUES }],
            })
            .pipe(map((r) => r.data!.createControleTechnique));
    }

    updateControleTechnique(input: UpdateControleTechniqueInput): Observable<ControleTechnique> {
        return this.apollo
            .mutate<{ updateControleTechnique: ControleTechnique }>({
                mutation: UPDATE_CONTROLE_TECHNIQUE,
                variables: { input },
                refetchQueries: [{ query: GET_CONTROLES_TECHNIQUES }],
            })
            .pipe(map((r) => r.data!.updateControleTechnique));
    }

    validerControleTechnique(id: string, validerPar: string): Observable<ControleTechnique> {
        return this.apollo
            .mutate<{ validerControleTechnique: ControleTechnique }>({
                mutation: VALIDER_CONTROLE_TECHNIQUE,
                variables: { id, validerPar },
                refetchQueries: [{ query: GET_CONTROLES_TECHNIQUES }],
            })
            .pipe(map((r) => r.data!.validerControleTechnique));
    }

    annulerControleTechnique(id: string, annulePar: string): Observable<ControleTechnique> {
        return this.apollo
            .mutate<{ annulerControleTechnique: ControleTechnique }>({
                mutation: ANNULER_CONTROLE_TECHNIQUE,
                variables: { id, annulePar },
                refetchQueries: [{ query: GET_CONTROLES_TECHNIQUES }],
            })
            .pipe(map((r) => r.data!.annulerControleTechnique));
    }

    deleteControleTechnique(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteControleTechnique: boolean }>({
                mutation: DELETE_CONTROLE_TECHNIQUE,
                variables: { id },
                refetchQueries: [{ query: GET_CONTROLES_TECHNIQUES }],
            })
            .pipe(map((r) => r.data!.deleteControleTechnique));
    }
}