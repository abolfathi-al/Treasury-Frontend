import { DOCUMENT, inject, Injectable } from '@angular/core';
import { WINDOW } from '@core/tokens';
import { DomUtil } from '@utils/dom.util';

import {
  isThemeModeValue,
  THEME_MODE_ATTRIBUTES,
  THEME_MODE_IMAGE_ATTRIBUTES,
  ThemeModeValue,
} from './theme-mode.model';

const THEME_MODE_INIT_EVENT = 'ds.thememode.init';
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const SWITCHING_ATTRIBUTE_TIMEOUT_MS = 300;

@Injectable({
  providedIn: 'root',
})
export class ThemeModeDomService {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly window = inject(WINDOW);

  getDocumentMode(): ThemeModeValue | '' {
    const mode = this.document.documentElement.getAttribute(
      THEME_MODE_ATTRIBUTES.THEME,
    );

    return isThemeModeValue(mode) ? mode : '';
  }

  getSystemMode(): ThemeModeValue {
    return this.window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
  }

  setDocumentTheme(mode: ThemeModeValue): void {
    this.document.documentElement.setAttribute(THEME_MODE_ATTRIBUTES.THEME, mode);
  }

  applyThemeMode(mode: ThemeModeValue): void {
    const documentElement = this.document.documentElement;

    documentElement.setAttribute(THEME_MODE_ATTRIBUTES.SWITCHING, 'true');
    this.setDocumentTheme(mode);
    this.flipImages(mode);

    this.window.setTimeout(() => {
      documentElement.removeAttribute(THEME_MODE_ATTRIBUTES.SWITCHING);
    }, SWITCHING_ATTRIBUTE_TIMEOUT_MS);
  }

  triggerInit(): void {
    DomUtil.trigger(this.document.documentElement, THEME_MODE_INIT_EVENT);
  }

  flipImages(mode: ThemeModeValue): void {
    const selector = `[${THEME_MODE_IMAGE_ATTRIBUTES.IMG_DARK}], [${THEME_MODE_IMAGE_ATTRIBUTES.IMG_LIGHT}]`;
    const items = this.document.querySelectorAll<HTMLElement>(selector);

    items.forEach((item) => {
      if (mode === 'dark') {
        this.swapImageToDark(item);
      } else if (mode === 'light') {
        this.swapImageToLight(item);
      }
    });
  }

  private swapImageToDark(item: HTMLElement): void {
    if (!item.hasAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_DARK)) {
      return;
    }

    const darkSrc =
      item.getAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_DARK) ?? '';
    const isImg = item.tagName === 'IMG';

    if (isImg) {
      const currentSrc =
        item.getAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_LIGHT) ?? '';
      item.setAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_LIGHT, currentSrc);
      item.setAttribute('src', darkSrc);
      return;
    }

    item.style.backgroundImage = `url('${darkSrc}')`;
  }

  private swapImageToLight(item: HTMLElement): void {
    if (!item.hasAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_LIGHT)) {
      return;
    }

    const lightSrc =
      item.getAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_LIGHT) ?? '';
    const isImg = item.tagName === 'IMG';

    if (isImg) {
      const currentSrc =
        item.getAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_DARK) ?? '';
      item.setAttribute(THEME_MODE_IMAGE_ATTRIBUTES.IMG_DARK, currentSrc);
      item.setAttribute('src', lightSrc);
      return;
    }

    item.style.backgroundImage = `url('${lightSrc}')`;
  }
}
