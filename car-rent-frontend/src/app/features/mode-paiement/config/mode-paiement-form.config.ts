import { Validators } from '@angular/forms';
import {
    ModePaiementType,
    MODES_PAIEMENT_DISPLAY_CONFIG,
} from '../models/mode-paiement-config.model';

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

export const MODE_PAIEMENT_FORM_CONFIG: FormFieldConfig[] = [
    {
        name:        'type',
        label:       'Payment Type',
        type:        'select',
        placeholder: 'Select a type',
        required:    true,
        validators:  [Validators.required],
        options:     MODES_PAIEMENT_DISPLAY_CONFIG.map((config) => ({
            value: config.value,
            label: `${config.icon} ${config.libelle}`,
            icon:  config.icon,
        })),
        hint: 'Choose the payment method type',
    },
    {
        name:        'libelle',
        label:       'Label',
        type:        'text',
        placeholder: 'e.g. Cash',
        required:    true,
        validators:  [Validators.required, Validators.maxLength(100)],
        hint:        'Display name for this payment method',
    },
    {
        name:        'description',
        label:       'Description',
        type:        'textarea',
        placeholder: 'Payment method description',
        required:    false,
        rows:        3,
        hint:        'Additional details about this payment method',
    },
    {
        name:        'icon',
        label:       'Icon (Emoji)',
        type:        'text',
        placeholder: '💵',
        required:    false,
        validators:  [Validators.maxLength(10)],
        hint:        'Emoji representing the payment method',
    },
];

export class ModePaiementFormBuilder {
    static getFieldsConfig(): FormFieldConfig[] {
        return MODE_PAIEMENT_FORM_CONFIG;
    }

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

    static getValidators(fieldName: string): any[] {
        const field = MODE_PAIEMENT_FORM_CONFIG.find((f) => f.name === fieldName);
        return field?.validators || [];
    }
}