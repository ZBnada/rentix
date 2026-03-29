export enum ModePaiementType {
    ESPECE        = 'ESPECE',
    CHEQUE        = 'CHEQUE',
    VIREMENT      = 'VIREMENT',
    CARTE_BANCAIRE = 'CARTE_BANCAIRE',
    KIMBIYALA     = 'KIMBIYALA',
}

export class ModePaiementDisplayConfig {
    value: ModePaiementType;
    libelle: string;
    description: string;
    icon: string;
    color: string;

    constructor(data: Partial<ModePaiementDisplayConfig>) {
        this.value       = data.value!;
        this.libelle     = data.libelle!;
        this.description = data.description!;
        this.icon        = data.icon!;
        this.color       = data.color!;
    }
}

export const MODES_PAIEMENT_DISPLAY_CONFIG: ModePaiementDisplayConfig[] = [
    new ModePaiementDisplayConfig({
        value:       ModePaiementType.ESPECE,
        libelle:     'Cash',
        description: 'Cash payment',
        icon:        '💵',
        color:       'text-green-600 bg-green-50',
    }),
    new ModePaiementDisplayConfig({
        value:       ModePaiementType.CHEQUE,
        libelle:     'Cheque',
        description: 'Bank cheque payment',
        icon:        '🧾',
        color:       'text-blue-600 bg-blue-50',
    }),
    new ModePaiementDisplayConfig({
        value:       ModePaiementType.VIREMENT,
        libelle:     'Bank Transfer',
        description: 'Bank wire transfer',
        icon:        '🏦',
        color:       'text-purple-600 bg-purple-50',
    }),
    new ModePaiementDisplayConfig({
        value:       ModePaiementType.CARTE_BANCAIRE,
        libelle:     'Bank Card',
        description: 'Bank card payment',
        icon:        '💳',
        color:       'text-indigo-600 bg-indigo-50',
    }),
    new ModePaiementDisplayConfig({
        value:       ModePaiementType.KIMBIYALA,
        libelle:     'Kimbiyala',
        description: 'Kimbiyala mobile payment',
        icon:        '📱',
        color:       'text-orange-600 bg-orange-50',
    }),
];

export class ModePaiementUtils {
    static getDisplayConfig(type: string | ModePaiementType): ModePaiementDisplayConfig | undefined {
        return MODES_PAIEMENT_DISPLAY_CONFIG.find((c) => c.value === type);
    }

    static getLibelle(type: string | ModePaiementType): string {
        return this.getDisplayConfig(type)?.libelle || String(type);
    }

    static getIcon(type: string | ModePaiementType): string {
        return this.getDisplayConfig(type)?.icon || '💰';
    }

    static getColor(type: string | ModePaiementType): string {
        return this.getDisplayConfig(type)?.color || 'text-gray-600 bg-gray-50';
    }
}