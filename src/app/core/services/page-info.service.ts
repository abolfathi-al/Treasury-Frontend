import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { APP_BRAND } from '@core/config/brand.config';
import {
  isPageNavigationItemActive,
  isPageNavigationItemCurrentPage,
  normalizePageNavigationUrl,
  PAGE_NAVIGATION_ITEMS,
  PageNavigationItem,
} from '@core/navigation';

export interface PageLink {
  title: string;
  path: string;
  isActive: boolean;
  isSeparator?: boolean;
}

export class PageInfo {
  breadcrumbs: Array<PageLink> = [];
  title: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class PageInfoService {
  private readonly router = inject(Router);
  private readonly titleSrv = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly navigationItems = inject(PAGE_NAVIGATION_ITEMS);
  private readonly brand = inject(APP_BRAND);

  private readonly _title = signal<string>('Dashboard');
  private readonly _description = signal<string>('');
  private readonly _breadcrumbs = signal<Array<PageLink>>([]);
  private readonly _defaultTitle = signal<string>(this.brand.defaultTitle);
  private readonly _titleSeparator = signal<string>(this.brand.titleSeparator);

  private isInitialized = false;

  readonly title = computed(() => this._title());
  readonly description = computed(() => this._description());
  readonly breadcrumbs = computed(() => this._breadcrumbs());
  readonly defaultTitle = computed(() => this._defaultTitle());
  readonly titleSeparator = computed(() => this._titleSeparator());

  public titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Dashboard');
  public descriptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public breadcrumbsSubject: BehaviorSubject<Array<PageLink>> = new BehaviorSubject<Array<PageLink>>([]);

  init(): void {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.refreshFromRoute();

    const navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.refreshFromRoute());

    this.destroyRef.onDestroy(() => navSub.unsubscribe());
  }

  public setTitle(_title: string) {
    const full = this.buildTitle(_title);
    this._title.set(full);
    this.titleSubject.next(full);
    if (full) {
      this.titleSrv.setTitle(full);
    }
  }

  public updateTitle(_title: string) {
    this.setTitle(_title);
  }

  setTranslatedTitle(titleKey: string, params?: Record<string, unknown>): void {
    this.translate.get(titleKey, params).subscribe((translatedTitle) => {
      this.setTitle(translatedTitle);
    });
  }

  setTranslatedTitle$(titleKey: string, params?: Record<string, unknown>): Observable<string> {
    return this.translate.get(titleKey, params).pipe(
      tap((translatedTitle) => this.setTitle(translatedTitle))
    );
  }

  setDynamicTitle(
    titleKey: string,
    dynamicContent: string,
    params?: Record<string, unknown>
  ): void {
    this.translate.get(titleKey, params).subscribe((translatedTitle) => {
      const full = `${translatedTitle} ${dynamicContent}`;
      this.setTitle(full);
    });
  }

  setBreadcrumbTitle(breadcrumbs: string[], separator: string = ' > '): void {
    const breadcrumbTitle = breadcrumbs.join(separator);
    this.setTitle(breadcrumbTitle);
  }

  async setTranslatedBreadcrumbTitle(
    breadcrumbKeys: string[],
    separator: string = ' > ',
    params?: Record<string, unknown>
  ): Promise<void> {
    const translated = await Promise.all(
      breadcrumbKeys.map((key) => this.translate.get(key, params).toPromise())
    );
    const breadcrumbTitle = translated.join(separator);
    this.setTitle(breadcrumbTitle);
  }

  getCurrentTitle(): string {
    return this.titleSrv.getTitle();
  }

  resetToDefault(): void {
    const def = this._defaultTitle();
    this.titleSrv.setTitle(def);
    this._title.set(def);
    this.titleSubject.next(def);
  }

  getDefaultTitle(): string {
    return this._defaultTitle();
  }

  setDefaultTitle(title: string): void {
    this._defaultTitle.set(title);
  }

  setTitleSeparator(separator: string): void {
    this._titleSeparator.set(separator);
  }

  public setDescription(_description: string) {
    this._description.set(_description);
    this.descriptionSubject.next(_description);
  }

  public updateDescription(_description: string) {
    this.setDescription(_description);
  }

