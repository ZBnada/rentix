import { VehicleBrandModel } from '../../marque/models/vehicle-brand.model';

/**
 * Energy Type Enum
 */
export enum EnergyType {
    ESSENCE = 'ESSENCE',
    DIESEL = 'DIESEL',
    GPL = 'GPL',
    ELECTRIQUE = 'ELECTRIQUE',
    HYBRIDE = 'HYBRIDE'
}

/**
 * Vehicle Class Enum
 */
export enum VehicleClass {
    TOURISTIQUE = 'TOURISTIQUE',
    UTILITAIRE = 'UTILITAIRE',
    HAUTE_GAMME = 'HAUTE_GAMME'
}

/**
 * Vehicle Model
 */
export class VehicleModel {
    id: string = '';
    registrationNumber: string = '';
    brandId: string = '';
    brand: VehicleBrandModel = new VehicleBrandModel();
    type: string = '';
    firstRegistrationDate: Date = new Date();
    power: number = 0;
    energy: EnergyType = EnergyType.ESSENCE;
    mileage: number = 0;
    color: string | null = null;
    purchasePrice: number = 0;
    vehicleClass: VehicleClass = VehicleClass.TOURISTIQUE;
    dailyRentalPrice: number = 0;
    lateHourPrice: number = 0;
    spareWheel: boolean = false;
    jackHandle: boolean = false;
    coverSet: boolean = false;
    babySeat: boolean = false;
    carpetSet: boolean = false;
    radio: boolean = false;
    hubcapSet: boolean = false;
    observations: string | null = null;
    imageUrl: string | null = null;
    createdBy: string | null = null;
    modifiedBy: string | null = null;
    createdAt: Date = new Date();
    modifiedAt: Date = new Date();
    isActive: boolean = true;

    constructor(data?: Partial<VehicleModel>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    /**
     * Get a safe, displayable image URL
     * Returns null if URL is not a direct image link
     */
    getDisplayableImageUrl(): string | null {
        if (!this.imageUrl) return null;

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

        const isDirectImageUrl = imageExtensions.some(ext =>
            this.imageUrl!.toLowerCase().includes(ext)
        );

        return isDirectImageUrl ? this.imageUrl : null;
    }
}

/**
 * Create Vehicle DTO
 */
export class CreateVehicleDto {
    registrationNumber: string = '';
    brandId: string = '';
    type: string = '';
    firstRegistrationDate: Date = new Date();
    power: number = 0;
    energy: EnergyType = EnergyType.ESSENCE;
    mileage: number = 0;
    color?: string;
    purchasePrice: number = 0;
    vehicleClass: VehicleClass = VehicleClass.TOURISTIQUE;
    dailyRentalPrice: number = 0;
    lateHourPrice: number = 0;
    spareWheel: boolean = false;
    jackHandle: boolean = false;
    coverSet: boolean = false;
    babySeat: boolean = false;
    carpetSet: boolean = false;
    radio: boolean = false;
    hubcapSet: boolean = false;
    observations?: string;
    imageUrl?: string;
    createdBy?: string;

    constructor(data?: Partial<CreateVehicleDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

/**
 * Update Vehicle DTO
 */
export class UpdateVehicleDto {
    id: string = '';
    registrationNumber?: string;
    brandId?: string;
    type?: string;
    firstRegistrationDate?: Date;
    power?: number;
    energy?: EnergyType;
    mileage?: number;
    color?: string;
    purchasePrice?: number;
    vehicleClass?: VehicleClass;
    dailyRentalPrice?: number;
    lateHourPrice?: number;
    spareWheel?: boolean;
    jackHandle?: boolean;
    coverSet?: boolean;
    babySeat?: boolean;
    carpetSet?: boolean;
    radio?: boolean;
    hubcapSet?: boolean;
    observations?: string;
    imageUrl?: string;
    modifiedBy?: string;

    constructor(data?: Partial<UpdateVehicleDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

/**
 * Vehicle Class Item for UI Display
 */
export interface VehicleClassItem {
    value: VehicleClass;
    label: string;
    description?: string;
}

/**
 * Energy Type Item for UI Display
 */
export interface EnergyTypeItem {
    value: EnergyType;
    label: string;
    description?: string;
}

/**
 * Vehicle Classes Data
 */
export const VEHICLE_CLASSES: VehicleClassItem[] = [
    {
        value: VehicleClass.TOURISTIQUE,
        label: 'Tourist Vehicle',
        description: 'Light vehicles for personal or family use'
    },
    {
        value: VehicleClass.UTILITAIRE,
        label: 'Utility Vehicle',
        description: 'Vehicles for professional use or cargo transport'
    },
    {
        value: VehicleClass.HAUTE_GAMME,
        label: 'High-End Vehicle',
        description: 'Luxury and prestige vehicles'
    }
];

/**
 * Energy Types Data
 */
export const ENERGY_TYPES: EnergyTypeItem[] = [
    {
        value: EnergyType.ESSENCE,
        label: 'Gasoline',
        description: 'Gasoline engine'
    },
    {
        value: EnergyType.DIESEL,
        label: 'Diesel',
        description: 'Diesel engine'
    },
    {
        value: EnergyType.GPL,
        label: 'LPG',
        description: 'Liquefied petroleum gas'
    },
    {
        value: EnergyType.ELECTRIQUE,
        label: 'Electric',
        description: 'Electric motor'
    },
    {
        value: EnergyType.HYBRIDE,
        label: 'Hybrid',
        description: 'Hybrid engine (combustion + electric)'
    }
];

/**
 * Get vehicle class label
 */
export function getVehicleClassLabel(value: VehicleClass): string {
    const item = VEHICLE_CLASSES.find(c => c.value === value);
    return item ? item.label : value;
}

/**
 * Get energy type label
 */
export function getEnergyTypeLabel(value: EnergyType): string {
    const item = ENERGY_TYPES.find(e => e.value === value);
    return item ? item.label : value;
}