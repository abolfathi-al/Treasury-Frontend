import {
  createEnvironmentInjector,
  EnvironmentInjector,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { LANGUAGE_SERVICE, LanguageServicePort } from '@core/i18n';
import { createRtlSignals } from './rtl.util';

describe('createRtlSignals', () => {
  let direction: BehaviorSubject<'ltr' | 'rtl'>;
  let languageService: LanguageServicePort & {
    getLanguageDirectionChanges: () => ReturnType<typeof direction.asObservable>;
  };

  beforeEach(() => {
    direction = new BehaviorSubject<'ltr' | 'rtl'>('ltr');
    languageService = {
      getSelectedLanguage: () => 'en',
      getLanguageDirection: () => direction.value,
      getLanguageDirectionChanges: () => direction.asObservable(),
      isLanguageRTL: () => direction.value === 'rtl',
      setLanguage: () => true,
      loadRuntimeTranslations: () => Promise.resolve(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: LANGUAGE_SERVICE, useValue: languageService },
      ],
    });
  });

  it('derives RTL arrow signals from the core language service port', () => {
    const childInjector = createEnvironmentInjector(
      [],
      TestBed.inject(EnvironmentInjector),
    );

    const rtlSignals = runInInjectionContext(childInjector, () =>
      createRtlSignals(),
    );

    expect(rtlSignals.direction()).toBe('ltr');
    expect(rtlSignals.arrowIcon()).toBe('arrow-right');

    direction.next('rtl');

    expect(rtlSignals.direction()).toBe('rtl');
    expect(rtlSignals.prevArrowIcon()).toBe('left');
    expect(rtlSignals.nextArrowIcon()).toBe('right');
    expect(rtlSignals.arrowIcon()).toBe('arrow-left');
    expect(rtlSignals.textDirection()).toBe('rtl');
  });
});
