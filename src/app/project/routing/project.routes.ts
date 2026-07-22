import { Routes } from '@angular/router';

import { LayoutComponent } from '@shell/layout/layout.component';

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
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../demo/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        data: {
          titleKey: 'workspace.dashboard.title',
          descriptionKey: 'workspace.dashboard.description',
        },
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
  { path: '**', redirectTo: 'error/404' },
];
