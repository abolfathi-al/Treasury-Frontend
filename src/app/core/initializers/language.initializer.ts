import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { LANGUAGE_SERVICE } from '@core/i18n';
import { LoggerService } from '@core/services/logger.service';
import { IS_BROWSER_PLATFORM } from '@core/tokens';

type LanguageDirection = 'ltr' | 'rtl';

const THEME_CSS = {
  RTL: 'rtl-theme.css',
  LTR: 'ltr-theme.css',
  ID_PREFIX: 'theme-',
} as const;

const CONTEXT = 'LanguageInitializer';

export const languageDirectionSetup = (): Promise<string> => {
  const translationService = inject(LANGUAGE_SERVICE);
  const document = inject(DOCUMENT);
  const logger = inject(LoggerService);
  const isBrowser = inject(IS_BROWSER_PLATFORM);

  try {
    const lang = translationService.getSelectedLanguage();
    const direction = translationService.getLanguageDirection();

    applyHtmlAttributes(document, lang, direction);

    if (isBrowser) {
      manageThemeCss(document, direction, logger);
    }
  } catch (error) {
    logger.error(
      `Language direction setup failed${!isBrowser ? ' (SSR)' : ''}`,
      CONTEXT,
      { error: error instanceof Error ? error.message : String(error) }
    );
  }

  return Promise.resolve('Language direction setup completed');
};

function applyHtmlAttributes(document: Document, lang: string, direction: LanguageDirection): void {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', direction);
  html.setAttribute('direction', direction);
  html.setAttribute('style', `direction: ${direction}`);
}

function manageThemeCss(document: Document, direction: LanguageDirection, logger: LoggerService): void {
  const head = document.head ?? document.querySelector('head');
  if (!head) {
    logger.warn('Head element not found', CONTEXT);
    return;
  }

  const targetCss = direction === 'rtl' ? THEME_CSS.RTL : THEME_CSS.LTR;
  const oppositeCss = direction === 'rtl' ? THEME_CSS.LTR : THEME_CSS.RTL;
  const targetBaseName = targetCss.replace('.css', '');
  const oppositeBaseName = oppositeCss.replace('.css', '');

  const allLinks = Array.from(head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));

  removeOppositeThemeLinks(allLinks, oppositeBaseName);

  if (!hasThemeLink(allLinks, targetBaseName)) {
    addThemeLink(head, document, allLinks, targetCss, targetBaseName, direction);
  }
}

function removeOppositeThemeLinks(links: HTMLLinkElement[], baseName: string): void {
  links.forEach(link => {
    if ((link.getAttribute('href') || '').includes(baseName)) {
      link.remove();
    }
  });
}

function hasThemeLink(links: HTMLLinkElement[], baseName: string): boolean {
  return links.some(link => (link.getAttribute('href') || '').includes(baseName));
}

function addThemeLink(
  head: HTMLHeadElement,
  document: Document,
  links: HTMLLinkElement[],
  cssFile: string,
  baseName: string,
  direction: LanguageDirection
): void {
  const existingHashedLink = links.find(link => (link.getAttribute('href') || '').includes(baseName));

  if (existingHashedLink) {
    head.appendChild(existingHashedLink.cloneNode(true));
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssFile;
  link.type = 'text/css';
  link.id = `${THEME_CSS.ID_PREFIX}${direction}`;
  head.appendChild(link);
}
