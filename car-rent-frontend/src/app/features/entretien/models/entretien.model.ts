/**
 * Maintenance Record (Entretien) Model
 * ✅ 100% ALIGNÉ AVEC LE BACKEND RÉEL
 */
export interface Entretien {
    id: string;
    typeEntretienId: string;
    typeEntretien?: TypeEntretien;
    vehiculeId: string;
    vehicule?: Vehicule;
    dateDebutOperation: string; // ISO date string
    dateFinOperation: string; // ISO date string
    kilometrageArret: number;
    kilometrageLimiteProchainEntretien?: number | null;
    dateLimiteProchainEntretien?: string | null; // ISO date string
    codePersonnel?: string | null;
    nomPrenomPersonnel?: string | null;
    observations?: string | null;
    coutTotal: number;
    etat: string; // 'TERMINE' | 'EN_COURS' | 'PLANIFIE' | 'ANNULE'
    saisiPar?: string | null;
    modifiePar?: string | null;
    saisiLe?: string; // ISO date string
    modifieLe?: string; // ISO date string
    estActif: boolean;
}

/**
 * Maintenance Type (Type d'Entretien)
 * ✅ Backend: codeEntretien, designation, description
 */
export interface TypeEntretien {
    id: string;
    codeEntretien: string;
    designation: string;
    description?: string | null;
    frequenceJoursRecommandee?: number | null;
    frequenceKmRecommandee?: number | null;
    coutMoyenEstime?: number;
    estObligatoire?: boolean;
    estActif?: boolean;
}

/**
 * Vehicle (Véhicule)
 * ✅ Backend: matricule, marque { libelle }, type, energie, classeVehicule, compteur
 */
export interface Vehicule {
    id: string;
    matricule: string; // ✅ Backend confirmé
    marque?: Marque;
    type?: string; // ✅ Backend confirmé
    energie?: string; // ✅ Backend confirmé (EnergieType enum)
    classeVehicule?: string; // ✅ Backend confirmé (ClasseVehicule enum)
    compteur?: number; // ✅ Backend confirmé (kilométrage)
    prixLocationJournee?: number;
    estActif?: boolean;
}

/**
 * Vehicle Brand (Marque)
 * ✅ Backend: libelle
 */
export interface Marque {
    id: string;
    libelle: string; // ✅ Backend confirmé
    createdAt?: string;
    estActif?: boolean;
}

/**
 * Input for creating a new maintenance record
 */
export interface CreateEntretienInput {
    typeEntretienId: string;
    vehiculeId: string;
    dateDebutOperation: string; // ISO date string
    dateFinOperation: string; // ISO date string
    kilometrageArret: number;
    kilometrageLimiteProchainEntretien?: number;
    dateLimiteProchainEntretien?: string; // ISO date string
    codePersonnel?: string;
    nomPrenomPersonnel?: string;
    observations?: string;
    coutTotal: number;
    etat: string; // 'TERMINE' | 'EN_COURS' | 'PLANIFIE' | 'ANNULE'
}

/**
 * Input for updating an existing maintenance record
 */
export interface UpdateEntretienInput {
    id: string;
    typeEntretienId?: string;
    vehiculeId?: string;
    dateDebutOperation?: string; // ISO date string
    dateFinOperation?: string; // ISO date string
    kilometrageArret?: number;
    kilometrageLimiteProchainEntretien?: number;
    dateLimiteProchainEntretien?: string; // ISO date string
    codePersonnel?: string;
    nomPrenomPersonnel?: string;
    observations?: string;
    coutTotal?: number;
    etat?: string; // 'TERMINE' | 'EN_COURS' | 'PLANIFIE' | 'ANNULE'
}

/**
 * Statistics for maintenance records
 */
export interface EntretienStats {
    totalRecords: number;
    completedRecords: number;
    totalCost: number;
    averageCost: number;
}

/**
 * Filter options for maintenance records
 */
export interface EntretienFilter {
    vehiculeId?: string;
    typeEntretienId?: string;
    etat?: string;
    dateDebut?: string;
    dateFin?: string;
    searchTerm?: string;
}