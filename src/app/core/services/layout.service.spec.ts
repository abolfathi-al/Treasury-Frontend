import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { LOCAL_STORAGE } from '@core/tokens';
import { environment } from '@environments/environment';
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

  const baseLayoutTypeKey = `${environment.appVersion}-baseLayoutType`;
  const defaultLayoutConfigKey = `dark-sidebar-${environment.appVersion}-layoutConfig`;

  beforeEach(() => {
    storage = new MemoryStorage();
    logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LayoutService,
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
