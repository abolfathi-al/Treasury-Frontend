import { Injectable, inject, signal, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { APP_DEFAULT_TITLE, APP_TITLE_SEPARATOR } from '@core/config/brand.config';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly _currentTitle = signal<string>(APP_DEFAULT_TITLE);
  private readonly _defaultTitle = signal<string>(APP_DEFAULT_TITLE);
  private readonly _titleSeparator = signal<string>(APP_TITLE_SEPARATOR);

  readonly currentTitle = computed(() => this._currentTitle());
  readonly defaultTitle = computed(() => this._defaultTitle());
  readonly titleSeparator = computed(() => this._titleSeparator());

  setTitle(title: string): void {
    const fullTitle = this.buildTitle(title);
    this.title.setTitle(fullTitle);
    this._currentTitle.set(fullTitle);
  }

  setTranslatedTitle(titleKey: string, params?: Record<string, unknown>): void {
    this.translate.get(titleKey, params).subscribe(translatedTitle => {
      this.setTitle(translatedTitle);
    });
  }

  setTranslatedTitle$(titleKey: string, params?: Record<string, unknown>): Observable<string> {
    return this.translate.get(titleKey, params).pipe(
      tap(translatedTitle => this.setTitle(translatedTitle))
    );
  }

  setDynamicTitle(titleKey: string, dynamicContent: string, params?: Record<string, unknown>): void {
    this.translate.get(titleKey, params).subscribe(translatedTitle => {
      const fullTitle = `${translatedTitle} ${dynamicContent}`;
      this.setTitle(fullTitle);
    });
  }

  setBreadcrumbTitle(breadcrumbs: string[], separator: string = ' > '): void {
    const breadcrumbTitle = breadcrumbs.join(separator);
    this.setTitle(breadcrumbTitle);
  }

  async setTranslatedBreadcrumbTitle(breadcrumbKeys: string[], separator: string = ' > ', params?: Record<string, unknown>): Promise<void> {
    const translationPromises = breadcrumbKeys.map(key => 
      this.translate.get(key, params).toPromise()
    );

    const translatedBreadcrumbs = await Promise.all(translationPromises);
    const breadcrumbTitle = translatedBreadcrumbs.join(separator);
    this.setTitle(breadcrumbTitle);
  }

  getCurrentTitle(): string {
    return this.title.getTitle();
  }

  resetToDefault(): void {
    const defaultTitle = this._defaultTitle();
    this.title.setTitle(defaultTitle);
    this._currentTitle.set(defaultTitle);
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

  private buildTitle(pageTitle: string): string {
    const defaultTitle = this._defaultTitle();
    const separator = this._titleSeparator();
    
    if (!pageTitle || pageTitle === defaultTitle) {
      return defaultTitle;
    }

    return `${pageTitle}${separator}${defaultTitle}`;
  }
}
