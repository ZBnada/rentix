export class VehicleBrandModel {
    id: string = '';
    label: string = '';
    logoUrl?: string;
    description?: string;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    isActive: boolean = true;

    constructor(data?: Partial<VehicleBrandModel>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

/**
 * Create Vehicle Brand DTO
 */
export class CreateVehicleBrandDto {
    label: string = '';
    logoUrl?: string;
    description?: string;

    constructor(data?: Partial<CreateVehicleBrandDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

/**
 * Update Vehicle Brand DTO
 */
export class UpdateVehicleBrandDto {
    id: string = '';
    label?: string;
    logoUrl?: string;
    description?: string;

    constructor(data?: Partial<UpdateVehicleBrandDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}