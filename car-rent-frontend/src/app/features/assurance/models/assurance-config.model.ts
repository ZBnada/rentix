import { format } from 'date-fns';

/**
 * Interface pour Assurance (sera remplacée par OpenAPI)
 */
export interface Assurance {
    id: string;
    vehiculeId: string;
    vehicule?: any; // VehiculeResource du backend
    prestataire: string;
    dateDebut: Date;
    dateFinValidite: Date;
    montantTotal: number;
    dateOperation: Date;
    numeroPolice?: string;
    observations?: string;
    documentUrl?: string | null;
    reglements: AssuranceReglement[];
    saisiPar?: string;
    modifiePar?: string;
    saisiLe: Date;
    modifieLe: Date;
    estActif: boolean;
}

/**
 * Interface pour AssuranceReglement
 */
export interface AssuranceReglement {
    id: string;
    assuranceId: string;
    modePaiementId: string;
    modePaiement?: any; // ModePaiementResource
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

/**
 * Classe utilitaire pour Assurance
 */
export class AssuranceUtils {
    /**
     * Vérifier si une assurance est expirée
     */
    static isExpired(assurance: Assurance): boolean {
        return new Date(assurance.dateFinValidite) < new Date();
    }

    /**
     * Vérifier si une assurance expire bientôt (dans les 30 jours)
     */
    static isExpiringSoon(assurance: Assurance, daysThreshold: number = 30): boolean {
        const today = new Date();
        const expiryDate = new Date(assurance.dateFinValidite);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= daysThreshold;
    }

    /**
     * Obtenir le statut de l'assurance
     */
    static getStatus(assurance: Assurance): {
        label: string;
        color: string;
        icon: string;
    } {
        if (this.isExpired(assurance)) {
            return {
                label: 'Expirée',
                color: 'text-red-700 bg-red-50 border-red-200',
                icon: '❌',
            };
        }

        if (this.isExpiringSoon(assurance, 30)) {
            return {
                label: 'Expire bientôt',
                color: 'text-orange-700 bg-orange-50 border-orange-200',
                icon: '⚠️',
            };
        }

        return {
            label: 'Active',
            color: 'text-green-700 bg-green-50 border-green-200',
            icon: '✅',
        };
    }

    /**
     * Calculer le nombre de jours restants
     */
    static getDaysRemaining(assurance: Assurance): number {
        const today = new Date();
        const expiryDate = new Date(assurance.dateFinValidite);
        const diffTime = expiryDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Formater une date
     */
    static formatDate(date: Date | string): string {
        return format(new Date(date), 'dd/MM/yyyy');
    }

    /**
     * Formater un montant
     */
    static formatMontant(montant: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'TND',
        }).format(montant);
    }

    /**
     * Calculer la durée de validité en jours
     */
    static getValidityDuration(assurance: Assurance): number {
        const start = new Date(assurance.dateDebut);
        const end = new Date(assurance.dateFinValidite);
        const diffTime = end.getTime() - start.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Vérifier si le total des règlements correspond au montant total
     */
    static isReglementBalanced(assurance: Assurance): boolean {
        const totalReglements = assurance.reglements.reduce(
            (sum, reglement) => sum + reglement.montant,
            0,
        );
        return Math.abs(totalReglements - assurance.montantTotal) < 0.01;
    }

    /**
     * Obtenir la classe CSS pour le badge de statut
     */
    static getStatusBadgeClass(assurance: Assurance): string {
        const status = this.getStatus(assurance);
        return `inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border ${status.color}`;
    }
}

/**
 * Configuration des couleurs par statut
 */
export const ASSURANCE_STATUS_CONFIG = {
    active: {
        label: 'Active',
        color: 'text-green-700 bg-green-50 border-green-200',
        icon: '✅',
    },
    expiringSoon: {
        label: 'Expire bientôt',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        icon: '⚠️',
    },
    expired: {
        label: 'Expirée',
        color: 'text-red-700 bg-red-50 border-red-200',
        icon: '❌',
    },
};