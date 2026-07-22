import { DOCUMENT } from '@angular/common';
import {
  createEnvironmentInjector,
  EnvironmentInjector,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LANGUAGE_SERVICE, LanguageServicePort } from '@core/i18n';
import { LoggerService } from '@core/services/logger.service';
import { IS_BROWSER_PLATFORM } from '@core/tokens';
import { languageDirectionSetup } from './language.initializer';

describe('languageDirectionSetup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('uses the core language service contract to apply document direction', async () => {
    const documentRef = document.implementation.createHTMLDocument('language');
    const languageService: LanguageServicePort = {
      getSelectedLanguage: () => 'fa',
      getLanguageDirection: () => 'rtl',
      getLanguageDirectionChanges: () => of('rtl'),
      isLanguageRTL: () => true,
      setLanguage: () => true,
      loadRuntimeTranslations: () => Promise.resolve(),
    };
    const logger = jasmine.createSpyObj<LoggerService>('LoggerService', [
      'warn',
      'error',
    ]);
    const childInjector = createEnvironmentInjector(
      [
        { provide: LANGUAGE_SERVICE, useValue: languageService },
        { provide: DOCUMENT, useValue: documentRef },
        { provide: LoggerService, useValue: logger },
        { provide: IS_BROWSER_PLATFORM, useValue: false },
      ],
      TestBed.inject(EnvironmentInjector)
    );

    await runInInjectionContext(childInjector, () => languageDirectionSetup());

    expect(documentRef.documentElement.getAttribute('lang')).toBe('fa');
    expect(documentRef.documentElement.getAttribute('dir')).toBe('rtl');
    expect(documentRef.documentElement.getAttribute('direction')).toBe('rtl');
  });
});
