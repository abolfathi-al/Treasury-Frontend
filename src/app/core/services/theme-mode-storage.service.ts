import { inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@core/tokens';

import {
  isThemeModeValue,
  THEME_MODE_DEFAULTS,
  THEME_MODE_STORAGE_KEYS,
  ThemeModeValue,
} from './theme-mode.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeStorageService {
  private readonly localStorage = inject<Storage>(LOCAL_STORAGE, {
    optional: true,
  });

  readMode(): ThemeModeValue {
    return this.readModeOrNull(THEME_MODE_STORAGE_KEYS.MODE) ?? THEME_MODE_DEFAULTS.MODE;
  }

  readModeOrNull(key: string = THEME_MODE_STORAGE_KEYS.MODE): ThemeModeValue | null {
    const stored = this.localStorage?.getItem(key);

    return isThemeModeValue(stored) ? stored : null;
  }

  readMenuMode(): ThemeModeValue | '' {
    return this.readModeOrNull(THEME_MODE_STORAGE_KEYS.MENU_MODE) ?? '';
  }

  writeMode(mode: ThemeModeValue): void {
    this.localStorage?.setItem(THEME_MODE_STORAGE_KEYS.MODE, mode);
  }

  writeMenuMode(menuMode: ThemeModeValue): void {
    this.localStorage?.setItem(THEME_MODE_STORAGE_KEYS.MENU_MODE, menuMode);
  }

  save(mode: ThemeModeValue, menuMode: ThemeModeValue): void {
    this.writeMode(mode);
    this.writeMenuMode(menuMode);
  }
}
