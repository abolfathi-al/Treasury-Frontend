import { InjectionToken } from '@angular/core';

export type ThemeModeValue = 'light' | 'dark' | 'system';

export type ThemeModeConfig = Readonly<{
  mode: ThemeModeValue;
  initializerMode: ThemeModeValue;
}>;

export const THEME_MODE_STORAGE_KEYS = {
  MODE: 'velora_theme_mode_value',
  MENU_MODE: 'velora_theme_mode_menu',
} as const;

export const THEME_MODE_ATTRIBUTES = {
  SWITCHING: 'data-bs-theme-mode-switching',
  THEME: 'data-bs-theme',
} as const;

export const THEME_MODE_IMAGE_ATTRIBUTES = {
  IMG_DARK: 'data-velora-img-dark',
  IMG_LIGHT: 'data-velora-img-light',
} as const;

export const DEFAULT_THEME_MODE_CONFIG: ThemeModeConfig = {
  mode: 'light',
  initializerMode: 'system',
};

export const THEME_MODE_CONFIG = new InjectionToken<ThemeModeConfig>(
  'THEME_MODE_CONFIG',
  {
    providedIn: 'root',
    factory: () => DEFAULT_THEME_MODE_CONFIG,
  },
);

export function isThemeModeValue(value: unknown): value is ThemeModeValue {
  return value === 'light' || value === 'dark' || value === 'system';
}
