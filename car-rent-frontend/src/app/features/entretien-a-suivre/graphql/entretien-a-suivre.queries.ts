import { gql } from 'apollo-angular';

/**
 * Récupérer tous les véhicules
 */
export const GET_ALL_VEHICULES = gql`
    query GetAllVehicules {
        vehicules {
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
            prixLocationJournee
            estActif
        }
    }
`;

/**
 * Récupérer tous les types d'entretien
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
        }
    }
`;

/**
 * Récupérer la configuration des entretiens pour un véhicule
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
 * Toggle un entretien pour un véhicule
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