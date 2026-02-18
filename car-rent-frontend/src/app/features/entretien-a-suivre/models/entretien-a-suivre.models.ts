import { TypeEntretien } from '../../type-entretien/models/type-entretien.model';

/**
 * Configuration d'entretien pour un véhicule
 */
export interface EntretienConfiguration {
    typeEntretienId: string;
    codeEntretien: string;
    designation: string;
    estActive: boolean;
    entretienASuivreId: string | null;
    frequenceJoursRecommandee: number | null;
    frequenceKmRecommandee: number | null;
    coutMoyenEstime: number;
    estObligatoire: boolean;
}

/**
 * Véhicule simplifié pour le tableau
 */
export interface VehiculeSimple {
    id: string;
    matricule: string;
    marque: string;
    type: string;
}

/**
 * Ligne du tableau (véhicule + entretiens)
 */
export interface LigneTableauEntretiens {
    vehicule: VehiculeSimple;
    entretiensParCode: Map<string, boolean>; // Map<codeEntretien, estActive>
}

/**
 * DTO pour toggle un entretien
 */
export interface ToggleEntretienDto {
    vehiculeId: string;
    typeEntretienId: string;
    estActive: boolean;
}