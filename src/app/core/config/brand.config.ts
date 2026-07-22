import { InjectionToken } from '@angular/core';

export interface AppBrandConfig {
  readonly name: string;
  readonly defaultTitle: string;
  readonly titleSeparator: string;
  readonly metaDescription: string;
  readonly metaKeywords: string;
  readonly canonicalUrl: string;
}

export const DEFAULT_APP_BRAND: AppBrandConfig = {
  name: 'Enterprise Dashboard',
  defaultTitle: 'Enterprise Dashboard',
  titleSeparator: ' - ',
  metaDescription: 'Reusable enterprise dashboard shell.',
  metaKeywords: 'enterprise dashboard',
  canonicalUrl: '/',
};

export const APP_BRAND = new InjectionToken<AppBrandConfig>('APP_BRAND', {
  providedIn: 'root',
  factory: () => DEFAULT_APP_BRAND,
});
