import { DOCUMENT } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE, WINDOW } from '@core/tokens';

import { THEME_MODE_CONFIG } from './theme-mode.model';
import { ThemeModeService } from './theme-mode.service';

const MODE_KEY = 'velora_theme_mode_value';
const MENU_MODE_KEY = 'velora_theme_mode_menu';
const THEME_ATTR = 'data-bs-theme';
const TEST_THEME_MODE = {
  mode: 'dark',
  initializerMode: 'light',
} as const;

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

describe('ThemeModeService', () => {
  let service: ThemeModeService;
  let storage: MemoryStorage;
  let documentRef: Document;
  let testHost: HTMLElement;
  let prefersDark = false;

  beforeEach(() => {
    storage = new MemoryStorage();
    prefersDark = false;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ThemeModeService,
        { provide: THEME_MODE_CONFIG, useValue: TEST_THEME_MODE },
        { provide: LOCAL_STORAGE, useValue: storage },
        {
          provide: WINDOW,
          useValue: {
            matchMedia: () => ({ matches: prefersDark }),
            setTimeout: window.setTimeout.bind(window),
          },
        },
      ],
    });

    service = TestBed.inject(ThemeModeService);
    documentRef = TestBed.inject(DOCUMENT);
    documentRef.documentElement.removeAttribute(THEME_ATTR);
    testHost = documentRef.createElement('div');
    documentRef.body.appendChild(testHost);
  });

  afterEach(() => {
    testHost.remove();
  });

  it('uses the injected project default without persisted state', () => {
    expect(service.getMode()).toBe('dark');
    expect(service.mode.value).toBe('dark');
  });

  it('uses persisted menu mode instead of stale active menu DOM state', () => {
    storage.setItem(MODE_KEY, 'dark');
    storage.setItem(MENU_MODE_KEY, 'dark');
    testHost.innerHTML = `
      <div data-velora-element="theme-mode-menu">
        <button class="active" data-velora-element="mode" data-velora-value="light"></button>
      </div>
    `;

    service.init();

    expect(service.getMenuMode()).toBe('dark');
    expect(service.menuMode.value).toBe('dark');
    expect(documentRef.documentElement.getAttribute(THEME_ATTR)).toBe('dark');
  });

  it('stores system preference separately from the resolved document theme', () => {
    prefersDark = true;

    service.init();
    service.switchMode('system');

    expect(service.mode.value).toBe('dark');
    expect(service.menuMode.value).toBe('system');
    expect(storage.getItem(MODE_KEY)).toBe('dark');
    expect(storage.getItem(MENU_MODE_KEY)).toBe('system');
    expect(documentRef.documentElement.getAttribute(THEME_ATTR)).toBe('dark');
  });
});
