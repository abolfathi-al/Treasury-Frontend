import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { APP_DEFAULT_LAYOUT_TYPE } from '@core/config/config';
import {
  APP_RUNTIME_CONFIG,
  AppRuntimeConfig,
} from '@core/config/runtime.config';
import { LOCAL_STORAGE } from '@core/tokens';
import { LoggerService } from './logger.service';
import { LayoutService } from './layout.service';

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

describe('LayoutService', () => {
  let storage: MemoryStorage;
  let logger: jasmine.SpyObj<LoggerService>;

  const runtimeConfig: AppRuntimeConfig = {
    appVersion: 'layout-spec-1.0.0',
    authStorageKey: 'auth',
    apiUrl: '',
  };
  const baseLayoutTypeKey = `${runtimeConfig.appVersion}-baseLayoutType`;
  const defaultLayoutConfigKey = `dark-sidebar-${runtimeConfig.appVersion}-layoutConfig`;

  beforeEach(() => {
    storage = new MemoryStorage();
    logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LayoutService,
        { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig },
        { provide: LOCAL_STORAGE, useValue: storage },
        { provide: LoggerService, useValue: logger },
        {
          provide: ActivatedRoute,
          useValue: {
            firstChild: {
              snapshot: {
                data: {},
              },
            },
          },
        },
      ],
    });
  });

  it('seeds default layout storage on initial load', () => {
    TestBed.inject(LayoutService);

    expect(storage.getItem(baseLayoutTypeKey)).toBe('dark-sidebar');
    const storedConfig = storage.getItem(defaultLayoutConfigKey);
    expect(storedConfig).toBeTruthy();
    expect(JSON.parse(storedConfig ?? '{}').app.toolbar.layout).toBe('classic');
  });

  it('uses an alternate project default on a clean start', () => {
    TestBed.overrideProvider(APP_DEFAULT_LAYOUT_TYPE, {
      useValue: 'light-header',
    });

    TestBed.inject(LayoutService);

    expect(storage.getItem(baseLayoutTypeKey)).toBe('light-header');
    expect(
      storage.getItem(`light-header-${runtimeConfig.appVersion}-layoutConfig`)
    ).toBeTruthy();
  });

  it('uses an alternate runtime namespace for layout storage', () => {
    const alternateVersion = 'future-dashboard-2.0.0';
    TestBed.overrideProvider(APP_RUNTIME_CONFIG, {
      useValue: { ...runtimeConfig, appVersion: alternateVersion },
    });

    TestBed.inject(LayoutService);

    expect(storage.getItem(`${alternateVersion}-baseLayoutType`)).toBe(
      'dark-sidebar',
    );
    expect(
      storage.getItem(`dark-sidebar-${alternateVersion}-layoutConfig`),
    ).toBeTruthy();
  });

  it('does not overwrite an existing user layout config during startup', () => {
    const existingConfig = {
      app: {
        toolbar: {
          layout: 'reports',
        },
      },
    };
    storage.setItem(baseLayoutTypeKey, 'dark-sidebar');
    storage.setItem(defaultLayoutConfigKey, JSON.stringify(existingConfig));

    TestBed.inject(LayoutService);

    expect(storage.getItem(baseLayoutTypeKey)).toBe('dark-sidebar');
    expect(storage.getItem(defaultLayoutConfigKey)).toBe(
      JSON.stringify(existingConfig)
    );
  });
});
