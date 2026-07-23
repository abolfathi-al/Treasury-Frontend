import {
  createEnvironmentInjector,
  EnvironmentInjector,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  IS_BROWSER_PLATFORM,
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@core/tokens';
import { APP_RUNTIME_CONFIG } from '@core/config/runtime.config';
import {
  legacyStorageCleanupSetup,
  shouldRemoveLegacyStorageKey,
} from './legacy-storage-cleanup.initializer';

const legacyNamespace = [100, 115]
  .map(code => String.fromCharCode(code))
  .join('');
const legacyKey = (suffix: string): string => `${legacyNamespace}_${suffix}`;
const legacyDashKey = (suffix: string): string => `${legacyNamespace}-${suffix}`;
const legacyDataKey = (suffix: string): string =>
  ['data', legacyNamespace, suffix].join('-');

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('legacyStorageCleanupSetup', () => {
  let localStorageRef: MemoryStorage;
  let sessionStorageRef: MemoryStorage;
  const retiredAuthStorageKey = 'velora-enterprise-0.1.2-velora_auth';
  const runtimeConfig = {
    appVersion: 'velora-enterprise-0.1.2',
    authStorageKey: 'velora_auth',
    apiUrl: '',
  };

  beforeEach(() => {
    localStorageRef = new MemoryStorage();
    sessionStorageRef = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('identifies legacy storage keys without matching Velora keys', () => {
    expect(shouldRemoveLegacyStorageKey(legacyKey('language'))).toBeTrue();
    expect(shouldRemoveLegacyStorageKey(legacyDashKey('scroll-position'))).toBeTrue();
    expect(shouldRemoveLegacyStorageKey(legacyDataKey('panel'))).toBeTrue();
    expect(
      shouldRemoveLegacyStorageKey(
        retiredAuthStorageKey,
        retiredAuthStorageKey,
      ),
    ).toBeTrue();
    expect(shouldRemoveLegacyStorageKey('velora_language')).toBeFalse();
    expect(shouldRemoveLegacyStorageKey('velora_theme_mode_value')).toBeFalse();
    expect(
      shouldRemoveLegacyStorageKey(
        'velora-enterprise-0.1.2-layout',
        retiredAuthStorageKey,
      ),
    ).toBeFalse();
  });

  it('removes legacy-prefixed keys from local and session storage', async () => {
    localStorageRef.setItem(legacyKey('language'), 'fa');
    localStorageRef.setItem(legacyKey('theme_mode_value'), 'dark');
    localStorageRef.setItem('velora_language', 'en');
    localStorageRef.setItem(retiredAuthStorageKey, 'retired-local-session');
    localStorageRef.setItem('velora-enterprise-0.1.2-layout', 'sidebar');
    sessionStorageRef.setItem(legacyDashKey('login-token'), 'legacy');
    sessionStorageRef.setItem(retiredAuthStorageKey, 'retired-session');
    sessionStorageRef.setItem('velora_theme_mode_value', 'dark');

    const childInjector = createEnvironmentInjector(
      [
        { provide: IS_BROWSER_PLATFORM, useValue: true },
        { provide: LOCAL_STORAGE, useValue: localStorageRef },
        { provide: SESSION_STORAGE, useValue: sessionStorageRef },
        { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig },
      ],
      TestBed.inject(EnvironmentInjector)
    );

    await runInInjectionContext(childInjector, () =>
      legacyStorageCleanupSetup()
    );

    expect(localStorageRef.getItem(legacyKey('language'))).toBeNull();
    expect(localStorageRef.getItem(legacyKey('theme_mode_value'))).toBeNull();
    expect(localStorageRef.getItem('velora_language')).toBe('en');
    expect(localStorageRef.getItem(retiredAuthStorageKey)).toBeNull();
    expect(localStorageRef.getItem('velora-enterprise-0.1.2-layout')).toBe(
      'sidebar',
    );
    expect(sessionStorageRef.getItem(legacyDashKey('login-token'))).toBeNull();
    expect(sessionStorageRef.getItem(retiredAuthStorageKey)).toBeNull();
    expect(sessionStorageRef.getItem('velora_theme_mode_value')).toBe('dark');
  });

  it('does not access storage outside the browser runtime', async () => {
    localStorageRef.setItem(legacyKey('language'), 'fa');

    const childInjector = createEnvironmentInjector(
      [
        { provide: IS_BROWSER_PLATFORM, useValue: false },
        { provide: LOCAL_STORAGE, useValue: localStorageRef },
        { provide: SESSION_STORAGE, useValue: sessionStorageRef },
        { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig },
      ],
      TestBed.inject(EnvironmentInjector)
    );

    await runInInjectionContext(childInjector, () =>
      legacyStorageCleanupSetup()
    );

    expect(localStorageRef.getItem(legacyKey('language'))).toBe('fa');
  });
});
