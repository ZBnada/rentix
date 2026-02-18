import { Validators } from '@angular/forms';

/**
 * Interface pour les champs du formulaire
 */
export interface FormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'file';
    placeholder?: string;
    required?: boolean;
    validators?: any[];
    options?: { value: any; label: string }[];
    rows?: number;
    hint?: string;
    disabled?: boolean;
    step?: string;
    min?: string | number;
    accept?: string;
}

/**
 * Configuration du formulaire Assurance
 */
export const ASSURANCE_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: 'vehiculeId',
        label: 'Véhicule',
        type: 'select',
        placeholder: 'Sélectionnez un véhicule',
        required: true,
        validators: [Validators.required],
        hint: 'Choisissez le véhicule à assurer',
    },
    {
        name: 'prestataire',
        label: 'Prestataire (Compagnie d\'assurance)',
        type: 'text',
        placeholder: 'Ex: Star Assurances',
        required: true,
        validators: [Validators.required, Validators.maxLength(200)],
        hint: 'Nom de la compagnie d\'assurance',
    },
    {
        name: 'numeroPolice',
        label: 'Numéro de police',
        type: 'text',
        placeholder: 'Ex: POL-2024-12345',
        required: false,
        validators: [Validators.maxLength(100)],
        hint: 'Numéro de la police d\'assurance (optionnel)',
    },
    {
        name: 'dateDebut',
        label: 'Date de début',
        type: 'date',
        required: true,
        validators: [Validators.required],
        hint: 'Date de début de validité de l\'assurance',
    },
    {
        name: 'dateFinValidite',
        label: 'Date de fin de validité',
        type: 'date',
        required: true,
        validators: [Validators.required],
        hint: 'Date d\'expiration de l\'assurance',
    },
    {
        name: 'montantTotal',
        label: 'Montant total (TND)',
        type: 'number',
        placeholder: '0.000',
        required: true,
        validators: [Validators.required, Validators.min(0)],
        step: '0.001',
        min: 0,
        hint: 'Montant total de l\'assurance',
    },
    {
        name: 'dateOperation',
        label: 'Date d\'opération',
        type: 'date',
        required: true,
        validators: [Validators.required],
        hint: 'Date de la transaction',
    },
    {
        name: 'observations',
        label: 'Observations',
        type: 'textarea',
        placeholder: 'Notes ou remarques supplémentaires...',
        required: false,
        rows: 4,
        hint: 'Informations complémentaires (optionnel)',
    },
    {
        name: 'documentUrl',
        label: 'Document (Police d\'assurance)',
        type: 'file',
        required: false,
        accept: '.pdf,.jpg,.jpeg,.png',
        hint: 'Télécharger le document de la police d\'assurance (PDF, JPG, PNG)',
    },
];

/**
 * Configuration du formulaire Règlement
 */
export const ASSURANCE_REGLEMENT_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: 'modePaiementId',
        label: 'Mode de paiement',
        type: 'select',
        placeholder: 'Sélectionnez un mode de paiement',
        required: true,
        validators: [Validators.required],
        hint: 'Méthode de paiement utilisée',
    },
    {
        name: 'designation',
        label: 'Désignation',
        type: 'text',
        placeholder: 'Ex: Première échéance',
        required: false,
        validators: [Validators.maxLength(200)],
        hint: 'Description du règlement (optionnel)',
    },
    {
        name: 'montant',
        label: 'Montant (TND)',
        type: 'number',
        placeholder: '0.000',
        required: true,
        validators: [Validators.required, Validators.min(0)],
        step: '0.001',
        min: 0,
        hint: 'Montant du règlement',
    },
    {
        name: 'dateOperation',
        label: 'Date d\'opération',
        type: 'date',
        required: true,
        validators: [Validators.required],
        hint: 'Date du paiement',
    },
    {
        name: 'echeance',
        label: 'Date d\'échéance',
        type: 'date',
        required: false,
        hint: 'Date d\'échéance du paiement (optionnel)',
    },
    {
        name: 'referencePiece',
        label: 'Référence de pièce',
        type: 'text',
        placeholder: 'Ex: CHQ-123456',
        required: false,
        validators: [Validators.maxLength(100)],
        hint: 'Numéro de chèque, virement, etc. (optionnel)',
    },
    {
        name: 'banque',
        label: 'Banque',
        type: 'text',
        placeholder: 'Ex: BIAT',
        required: false,
        validators: [Validators.maxLength(200)],
        hint: 'Nom de la banque (optionnel)',
    },
    {
        name: 'porteur',
        label: 'Porteur',
        type: 'text',
        placeholder: 'Nom du porteur',
        required: false,
        validators: [Validators.maxLength(200)],
        hint: 'Nom de la personne qui a effectué le paiement (optionnel)',
    },
];

/**
 * Classe utilitaire pour construire les formulaires
 */
export class AssuranceFormBuilder {
    /**
     * Obtenir la configuration des champs Assurance
     */
    static getAssuranceFieldsConfig(): FormFieldConfig[] {
        return ASSURANCE_FORM_CONFIG;
    }

    /**
     * Obtenir la configuration des champs Règlement
     */
    static getReglementFieldsConfig(): FormFieldConfig[] {
        return ASSURANCE_REGLEMENT_FORM_CONFIG;
    }

    /**
     * Créer un objet de contrôles pour FormGroup Assurance
     */
    static buildAssuranceFormControls(): Record<string, any> {
        const controls: Record<string, any> = {};

        ASSURANCE_FORM_CONFIG.forEach((field) => {
            controls[field.name] = [
                { value: '', disabled: field.disabled || false },
                field.validators || [],
            ];
        });

        return controls;
    }

    /**
     * Créer un objet de contrôles pour FormGroup Règlement
     */
    static buildReglementFormControls(): Record<string, any> {
        const controls: Record<string, any> = {};

        ASSURANCE_REGLEMENT_FORM_CONFIG.forEach((field) => {
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
    static getValidators(
        fieldName: string,
        isReglement: boolean = false,
    ): any[] {
        const config = isReglement
            ? ASSURANCE_REGLEMENT_FORM_CONFIG
            : ASSURANCE_FORM_CONFIG;
        const field = config.find((f) => f.name === fieldName);
        return field?.validators || [];
    }
}