import { Injectable, inject, signal, computed } from '@angular/core';
import { LOCAL_STORAGE, LOCATION } from '@core/tokens';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, BehaviorSubject, map, distinctUntilChanged, shareReplay } from 'rxjs';
import { LoggerService } from '@core/services/logger.service';
import { LanguageServicePort, type Locale } from '@core/i18n';

export interface LanguageConfig {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  flag?: string;
}

const STORAGE_KEY = 'velora_language';
const RTL_LANGUAGES = ['fa', 'ar', 'he', 'ur', 'ku', 'ps', 'sd'];
const DEFAULT_LANGUAGE = 'fa';
const DEFAULT_RUNTIME_LOCALE = 'fa';
const RUNTIME_LOCALE_CODES = ['en', 'fa'] as const;
const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'fa', name: 'فارسی', direction: 'rtl', flag: '🇮🇷' },
  { code: 'en', name: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'he', name: 'עברית', direction: 'rtl', flag: '🇮🇱' },
];

type RuntimeLocaleCode = typeof RUNTIME_LOCALE_CODES[number];
type RuntimeLocaleLoader = () => Promise<Locale>;

const RUNTIME_LOCALE_LOADERS: Record<RuntimeLocaleCode, RuntimeLocaleLoader> = {
  en: () =>
    import('./locales/en')
      .then(({ veloraShellEnLocale }) => veloraShellEnLocale),
  fa: () =>
    import('./locales/fa')
      .then(({ veloraShellFaLocale }) => veloraShellFaLocale),
};

@Injectable({
  providedIn: 'root',
})
export class TranslationService implements LanguageServicePort {
  private readonly localStorage = inject<Storage>(LOCAL_STORAGE);
  private readonly location = inject<Location>(LOCATION);
  private readonly translate = inject(TranslateService);
  private readonly logger = inject(LoggerService);
  
  private readonly loadedLanguages = signal<string[]>([]);
  private readonly currentLanguage = signal<string>(DEFAULT_LANGUAGE);
  private readonly translationsReady = signal<boolean>(false);
  
  private readonly languageChange$ = new BehaviorSubject<string>(DEFAULT_LANGUAGE);
  
  readonly availableLanguages = computed(() => this.loadedLanguages().length > 0 
    ? this.loadedLanguages() 
    : SUPPORTED_LANGUAGES.map(lang => lang.code)
  );
  
  readonly isRTL = computed(() => this.getLanguageDirection() === 'rtl');
  readonly currentDirection = computed(() => this.getLanguageDirection());

  constructor() {
    this.initializeService();
  }

