import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger.service';
import { AuthService } from '../data-access/auth.service';
import { PermissionService } from '../data-access/permission.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);
  private readonly logger = inject(LoggerService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authService.isAuthenticated() && this.authService.currentUserValue) {
      return this.checkPermissions(route, state);
    }

    return this.authService.getCurrentSession().pipe(
      map((session) => {
        if (!session) {
          this.redirectToLogin(state.url);
          return false;
        }
        return this.permissionsAllow(route, state);
      }),
      catchError((error) => {
        this.logger.error('Auth guard error', 'AuthGuard', { error });
        this.redirectToLogin(state.url);
        return of(false);
      })
    );
  }

  private checkPermissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(this.permissionsAllow(route, state));
  }

  private permissionsAllow(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const requiredPermissions = route.data?.['permissions'] as string[];
    const requiredRoles = route.data?.['roles'] as string[];
    const requiredAnyPermission = route.data?.['anyPermission'] as string[];

    if (!requiredPermissions && !requiredRoles && !requiredAnyPermission) {
      return true;
    }

    if (requiredPermissions && !this.permissionService.hasAllPermissions(requiredPermissions)) {
      this.redirectToUnauthorized(state.url);
      return false;
    }

    if (requiredRoles && !this.permissionService.hasAnyRole(requiredRoles)) {
      this.redirectToUnauthorized(state.url);
      return false;
    }

    if (requiredAnyPermission && !this.permissionService.hasAnyPermission(requiredAnyPermission)) {
      this.redirectToUnauthorized(state.url);
      return false;
    }

    return true;
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl }
    });
  }

  private redirectToUnauthorized(returnUrl: string): void {
    this.router.navigate(['/unauthorized'], {
      queryParams: { returnUrl }
    });
  }
}
