export enum StatutControleTechnique {
    BROUILLON = 'BROUILLON',
    VALIDE    = 'VALIDE',
    ANNULE    = 'ANNULE',
}

export interface ModePaiement {
    id: string;
    type: string;
    libelle: string;
    icon?: string;
}

export interface LigneReglementControleTechnique {
    id: string;
    controleTechniqueId: string;
    modePaiementId: string;
    modePaiement: ModePaiement;
    designation?: string;
    montant: number;
    echeance?: string;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
    dateOperation: string;
    createdAt?: Date;
}

export interface Vehicule {
    id: string;
    matricule: string;
    marque?: { libelle: string };
}

export interface ControleTechnique {
    id: string;
    vehiculeId: string;
    vehicule: Vehicule;
    matriculeVehicule: string;
    dateFinValidite: string;
    montant: number;
    montantReste: number;
    dateOperation: string;
    numeroFiche: number;
    statut: StatutControleTechnique;
    lignesReglement: LigneReglementControleTechnique[];
    saisiPar?: string;
    modifiePar?: string;
    validePar?: string;
    annulePar?: string;
    saisiLe: Date;
    modifieLe: Date;
}

export interface CreateLigneReglementControleTechniqueInput {
    modePaiementId: string;
    designation?: string;
    montant: number;
    echeance?: string;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
    dateOperation: string;
}

export interface CreateControleTechniqueInput {
    vehiculeId: string;
    dateFinValidite: string;
    montant: number;
    dateOperation: string;
    saisiPar?: string;
    lignesReglement: CreateLigneReglementControleTechniqueInput[];
}

export interface UpdateControleTechniqueInput {
    id: string;
    vehiculeId?: string;
    dateFinValidite?: string;
    montant?: number;
    dateOperation?: string;
    modifiePar?: string;
    lignesReglement?: CreateLigneReglementControleTechniqueInput[];
}