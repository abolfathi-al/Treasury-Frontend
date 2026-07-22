import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  isThemeModeValue,
  THEME_MODE_CONFIG,
  ThemeModeValue,
} from './theme-mode.model';
import { ThemeModeDomService } from './theme-mode-dom.service';
import { ThemeModeStorageService } from './theme-mode-storage.service';

export type { ThemeModeValue } from './theme-mode.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  private readonly storage = inject(ThemeModeStorageService);
  private readonly dom = inject(ThemeModeDomService);
  private readonly config = inject(THEME_MODE_CONFIG);

  private readonly _currentMode = signal<ThemeModeValue>(
    this.resolveMode(this.storage.readMode()),
  );

  readonly currentMode = computed(() => this._currentMode());

  readonly mode = new BehaviorSubject<ThemeModeValue>(this.currentMode());
  readonly menuMode = new BehaviorSubject<ThemeModeValue>(
    this.storage.readMenuMode() || this.storage.readMode(),
  );

  private isInitialized = false;

  init = (): void => {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    const selectedMenuMode = this.getInitialMenuMode();
    const resolvedMode = this.resolveMode(selectedMenuMode);

    this.persistAndApplyMode(resolvedMode, selectedMenuMode);
    this.dom.triggerInit();
  };

  getMode = (): ThemeModeValue => {
    const storedMode = this.storage.readModeOrNull();
    if (storedMode) {
      return this.resolveMode(storedMode);
    }

    const documentMode = this.dom.getDocumentMode();
    if (documentMode) {
      return this.resolveMode(documentMode);
    }

    const menuMode = this.getMenuMode();
    return menuMode ? this.resolveMode(menuMode) : this.config.mode;
  };

  getMenuMode = (): ThemeModeValue | '' => this.storage.readMenuMode();

  getSystemMode = (): ThemeModeValue => this.dom.getSystemMode();

  switchMode = (mode: ThemeModeValue): void => {
    if (!isThemeModeValue(mode)) {
      return;
    }

    const resolvedMode = this.resolveMode(mode);
    this.persistAndApplyMode(resolvedMode, mode);
  };

  updateMode = (mode: ThemeModeValue): void => {
    if (!isThemeModeValue(mode)) {
      return;
    }

    const resolvedMode = this.resolveMode(mode);
    this.mode.next(resolvedMode);
    this.storage.writeMode(resolvedMode);
    this.dom.applyThemeMode(resolvedMode);
    this._currentMode.set(resolvedMode);
  };

  updateMenuMode = (menuMode: ThemeModeValue): void => {
    if (!isThemeModeValue(menuMode)) {
      return;
    }

    this.menuMode.next(menuMode);
    this.storage.writeMenuMode(menuMode);
  };

  flipImages = (): void => {
    this.dom.flipImages(this.currentMode());
  };

  private getInitialMenuMode(): ThemeModeValue {
    const storedMenuMode = this.storage.readMenuMode();
    if (storedMenuMode) {
      return storedMenuMode;
    }

    const storedMode = this.storage.readModeOrNull();
    if (storedMode) {
      return storedMode;
    }

    const documentMode = this.dom.getDocumentMode();
    return documentMode || this.config.mode;
  }

  private resolveMode(mode: ThemeModeValue): ThemeModeValue {
    return mode === 'system' ? this.dom.getSystemMode() : mode;
  }

  private persistAndApplyMode(
    resolvedMode: ThemeModeValue,
    menuMode: ThemeModeValue,
  ): void {
    this.mode.next(resolvedMode);
    this.menuMode.next(menuMode);
    this.storage.save(resolvedMode, menuMode);
    this.dom.applyThemeMode(resolvedMode);
    this._currentMode.set(resolvedMode);
  }
}
