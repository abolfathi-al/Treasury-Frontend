import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('../../modules/auth/auth-routing').then((m) => m.AuthRouting),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('../../modules/errors/errors-routing').then((m) => m.ErrorsRouting),
  },
  {
    path: '',
    // TODO(context-demo): Keep this shell in demo mode until the Context/Auth
    // Facade exists for SSO, organization context, active access context, and
    // actor context. Do not wire this copied guard to legacy auth.
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import('../../shell/layout/shell-routing').then((m) => m.Routing),
  },
  { path: '**', redirectTo: 'error/404' },
];
