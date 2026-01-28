import { Validators } from '@angular/forms';
import { EnergyType, VehicleClass, ENERGY_TYPES, VEHICLE_CLASSES } from '../models/vehicle.model';

/**
 * Form Field Configuration Interface
 */
export interface VehicleFormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'url' | 'number' | 'date' | 'select' | 'checkbox';
    placeholder?: string;
    validators?: any[];
    errorMessages?: { [key: string]: string };
    cssClasses?: string;
    rows?: number;
    order: number;
    options?: { value: any; label: string }[];
    section?: string;
}

/**
 * Vehicle Form Configuration
 * Organized in sections for better UX
 */
export const VEHICLE_FORM_CONFIG: VehicleFormFieldConfig[] = [
    // Section: Basic Information
    {
        name: 'registrationNumber',
        label: 'Registration Number',
        type: 'text',
        placeholder: 'e.g. ABC-123-TN',
        validators: [Validators.required, Validators.maxLength(100)],
        errorMessages: {
            required: 'Registration number is required',
            maxlength: 'Registration number cannot exceed 100 characters',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 1,
        section: 'basic'
    },
    {
        name: 'brandId',
        label: 'Brand',
        type: 'select',
        placeholder: 'Select a brand',
        validators: [Validators.required],
        errorMessages: {
            required: 'Brand is required',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 2,
        section: 'basic',
        options: [] // Will be populated dynamically from API
    },
    {
        name: 'type',
        label: 'Vehicle Type/Model',
        type: 'text',
        placeholder: 'e.g. 208, 308, Clio...',
        validators: [Validators.required, Validators.maxLength(100)],
        errorMessages: {
            required: 'Vehicle type is required',
            maxlength: 'Vehicle type cannot exceed 100 characters',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 3,
        section: 'basic'
    },
    {
        name: 'firstRegistrationDate',
        label: 'First Registration Date',
        type: 'date',
        validators: [Validators.required],
        errorMessages: {
            required: 'First registration date is required',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 4,
        section: 'basic'
    },

    // Section: Technical Specifications
    {
        name: 'energy',
        label: 'Energy Type',
        type: 'select',
        validators: [Validators.required],
        errorMessages: {
            required: 'Energy type is required',
        },
        cssClasses: 'col-span-12 md:col-span-4',
        order: 5,
        section: 'technical',
        options: ENERGY_TYPES.map(e => ({ value: e.value, label: e.label }))
    },
    {
        name: 'power',
        label: 'Power (CV)',
        type: 'number',
        placeholder: '0',
        validators: [Validators.required, Validators.min(0)],
        errorMessages: {
            required: 'Power is required',
            min: 'Power must be at least 0',
        },
        cssClasses: 'col-span-12 md:col-span-4',
        order: 6,
        section: 'technical'
    },
    {
        name: 'mileage',
        label: 'Mileage (km)',
        type: 'number',
        placeholder: '0',
        validators: [Validators.required, Validators.min(0)],
        errorMessages: {
            required: 'Mileage is required',
            min: 'Mileage must be at least 0',
        },
        cssClasses: 'col-span-12 md:col-span-4',
        order: 7,
        section: 'technical'
    },
    {
        name: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g. White, Black, Blue...',
        validators: [Validators.maxLength(50)],
        errorMessages: {
            maxlength: 'Color cannot exceed 50 characters',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 8,
        section: 'technical'
    },

    // Section: Classification & Pricing
    {
        name: 'vehicleClass',
        label: 'Vehicle Class',
        type: 'select',
        validators: [Validators.required],
        errorMessages: {
            required: 'Vehicle class is required',
        },
        cssClasses: 'col-span-12 md:col-span-6',
        order: 9,
        section: 'pricing',
        options: VEHICLE_CLASSES.map(c => ({ value: c.value, label: c.label }))
    },
    {
        name: 'purchasePrice',
        label: 'Purchase Price (TND)',
        type: 'number',
        placeholder: '0.000',
        validators: [Validators.required, Validators.min(0)],
        errorMessages: {
            required: 'Purchase price is required',
            min: 'Purchase price must be at least 0',
        },
        cssClasses: 'col-span-12 md:col-span-4',
        order: 10,
        section: 'pricing'
    },
    {
        name: 'dailyRentalPrice',
        label: 'Daily Rental Price (TND)',
        type: 'number',
        placeholder: '0.000',
        validators: [Validators.required, Validators.min(0)],
        errorMessages: {
            required: 'Daily rental price is required',
            min: 'Daily rental price must be at least 0',
        },
        cssClasses: 'col-span-12 md:col-span-4',
        order: 11,
        section: 'pricing'
    },
    {
        name: 'lateHourPrice',
        label: 'Late Hour Price (TND)',
        type: 'number',
        placeholder: '0.000',
        validators: [Validators.required, Validators.min(0)],
        errorMessages: {
            required: 'Late hour price is required',
            min: 'Late hour price must be at least 0',
        },
        cssClasses: 'col-span-12 md:col-span-4',
        order: 12,
        section: 'pricing'
    },

    // Section: Equipment
    {
        name: 'spareWheel',
        label: 'Spare Wheel',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 13,
        section: 'equipment'
    },
    {
        name: 'jackHandle',
        label: 'Jack & Handle',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 14,
        section: 'equipment'
    },
    {
        name: 'coverSet',
        label: 'Cover Set',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 15,
        section: 'equipment'
    },
    {
        name: 'babySeat',
        label: 'Baby Seat',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 16,
        section: 'equipment'
    },
    {
        name: 'carpetSet',
        label: 'Carpet Set',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 17,
        section: 'equipment'
    },
    {
        name: 'radio',
        label: 'Radio',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 18,
        section: 'equipment'
    },
    {
        name: 'hubcapSet',
        label: 'Hubcap Set',
        type: 'checkbox',
        validators: [],
        cssClasses: 'col-span-12 md:col-span-6 lg:col-span-4',
        order: 19,
        section: 'equipment'
    },

    // Section: Additional Information
    {
        name: 'observations',
        label: 'Observations',
        type: 'textarea',
        placeholder: 'Additional notes about the vehicle...',
        validators: [],
        rows: 4,
        cssClasses: 'col-span-12',
        order: 20,
        section: 'additional'
    },
    {
        name: 'imageUrl',
        label: 'Image URL',
        type: 'url',
        placeholder: 'https://example.com/vehicle-image.jpg',
        validators: [Validators.maxLength(255)],
        errorMessages: {
            maxlength: 'Image URL cannot exceed 255 characters',
        },
        cssClasses: 'col-span-12',
        order: 21,
        section: 'additional'
    },
];

/**
 * Default Form Values
 */
export const VEHICLE_FORM_DEFAULTS = {
    registrationNumber: '',
    brandId: '',
    type: '',
    firstRegistrationDate: new Date(),
    power: 0,
    energy: EnergyType.ESSENCE,
    mileage: 0,
    color: '',
    purchasePrice: 0,
    vehicleClass: VehicleClass.TOURISTIQUE,
    dailyRentalPrice: 0,
    lateHourPrice: 0,
    spareWheel: false,
    jackHandle: false,
    coverSet: false,
    babySeat: false,
    carpetSet: false,
    radio: false,
    hubcapSet: false,
    observations: '',
    imageUrl: '',
};

/**
 * Form Sections Configuration
 */
export const FORM_SECTIONS = [
    { id: 'basic', title: 'Basic Information', icon: 'info' },
    { id: 'technical', title: 'Technical Specifications', icon: 'cog' },
    { id: 'pricing', title: 'Classification & Pricing', icon: 'currency' },
    { id: 'equipment', title: 'Equipment', icon: 'tool' },
    { id: 'additional', title: 'Additional Information', icon: 'document' },
];