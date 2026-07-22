export type ThemeModeValue = 'light' | 'dark' | 'system';

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

export const THEME_MODE_DEFAULTS = {
  MODE: 'light' as ThemeModeValue,
  INITIALIZER_MODE: 'system' as ThemeModeValue,
} as const;

export function isThemeModeValue(value: unknown): value is ThemeModeValue {
  return value === 'light' || value === 'dark' || value === 'system';
}
