import { Validators } from '@angular/forms';

/**
 * Form Field Configuration Interface
 */
export interface FormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'url' | 'email' | 'number' | 'select' | 'date';
    placeholder?: string;
    validators?: any[];
    errorMessages?: { [key: string]: string };
    cssClasses?: string;
    rows?: number;
    order: number;
    options?: { value: any; label: string }[];
}

/**
 * Vehicle Brand Form Configuration
 * Dynamic form configuration for create/edit forms
 */
export const VEHICLE_BRAND_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: 'label',
        label: 'Brand Label',
        type: 'text',
        placeholder: 'e.g. PEUGEOT, RENAULT...',
        validators: [Validators.required, Validators.maxLength(100)],
        errorMessages: {
            required: 'Brand label is required',
            maxlength: 'Label cannot exceed 100 characters',
        },
        cssClasses: 'col-span-12',
        order: 1,
    },
    {
        name: 'logoUrl',
        label: 'Logo URL',
        type: 'url',
        placeholder: 'https://example.com/logo.png',
        validators: [Validators.maxLength(255)],
        errorMessages: {
            maxlength: 'URL cannot exceed 255 characters',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 2,
    },
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Brand description (optional)',
        validators: [],
        rows: 4,
        cssClasses: 'col-span-12',
        order: 3,
    },
];

/**
 * Default Form Values
 */
export const VEHICLE_BRAND_FORM_DEFAULTS = {
    label: '',
    logoUrl: '',
    description: '',
};