  private initializeService(): void {
    const supportedCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);
    this.translate.addLangs(supportedCodes);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    
    const savedLang = this.getStoredLanguage();
    if (savedLang && supportedCodes.includes(savedLang)) {
      this.currentLanguage.set(savedLang);
    } else {
      this.currentLanguage.set(DEFAULT_LANGUAGE);
      try {
        this.localStorage.setItem(STORAGE_KEY, DEFAULT_LANGUAGE);
      } catch {
        this.logger.warn('Failed to save default language to localStorage', 'TranslationService');
      }
    }
  }

  loadTranslations(...locales: Locale[]): void {
    if (locales.length === 0) return;
    
    const loadedLangs: string[] = [];
    
    locales.forEach(locale => {
      if (locale?.lang && locale?.data) {
        this.translate.setTranslation(locale.lang, locale.data, true);
        loadedLangs.push(locale.lang);
      }
    });
    
    if (loadedLangs.length > 0) {
      this.loadedLanguages.set(loadedLangs);
      this.translate.addLangs(loadedLangs);
      this.translationsReady.set(true);
      
      const currentLang = this.currentLanguage();
      if (loadedLangs.includes(currentLang)) {
        this.translate.use(currentLang);
      }
    }
  }

  async loadRuntimeTranslations(): Promise<void> {
    const selectedLocaleCode = this.resolveRuntimeLocaleCode(
      this.getSelectedLanguage()
    );
    const locale = await RUNTIME_LOCALE_LOADERS[selectedLocaleCode]();

    this.loadTranslations(
      locale,
      ...this.createSwitchableLocaleRegistrations(selectedLocaleCode)
    );
  }

  setLanguage(lang: string, reload: boolean = true): boolean {
    if (!this.isValidLanguage(lang)) {
      this.logger.warn(`Language '${lang}' is not supported`, 'TranslationService');
      return false;
    }
    
    this.translate.use(lang);
    this.currentLanguage.set(lang);
    this.languageChange$.next(lang);
    this.localStorage.setItem(STORAGE_KEY, lang);
    
    if (reload) {
      this.location.reload();
    }
    
    return true;
  }

  getSelectedLanguage(): string {
    return this.currentLanguage();
  }

  getLanguageConfig(lang?: string): LanguageConfig | undefined {
    const targetLang = lang || this.getSelectedLanguage();
    return SUPPORTED_LANGUAGES.find(config => config.code === targetLang);
  }

  getLanguageDirection(lang?: string): 'ltr' | 'rtl' {
    const targetLang = lang || this.getSelectedLanguage();
    
    if (this.translationsReady()) {
      const direction = this.translate.instant('DIRECTION');
      if (direction && direction !== 'DIRECTION') {
        return direction as 'ltr' | 'rtl';
      }
    }
    
    return RTL_LANGUAGES.includes(targetLang) ? 'rtl' : 'ltr';
  }

  getLanguageDirection$(): Observable<'ltr' | 'rtl'> {
    if (!this.translationsReady()) {
      return of(this.getLanguageDirection());
    }
    
    return this.translate.stream('DIRECTION').pipe(
      map(direction => direction === 'DIRECTION' ? this.getLanguageDirection() : direction as 'ltr' | 'rtl'),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  getLanguageDirectionChanges(): Observable<'ltr' | 'rtl'> {
    return this.getLanguageDirection$();
  }

  getTranslation(key: string): Observable<string> {
    return this.translate.stream(key).pipe(
      map(value => value || key),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  getTranslationSync(key: string): string {
    const value = this.translate.instant(key);
    return value && value !== key ? value : key;
  }

  getTranslations(keys: string[]): Observable<Record<string, string>> {
    return this.translate.stream(keys).pipe(
      map(translations => {
        const result: Record<string, string> = {};
        keys.forEach(key => {
          result[key] = translations[key] || key;
        });
        return result;
      }),
      shareReplay(1)
    );
  }

  onLanguageChange(): Observable<string> {
    return this.languageChange$.asObservable().pipe(
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  isLanguageRTL(lang?: string): boolean {
    return this.getLanguageDirection(lang) === 'rtl';
  }

  getSupportedLanguages(): LanguageConfig[] {
    return SUPPORTED_LANGUAGES.filter(lang => 
      this.availableLanguages().includes(lang.code)
    );
  }

  private getStoredLanguage(): string | null {
    try {
      return this.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private isValidLanguage(lang: string): boolean {
    return this.availableLanguages().includes(lang);
  }

  private resolveRuntimeLocaleCode(lang: string): RuntimeLocaleCode {
    return this.isRuntimeLocaleCode(lang) ? lang : DEFAULT_RUNTIME_LOCALE;
  }

  private isRuntimeLocaleCode(lang: string): lang is RuntimeLocaleCode {
    return RUNTIME_LOCALE_CODES.includes(lang as RuntimeLocaleCode);
  }

  private createSwitchableLocaleRegistrations(
    selectedLocaleCode: RuntimeLocaleCode
  ): Locale[] {
    return RUNTIME_LOCALE_CODES
      .filter((localeCode) => localeCode !== selectedLocaleCode)
      .map((localeCode) => ({
        lang: localeCode,
        data: {},
      }));
  }
}
