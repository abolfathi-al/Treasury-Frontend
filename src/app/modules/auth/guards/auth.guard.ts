import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
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
    const auth = this.authService.getAuthTokenFromSessionStorage;
    
    // Check if user has valid token
    if (!auth || !auth.accessToken) {
      this.redirectToLogin(state.url);
      return of(false);
    }

    // Check if user is already loaded and authenticated
    if (this.authService.isAuthenticated() && this.authService.currentUserValue) {
      return this.checkPermissions(route, state);
    }

    // Try to get user by token and then check permissions
    return this.authService.getUserByToken().pipe(
      switchMap(user => {
        if (user) {
          return this.checkPermissions(route, state);
        } else {
          this.redirectToLogin(state.url);
          return of(false);
        }
      }),
      catchError((error) => {
        this.logger.error('Auth guard error', 'AuthGuard', { error });
        this.redirectToLogin(state.url);
        return of(false);
      })
    );
  }

  private checkPermissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredPermissions = route.data?.['permissions'] as string[];
    const requiredRoles = route.data?.['roles'] as string[];
    const requiredAnyPermission = route.data?.['anyPermission'] as string[];

    // If no permissions/roles required, allow access
    if (!requiredPermissions && !requiredRoles && !requiredAnyPermission) {
      return of(true);
    }

    // Check required permissions
    if (requiredPermissions && !this.permissionService.hasAllPermissions(requiredPermissions)) {
      this.redirectToUnauthorized(state.url);
      return of(false);
    }

    // Check required roles
    if (requiredRoles && !this.permissionService.hasAnyRole(requiredRoles)) {
      this.redirectToUnauthorized(state.url);
      return of(false);
    }

    // Check any permission requirement
    if (requiredAnyPermission && !this.permissionService.hasAnyPermission(requiredAnyPermission)) {
      this.redirectToUnauthorized(state.url);
      return of(false);
    }

    return of(true);
  }

  private redirectToLogin(returnUrl: string): void {
    this.authService.logout();
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
