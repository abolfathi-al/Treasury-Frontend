import { Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { ErrorsComponent } from './pages/errors-shell/errors.component';

export const ErrorsRouting: Routes = [
  {
    path: '',
    component: ErrorsComponent,
    children: [
      {
        path: '404',
        component: Error404Component,
        data: {
          titleKey: 'workspace.errors.error404.title',
          descriptionKey: 'workspace.errors.error404.message',
          errorCode: '404',
          showHome: true,
          showBack: true,
          showRetry: false
        }
      },
      {
        path: '500',
        component: Error500Component,
        data: {
          titleKey: 'workspace.errors.error500.title',
          descriptionKey: 'workspace.errors.error500.message',
          errorCode: '500',
          showHome: true,
          showBack: false,
          showRetry: true
        }
      },
      {
        path: '403',
        component: Error404Component, // Reuse 404 component with different data
        data: {
          titleKey: 'workspace.errors.error403.title',
          descriptionKey: 'workspace.errors.error403.message',
          errorCode: '403',
          showHome: true,
          showBack: true,
          showRetry: false
        }
      },
      {
        path: '401',
        component: Error404Component, // Reuse 404 component with different data
        data: {
          titleKey: 'workspace.errors.error401.title',
          descriptionKey: 'workspace.errors.error401.message',
          errorCode: '401',
          showHome: false,
          showBack: true,
          showRetry: false
        }
      },
      {
        path: '400',
        component: Error500Component, // Reuse 500 component with different data
        data: {
          titleKey: 'workspace.errors.error400.title',
          descriptionKey: 'workspace.errors.error400.message',
          errorCode: '400',
          showHome: true,
          showBack: true,
          showRetry: true
        }
      },
      {
        path: '503',
        component: Error500Component, // Reuse 500 component with different data
        data: {
          titleKey: 'workspace.errors.error503.title',
          descriptionKey: 'workspace.errors.error503.message',
          errorCode: '503',
          showHome: true,
          showBack: false,
          showRetry: true
        }
      },
      { 
        path: '', 
        redirectTo: '404', 
        pathMatch: 'full' 
      },
      { 
        path: '**', 
        redirectTo: '404', 
        pathMatch: 'full' 
      },
    ],
  },
];
