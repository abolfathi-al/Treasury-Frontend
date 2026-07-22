// Auth Module - Comprehensive Auth Handling System
// This module provides a complete auth solution with Angular 20 features

// Components
export { AuthComponent } from './pages/auth-shell/auth.component';
export * from './pages';

// Data access
export * from './data-access';
export * from './guards';

// Models
export * from '@models/auth';

// Routing
export { AuthRouting } from './auth-routing';

// Re-export commonly used types for convenience
export type {
    AuthState,
    UserType,
} from './data-access/auth.service';
