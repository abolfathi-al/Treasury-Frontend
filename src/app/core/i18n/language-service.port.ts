import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type LanguageDirection = 'ltr' | 'rtl';

export type TranslationDataValue =
  | string
  | TranslationDataValue[]
  | TranslationData
  | undefined
  | null;

export interface TranslationData {
  [key: string]: TranslationDataValue;
}

export interface Locale {
  lang: string;
  data: TranslationData;
}

export interface LanguageServicePort {
  getSelectedLanguage(): string;
  getLanguageDirection(lang?: string): LanguageDirection;
  getLanguageDirectionChanges(): Observable<LanguageDirection>;
  isLanguageRTL(lang?: string): boolean;
  setLanguage(lang: string, reload?: boolean): boolean;
  loadRuntimeTranslations(): Promise<void>;
}

export const LANGUAGE_SERVICE = new InjectionToken<LanguageServicePort>(
  'LANGUAGE_SERVICE'
);
