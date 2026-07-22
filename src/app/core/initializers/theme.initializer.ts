import { inject } from '@angular/core';
import { ThemeModeDomService } from '@core/services/theme-mode-dom.service';
import {
  THEME_MODE_CONFIG,
  ThemeModeValue,
} from '@core/services/theme-mode.model';
import { ThemeModeStorageService } from '@core/services/theme-mode-storage.service';
import { IS_BROWSER_PLATFORM } from '@core/tokens';

const SKIPPED_MESSAGE = 'Theme mode setup skipped (SSR)';
const COMPLETED_MESSAGE = 'Theme mode setup completed';

export const themeModeSetup = () => {
  const isBrowser = inject(IS_BROWSER_PLATFORM);

  if (!isBrowser) {
    return Promise.resolve(SKIPPED_MESSAGE);
  }

  const storage = inject(ThemeModeStorageService);
  const dom = inject(ThemeModeDomService);
  const config = inject(THEME_MODE_CONFIG);
  const storedMode = storage.readModeOrNull();
  const storedMenuMode = storage.readMenuMode();
  const selectedMode =
    storedMode ?? (storedMenuMode || config.initializerMode);
  const resolvedMode = resolveInitializerMode(selectedMode, dom);

  dom.setDocumentTheme(resolvedMode);

  return Promise.resolve(COMPLETED_MESSAGE);
};

function resolveInitializerMode(
  mode: ThemeModeValue,
  dom: ThemeModeDomService,
): ThemeModeValue {
  return mode === 'system' ? dom.getSystemMode() : mode;
}
