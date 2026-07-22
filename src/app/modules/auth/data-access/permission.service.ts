import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Permission {
  name: string;
  description?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly _permissions = signal<string[]>([]);
  private readonly _roles = signal<string[]>([]);

  readonly permissions = computed(() => this._permissions());
  readonly roles = computed(() => this._roles());
  readonly hasPermissions = computed(() => this._permissions().length > 0);
  readonly hasRoles = computed(() => this._roles().length > 0);

  hasPermission(permission: string): boolean {
    return this._permissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  hasRole(role: string): boolean {
    return this._roles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  hasPermission$(permission: string): Observable<boolean> {
    return of(this.hasPermission(permission));
  }

  hasAnyPermission$(permissions: string[]): Observable<boolean> {
    return of(this.hasAnyPermission(permissions));
  }

  hasAllPermissions$(permissions: string[]): Observable<boolean> {
    return of(this.hasAllPermissions(permissions));
  }

  hasRole$(role: string): Observable<boolean> {
    return of(this.hasRole(role));
  }

  hasAnyRole$(roles: string[]): Observable<boolean> {
    return of(this.hasAnyRole(roles));
  }

  hasAllRoles$(roles: string[]): Observable<boolean> {
    return of(this.hasAllRoles(roles));
  }

  loadPermissions(permissions: string[]): void {
    this._permissions.set([...permissions]);
  }

  addPermission(permission: string): void {
    const currentPermissions = this._permissions();
    if (!currentPermissions.includes(permission)) {
      this._permissions.set([...currentPermissions, permission]);
    }
  }

  removePermission(permission: string): void {
    this._permissions.set(
      this._permissions().filter((currentPermission) => currentPermission !== permission)
    );
  }

  loadRoles(roles: string[]): void {
    this._roles.set([...roles]);
  }

  addRole(role: string): void {
    const currentRoles = this._roles();
    if (!currentRoles.includes(role)) {
      this._roles.set([...currentRoles, role]);
    }
  }

  removeRole(role: string): void {
    this._roles.set((this._roles().filter((currentRole) => currentRole !== role)));
  }

  clearPermissions(): void {
    this._permissions.set([]);
  }

  clearRoles(): void {
    this._roles.set([]);
  }

  clearAll(): void {
    this.clearPermissions();
    this.clearRoles();
  }

  getPermissionNames(): string[] {
    return [...this._permissions()];
  }

  getRoleNames(): string[] {
    return [...this._roles()];
  }

  hasPermissionPattern(pattern: string): boolean {
    const permissions = this._permissions();
    return permissions.some(
      (permission) =>
        permission.includes(pattern) ||
        permission.startsWith(pattern) ||
        permission.endsWith(pattern)
    );
  }

  getPermissionsByPattern(pattern: string): string[] {
    return this._permissions().filter(
      (permission) =>
        permission.includes(pattern) ||
        permission.startsWith(pattern) ||
        permission.endsWith(pattern)
    );
  }

  isAdmin(): boolean {
    return (
      this.hasAnyPermission(['admin', 'ADMIN', 'administrator', 'ADMINISTRATOR']) ||
      this.hasAnyRole(['admin', 'ADMIN', 'administrator', 'ADMINISTRATOR'])
    );
  }

  canManageUsers(): boolean {
    return this.hasAnyPermission([
      'user.create',
      'user.read',
      'user.update',
      'user.delete',
      'users.create',
      'users.read',
      'users.update',
      'users.delete',
      'manage.users',
      'user.management',
    ]);
  }

  canManageContent(): boolean {
    return this.hasAnyPermission([
      'content.create',
      'content.read',
      'content.update',
      'content.delete',
      'contents.create',
      'contents.read',
      'contents.update',
      'contents.delete',
      'manage.content',
      'content.management',
    ]);
  }
}
