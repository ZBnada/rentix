/**
 * Public API for Vehicle Module
 * Exports only what should be accessible from other modules
 */

// Routes
export { vehicleRoutes } from './vehicleRoutes';

// Models
export {
    VehicleModel,
    CreateVehicleDto,
    UpdateVehicleDto,
    EnergyType,
    VehicleClass,
    VEHICLE_CLASSES,
    ENERGY_TYPES,
    getVehicleClassLabel,
    getEnergyTypeLabel
} from './models/vehicle.model';

// Services
export { VehicleService } from './services/vehicle.service';

// Configuration
export {
    VEHICLE_FORM_CONFIG,
    VEHICLE_FORM_DEFAULTS,
    FORM_SECTIONS
} from './config/vehicle-form.config';

export type {
    VehicleFormFieldConfig,
} from './config/vehicle-form.config';