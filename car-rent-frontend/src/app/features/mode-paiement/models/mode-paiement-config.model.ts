/**
 * Énumération des modes de paiement
 * Synchronisé avec le backend
 */
export enum ModePaiementType {
    ESPECE = 'ESPECE',
    CHEQUE = 'CHEQUE',
    VIREMENT = 'VIREMENT',
    CARTE_BANCAIRE = 'CARTE_BANCAIRE',
    KIMBIYALA = 'KIMBIYALA',
}

/**
 * Interface pour l'affichage des modes de paiement
 */
export class ModePaiementDisplayConfig {
    value: ModePaiementType;
    libelle: string;
    description: string;
    icon: string;
    color: string;

    constructor(data: Partial<ModePaiementDisplayConfig>) {
        this.value = data.value!;
        this.libelle = data.libelle!;
        this.description = data.description!;
        this.icon = data.icon!;
        this.color = data.color!;
    }
}

/**
 * Configuration d'affichage pour chaque mode de paiement
 */
export const MODES_PAIEMENT_DISPLAY_CONFIG: ModePaiementDisplayConfig[] = [
    new ModePaiementDisplayConfig({
        value: ModePaiementType.ESPECE,
        libelle: 'Espèces',
        description: 'Paiement en espèces',
        icon: '💵',
        color: 'text-green-600 bg-green-50',
    }),
    new ModePaiementDisplayConfig({
        value: ModePaiementType.CHEQUE,
        libelle: 'Chèque',
        description: 'Paiement par chèque bancaire',
        icon: '📝',
        color: 'text-blue-600 bg-blue-50',
    }),
    new ModePaiementDisplayConfig({
        value: ModePaiementType.VIREMENT,
        libelle: 'Virement bancaire',
        description: 'Virement bancaire',
        icon: '🏦',
        color: 'text-purple-600 bg-purple-50',
    }),
    new ModePaiementDisplayConfig({
        value: ModePaiementType.CARTE_BANCAIRE,
        libelle: 'Carte bancaire',
        description: 'Paiement par carte bancaire',
        icon: '💳',
        color: 'text-indigo-600 bg-indigo-50',
    }),
];

/**
 * Utilitaires pour Mode Paiement
 */
export class ModePaiementUtils {
    /**
     * Obtenir la configuration d'affichage pour un type donné
     * Accepte string ou ModePaiementType
     */
    static getDisplayConfig(
        type: string | ModePaiementType,
    ): ModePaiementDisplayConfig | undefined {
        return MODES_PAIEMENT_DISPLAY_CONFIG.find((config) => config.value === type);
    }

    /**
     * Obtenir le libellé d'un mode de paiement
     */
    static getLibelle(type: string | ModePaiementType): string {
        const config = this.getDisplayConfig(type);
        return config?.libelle || String(type);
    }

    /**
     * Obtenir l'icône d'un mode de paiement
     */
    static getIcon(type: string | ModePaiementType): string {
        const config = this.getDisplayConfig(type);
        return config?.icon || '💰';
    }

    /**
     * Obtenir la couleur d'un mode de paiement
     */
    static getColor(type: string | ModePaiementType): string {
        const config = this.getDisplayConfig(type);
        return config?.color || 'text-gray-600 bg-gray-50';
    }
}