  public setBreadcrumbs(_bs: Array<PageLink>) {
    this._breadcrumbs.set(_bs);
    this.breadcrumbsSubject.next(_bs);
  }

  public updateBreadcrumbs(_bs: Array<PageLink>) {
    this.setBreadcrumbs(_bs);
  }

  public calculateTitle() {
    const title = this.resolveRouteTitle(this.getDeepestRouteData());
    this.setTitle(title);
  }

  public calculateTitleInMenu(_menuId: string): string | undefined {
    return undefined;
  }

  public calculateBreadcrumbs() {
    const routeBc = this.getRouteDataBreadcrumbs();
    if (routeBc && routeBc.length) {
      const normalized = this.markLastBreadcrumbActive(routeBc);
      this.setBreadcrumbs(normalized);
      return;
    }

    this.setBreadcrumbs(this.getNavigationBreadcrumbs());
  }

  public calculateBreadcrumbsInMenu(_menuId: string): Array<PageLink> | undefined {
    return undefined;
  }

  private refreshFromRoute(): void {
    const data = this.getDeepestRouteData();
    this.setTitle(this.resolveRouteTitle(data));
    this.setDescription(this.resolveRouteDescription(data));
    this.calculateBreadcrumbs();
  }

  private resolveRouteTitle(data: Data): string {
    const titleKey = data['titleKey'];
    if (typeof titleKey === 'string' && titleKey) {
      return this.translateKey(titleKey);
    }

    const title = data['title'];
    return typeof title === 'string' ? title : '';
  }

  private resolveRouteDescription(data: Data): string {
    const descriptionKey = data['descriptionKey'];
    if (typeof descriptionKey === 'string' && descriptionKey) {
      return this.translateKey(descriptionKey);
    }

    const description = data['description'];
    return typeof description === 'string' ? description : '';
  }

  private getNavigationBreadcrumbs(): Array<PageLink> {
    const activeItems = this.flattenNavigationItems(this.navigationItems)
      .filter((item) => item.route)
      .filter((item) => isPageNavigationItemActive(item, this.router.url))
      .sort(
        (a, b) =>
          normalizePageNavigationUrl(a.route).length -
          normalizePageNavigationUrl(b.route).length
      );

    return activeItems
      .filter((item) => !isPageNavigationItemCurrentPage(item, this.router.url))
      .map((item) => ({
        title: this.translateKey(item.labelKey),
        path: item.route ?? '',
        isActive: false,
      }));
  }

  private flattenNavigationItems(
    items: readonly PageNavigationItem[]
  ): readonly PageNavigationItem[] {
    return items.flatMap((item) => [
      item,
      ...this.flattenNavigationItems(item.children ?? []),
    ]);
  }

  private markLastBreadcrumbActive(breadcrumbs: Array<PageLink>): Array<PageLink> {
    const normalized = breadcrumbs.map((breadcrumb) => ({ ...breadcrumb }));

    for (let i = normalized.length - 1; i >= 0; i--) {
      if (!normalized[i].isSeparator) {
        normalized[i].isActive = true;
        break;
      }
    }

    return normalized;
  }

  private translateKey(key: string): string {
    const translated = this.translate.instant(key);
    return translated || key;
  }

  // Build title with default and separator
  private buildTitle(pageTitle: string): string {
    const defaultTitle = this._defaultTitle();
    const separator = this._titleSeparator();
    if (!pageTitle || pageTitle === defaultTitle) {
      return defaultTitle;
    }
    return `${pageTitle}${separator}${defaultTitle}`;
  }

  private getDeepestRouteData(): Data {
    try {
      let route: ActivatedRouteSnapshot | null =
        this.router.routerState.snapshot.root;
      let data: Data = route.data ?? {};

      while (route.firstChild) {
        route = route.firstChild;
        data = route.data ?? data;
      }

      return data;
    } catch {
      return {};
    }
  }

  private getRouteDataBreadcrumbs(): Array<PageLink> | undefined {
    const breadcrumbs = this.getDeepestRouteData()['breadcrumbs'];
    return Array.isArray(breadcrumbs) ? breadcrumbs as Array<PageLink> : undefined;
  }
}
