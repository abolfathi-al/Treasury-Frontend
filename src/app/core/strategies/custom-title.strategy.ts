import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take, switchMap } from 'rxjs/operators';

import { APP_BRAND } from '@core/config/brand.config';

const ROUTE_DATA_KEYS = {
  TITLE: 'title',
  TITLE_KEY: 'titleKey',
  TITLE_PARAMS: 'titleParams'
} as const;

@Injectable({
  providedIn: 'root'
})
export class CustomTitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private readonly brand = inject(APP_BRAND);

  updateTitle(routerState: RouterStateSnapshot): void {
    this.buildTitleFromRoute(routerState.root);
  }

  private buildTitleFromRoute(route: ActivatedRouteSnapshot): void {
    const currentRoute = this.findDeepestChildRoute(route);
    const routeData = currentRoute.data ?? {};
    
    const title = routeData[ROUTE_DATA_KEYS.TITLE];
    const titleKey = routeData[ROUTE_DATA_KEYS.TITLE_KEY];
    const titleParams = routeData[ROUTE_DATA_KEYS.TITLE_PARAMS] ?? {};

    if (titleKey) {
      this.handleTranslatedTitle(titleKey, titleParams);
      return;
    }

    if (title) {
      this.title.setTitle(this.buildTitle(title));
      return;
    }

    this.title.setTitle(this.brand.defaultTitle);
  }

  private findDeepestChildRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let currentRoute = route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute;
  }

  private handleTranslatedTitle(titleKey: string, titleParams: Record<string, unknown>): void {
    this.translate.onLangChange.pipe(
      take(1),
      switchMap(() => this.translate.get(titleKey, titleParams))
    ).subscribe(translatedTitle => {
      this.updateTitleIfValid(translatedTitle, titleKey);
    });
    
    this.translate.get(titleKey, titleParams).subscribe(translatedTitle => {
      this.updateTitleIfValid(translatedTitle, titleKey);
    });
  }

  private updateTitleIfValid(translatedTitle: string, titleKey: string): void {
    if (translatedTitle && translatedTitle !== titleKey) {
      this.title.setTitle(this.buildTitle(translatedTitle));
    } else {
      this.title.setTitle(this.buildTitle(titleKey));
    }
  }

  private buildTitle(pageTitle: string): string {
    if (!pageTitle || pageTitle === this.brand.defaultTitle) {
      return this.brand.defaultTitle;
    }

    return `${pageTitle}${this.brand.titleSeparator}${this.brand.defaultTitle}`;
  }

  setTitle(title: string): void {
    this.title.setTitle(this.buildTitle(title));
  }

  setTranslatedTitle(titleKey: string, params?: Record<string, unknown>): void {
    this.translate.get(titleKey, params).subscribe(translatedTitle => {
      this.setTitle(translatedTitle);
    });
  }

  getCurrentTitle(): string {
    return this.title.getTitle();
  }

  resetToDefault(): void {
    this.title.setTitle(this.brand.defaultTitle);
  }
}
