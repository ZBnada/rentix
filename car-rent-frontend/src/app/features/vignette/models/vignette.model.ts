export enum StatutVignette {
    BROUILLON = 'BROUILLON',
    VALIDE = 'VALIDE',
    ANNULE = 'ANNULE',
}

export interface ModePaiement {
    id: string;
    type: string;
    libelle: string;
    icon?: string;
}

export interface LigneReglementVignette {
    id: string;
    vignetteId: string;
    modePaiementId: string;
    modePaiement: ModePaiement;
    designation?: string;
    montant: number;
    echeance?: Date;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
    dateOperation: Date;
    createdAt: Date;
    estActif: boolean;
}

export interface Vehicule {
    id: string;
    matricule: string;
    marque?: { libelle: string };
}

export interface Vignette {
    id: string;
    vehiculeId: string;
    vehicule: Vehicule;
    matriculeVehicule: string;
    dateFinValidite: Date;
    montant: number;
    montantReste: number;
    dateOperation: Date;
    numeroFiche: number;
    statut: StatutVignette;
    lignesReglement: LigneReglementVignette[];
    saisiPar?: string;
    modifiePar?: string;
    saisiLe: Date;
    modifieLe: Date;
    estActif: boolean;
}

export interface CreateLigneReglementVignetteInput {
    modePaiementId: string;
    designation?: string;
    montant: number;
    echeance?: string;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
    dateOperation: string;
}

export interface CreateVignetteInput {
    vehiculeId: string;
    dateFinValidite: string;
    montant: number;
    dateOperation: string;
    saisiPar?: string;
    lignesReglement: CreateLigneReglementVignetteInput[];
}

export interface UpdateVignetteInput {
    id: string;
    vehiculeId?: string;
    dateFinValidite?: string;
    montant?: number;
    dateOperation?: string;
    saisiPar?: string;
    modifiePar?: string;
    lignesReglement?: CreateLigneReglementVignetteInput[];
}