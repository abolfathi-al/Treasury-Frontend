import { Routes } from '@angular/router';
import { LayoutComponent } from '@shell/layout/layout.component';

const Routing: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
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
];

export { Routing };
