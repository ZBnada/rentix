import { gql } from 'apollo-angular';

/**
 * Query : Récupérer tous les véhicules
 */
export const GET_ALL_VEHICULES = gql`
    query GetAllVehicules {
        vehicules {
            id
            matricule
            type
            compteur
            classeVehicule
            energie
            prixLocationJournee
            estActif
            marque {
                id
                libelle
            }
        }
    }
`;

/**
 * Query : Récupérer tous les types d'entretien
 */
export const GET_ALL_TYPES_ENTRETIEN = gql`
    query GetAllTypesEntretien {
        typesEntretien {
            id
            codeEntretien
            designation
            frequenceJoursRecommandee
            frequenceKmRecommandee
            coutMoyenEstime
            estObligatoire
            estActif
        }
    }
`;

/**
 * Query : Récupérer la configuration des entretiens pour un véhicule
 */
export const GET_CONFIGURATION_ENTRETIENS_VEHICULE = gql`
    query GetConfigurationEntretiensVehicule($vehiculeId: String!) {
        configurationEntretiensVehicule(vehiculeId: $vehiculeId) {
            typeEntretienId
            codeEntretien
            designation
            estActive
            entretienASuivreId
            frequenceJoursRecommandee
            frequenceKmRecommandee
            coutMoyenEstime
            estObligatoire
        }
    }
`;

/**
 * Mutation : Toggle un entretien pour un véhicule
 */
export const TOGGLE_ENTRETIEN_VEHICULE = gql`
    mutation ToggleEntretienVehicule(
        $vehiculeId: String!
        $typeEntretienId: String!
        $estActive: Boolean!
    ) {
        toggleEntretienVehicule(
            vehiculeId: $vehiculeId
            typeEntretienId: $typeEntretienId
            estActive: $estActive
        )
    }
`;

/**
 * Query : Récupérer les entretiens du carnet pour un véhicule
 */
export const GET_CARNET_ENTRETIENS_VEHICULE = gql`
    query CarnetEntretiensVehicule($vehiculeId: String!) {
        carnetEntretiensVehicule(vehiculeId: $vehiculeId) {
            id
            vehiculeId
            vehiculeMatricule
            typeEntretienId
            codeEntretien
            designation
            dateDebut
            dateFin
            kilometrageDebut
            kilometrageFin
            coutEstime
            coutReel
            notes
            statut
            saisiPar
            modifiePar
            saisiLe
            modifieLe
        }
    }
`;

/**
 * Mutation : Mettre à jour un entretien du carnet
 */
export const UPDATE_CARNET_ENTRETIEN = gql`
    mutation UpdateCarnetEntretien($input: UpdateCarnetEntretienInput!) {
        updateCarnetEntretien(input: $input) {
            id
            dateFin
            kilometrageFin
            coutReel
            notes
            statut
            modifieLe
        }
    }
`;

/**
 * Mutation : Supprimer un entretien du carnet
 */
export const DELETE_CARNET_ENTRETIEN = gql`
    mutation DeleteCarnetEntretien($id: String!) {
        deleteCarnetEntretien(id: $id)
    }
`;