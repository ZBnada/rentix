/**
 * Model for maintenance type
 */
export interface TypeEntretien {
    id: string;
    codeEntretien: string;
    designation: string;
    description?: string | null;
    frequenceJoursRecommandee?: number | null;
    frequenceKmRecommandee?: number | null;
    coutMoyenEstime: number;
    estObligatoire: boolean;
    saisiPar?: string | null;
    modifiePar?: string | null;
    saisiLe: Date;
    modifieLe: Date;
    estActif: boolean;
}

/**
 * Input for creating a maintenance type
 */
export interface CreateTypeEntretienInput {
    codeEntretien: string;
    designation: string;
    description?: string | null;
    frequenceJoursRecommandee?: number | null;
    frequenceKmRecommandee?: number | null;
    coutMoyenEstime?: number;
    estObligatoire?: boolean;
}

/**
 * Input for updating a maintenance type
 */
export interface UpdateTypeEntretienInput {
    id: string;
    codeEntretien?: string;
    designation?: string;
    description?: string | null;
    frequenceJoursRecommandee?: number | null;
    frequenceKmRecommandee?: number | null;
    coutMoyenEstime?: number;
    estObligatoire?: boolean;
}

/**
 * Filter options for maintenance types
 */
export interface TypeEntretienFilter {
    searchTerm?: string;
    onlyObligatoire?: boolean;
    estActif?: boolean;
}