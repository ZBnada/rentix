/**
 * Exports centralisés du module Assurance
 */

// Routes
export * from './assurance.routes';

// Components
export * from './components/assurance-list/assurance-list.component';
export * from './components/assurance-form/assurance-form.component';
export * from './components/assurance-reglement-form/assurance-reglement-form.component';
export * from './components/assurance-form-modal/assurance-form-modal.component';


// Pages
export * from './pages/assurance-index/assurance-index.component';
export * from './pages/assurance-detail/assurance-detail.component';
export * from './pages/assurance-form-page/assurance-form-page.component';

// Models
export * from './models/assurance-config.model';

// Config
export * from './config/assurance-form.config';

// Services
// @ts-ignore
export * from './services/assurance.service';