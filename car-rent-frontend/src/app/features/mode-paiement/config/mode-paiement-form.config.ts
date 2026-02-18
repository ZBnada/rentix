import { Validators } from '@angular/forms';
import {
    ModePaiementType,
    MODES_PAIEMENT_DISPLAY_CONFIG,
} from '../models/mode-paiement-config.model';

/**
 * Interface pour les champs du formulaire
 */
export interface FormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'email';
    placeholder?: string;
    required?: boolean;
    validators?: any[];
    options?: { value: any; label: string; icon?: string }[];
    rows?: number;
    hint?: string;
    disabled?: boolean;
}

/**
 * Configuration du formulaire Mode Paiement
 */
export const MODE_PAIEMENT_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: 'type',
        label: 'Type de paiement',
        type: 'select',
        placeholder: 'Sélectionnez un type',
        required: true,
        validators: [Validators.required],
        options: MODES_PAIEMENT_DISPLAY_CONFIG.map((config) => ({
            value: config.value,
            label: `${config.icon} ${config.libelle}`,
            icon: config.icon,
        })),
        hint: 'Choisissez le type de mode de paiement',
    },
    {
        name: 'libelle',
        label: 'Libellé',
        type: 'text',
        placeholder: 'Ex: Espèces',
        required: true,
        validators: [Validators.required, Validators.maxLength(100)],
        hint: 'Nom affiché pour ce mode de paiement',
    },
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Description du mode de paiement',
        required: false,
        rows: 3,
        hint: 'Détails supplémentaires sur ce mode de paiement',
    },
    {
        name: 'icon',
        label: 'Icône (Emoji)',
        type: 'text',
        placeholder: '💵',
        required: false,
        validators: [Validators.maxLength(10)],
        hint: 'Emoji représentant le mode de paiement',
    },
];

/**
 * Classe utilitaire pour construire le formulaire
 */
export class ModePaiementFormBuilder {
    /**
     * Obtenir la configuration des champs
     */
    static getFieldsConfig(): FormFieldConfig[] {
        return MODE_PAIEMENT_FORM_CONFIG;
    }

    /**
     * Créer un objet de contrôles pour FormGroup
     */
    static buildFormControls(): Record<string, any> {
        const controls: Record<string, any> = {};

        MODE_PAIEMENT_FORM_CONFIG.forEach((field) => {
            controls[field.name] = [
                { value: '', disabled: field.disabled || false },
                field.validators || [],
            ];
        });

        return controls;
    }

    /**
     * Obtenir les validateurs pour un champ
     */
    static getValidators(fieldName: string): any[] {
        const field = MODE_PAIEMENT_FORM_CONFIG.find((f) => f.name === fieldName);
        return field?.validators || [];
    }
}