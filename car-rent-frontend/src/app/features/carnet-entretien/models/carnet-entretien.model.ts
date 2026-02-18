export interface CarnetEntretien {
    id: string;
    vehiculeId: string;
    vehiculeMatricule: string;
    typeEntretienId: string;
    codeEntretien: string;
    designation: string;
    dateDebut: Date;
    dateFin: Date | null;
    kilometrageDebut: number;
    kilometrageFin: number | null;
    coutEstime: number;
    coutReel: number | null;
    notes: string | null;
    statut: string;
    saisiPar: string | null;
    modifiePar: string | null;
    saisiLe: Date;
    modifieLe: Date;
}

export interface UpdateCarnetEntretienInput {
    id: string;
    dateFin?: Date;
    kilometrageFin?: number;
    coutReel?: number;
    notes?: string;
    statut?: string;
    modifiePar?: string;
}

export interface VehiculeWithEntretiens {
    id: string;
    matricule: string;
    marque: string;
    type: string;
    nombreEntretiens: number;
}