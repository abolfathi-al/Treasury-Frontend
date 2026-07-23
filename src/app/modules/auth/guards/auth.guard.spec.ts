import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { AuthService } from '../data-access/auth.service';
import { PermissionService } from '../data-access/permission.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard Method Definition RBAC', () => {
  it('blocks an authenticated session without master-data.view', async () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const permissionService = jasmine.createSpyObj<PermissionService>(
      'PermissionService',
      ['hasAllPermissions', 'hasAnyRole', 'hasAnyPermission'],
    );
    permissionService.hasAllPermissions.and.returnValue(false);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: () => true,
            currentUserValue: { sessionId: 'session-1' },
          },
        },
        { provide: PermissionService, useValue: permissionService },
        { provide: Router, useValue: router },
        {
          provide: LoggerService,
          useValue: jasmine.createSpyObj<LoggerService>('LoggerService', [
            'error',
          ]),
        },
      ],
    });

    const result = await firstValueFrom(
      TestBed.inject(AuthGuard).canActivate(
        {
          data: { permissions: ['master-data.view'] },
        } as unknown as ActivatedRouteSnapshot,
        { url: '/foundation/method-definitions' } as RouterStateSnapshot,
      ),
    );

    expect(result).toBeFalse();
    expect(permissionService.hasAllPermissions).toHaveBeenCalledWith([
      'master-data.view',
    ]);
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized'], {
      queryParams: { returnUrl: '/foundation/method-definitions' },
    });
  });
});
