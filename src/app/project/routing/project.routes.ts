import { Routes } from '@angular/router';

import { LayoutComponent } from '@shell/layout/layout.component';
import { AuthGuard } from '@modules/auth/guards/auth.guard';

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
    canActivate: [AuthGuard],
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
        path: 'foundation/method-definitions',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            '../../modules/master-data/method-definitions/method-definitions.component'
          ).then((m) => m.MethodDefinitionsComponent),
        data: {
          titleKey: 'workspace.methodDefinitions.title',
          descriptionKey: 'workspace.methodDefinitions.description',
          permissions: ['master-data.view'],
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
