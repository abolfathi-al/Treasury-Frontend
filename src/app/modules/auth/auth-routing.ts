import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth-shell/auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { RegistrationComponent } from './pages/registration/registration.component';

export const AuthRouting: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { 
          returnUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
          titleKey: 'workspace.auth.login.title',
          descriptionKey: 'workspace.auth.login.desc',
        },
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        data: {
          titleKey: 'workspace.auth.register.title',
          descriptionKey: 'workspace.auth.register.desc',
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          titleKey: 'workspace.auth.forgot.title',
          descriptionKey: 'workspace.auth.forgot.desc',
        },
      },
      {
        path: 'logout',
        component: LogoutComponent,
        data: {
          titleKey: 'workspace.auth.logout.title',
          descriptionKey: 'workspace.auth.logout.desc',
        },
      },
      { 
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
      },
    ],
  },
];
