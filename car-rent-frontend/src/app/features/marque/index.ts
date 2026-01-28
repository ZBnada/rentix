/**
 * Public API for Vehicle Brand Module
 * Exports only what should be accessible from other modules
 */

// Routes
export { vehicleBrandRoutes } from './vehicle-brand.routes';

// Models (Classes - not types)
export {
    VehicleBrandModel,
    CreateVehicleBrandDto,
    UpdateVehicleBrandDto
} from './models/vehicle-brand.model';

// Services
export { VehicleBrandService } from './services/vehicle-brand.service';

// Configuration
export {
    VEHICLE_BRAND_FORM_CONFIG,
    VEHICLE_BRAND_FORM_DEFAULTS
} from './config/vehicle-brand-form.config';

// Types (use 'export type' for type-only exports)
export type { FormFieldConfig } from './config/vehicle-brand-form.config';