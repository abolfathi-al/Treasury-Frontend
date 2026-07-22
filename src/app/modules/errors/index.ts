// Error Module - Comprehensive Error Handling System
// This module provides a complete error handling solution with Angular 20 features

// Components
export { ErrorsComponent } from './pages/errors-shell/errors.component';
export * from './components';
export * from './pages';

// Data access
export { ErrorService } from './data-access/error.service';

// Models
export * from './models/error.types';

// Utils
export { ErrorUtils } from './data-access/error.utils';

// Routing
export { ErrorsRouting } from './errors-routing';

// Re-export commonly used types for convenience
export type {
  ErrorInfo,
  ErrorContext,
  ErrorReport,
  ErrorCode,
  ErrorConfig
} from './models/error.types';
