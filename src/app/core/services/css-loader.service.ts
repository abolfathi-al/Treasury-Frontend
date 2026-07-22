import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CssLoaderService {
  private readonly logger = inject(LoggerService);  
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  private readonly loadedStyles = new Set<string>();
  private readonly loadingPromises = new Map<string, Promise<void>>();

  loadCss(href: string, id?: string): Promise<void> {
    if (!this.isBrowser || !this.isValidHref(href)) {
      return Promise.resolve();
    }

    const styleId = id ?? href;
    
    const existingPromise = this.loadingPromises.get(styleId);
    if (existingPromise) {
      return existingPromise;
    }

    if (this.loadedStyles.has(styleId)) {
      return Promise.resolve();
    }

    const existingLink = this.findExistingCssLink(href);
    if (existingLink) {
      this.loadedStyles.add(styleId);
      return Promise.resolve();
    }

    try {
      const actualHref = this.findHashedCssFile(href) ?? href;
      const normalizedHref = this.normalizeHref(actualHref);
      const loadPromise = this.createLoadPromise(normalizedHref, styleId, href, actualHref);
      
      this.loadingPromises.set(styleId, loadPromise);
      return loadPromise;
    } catch (error) {
      this.logger.error('Error loading CSS', 'CssLoaderService', { href, error });
      return Promise.resolve();
    }
  }

  private isValidHref(href: string): boolean {
    if (!href || typeof href !== 'string') {
      this.logger.warn('Invalid href provided', 'CssLoaderService', { href });
      return false;
    }
    return true;
  }

  isLoaded(href: string, id?: string): boolean {
    if (!this.isBrowser || !href || typeof href !== 'string') {
      return false;
    }

    const styleId = id ?? href;
    return this.loadedStyles.has(styleId) || 
           this.loadingPromises.has(styleId) ||
           !!this.findExistingCssLink(href);
  }

  async loadMultipleCss(hrefs: string[]): Promise<void> {
    if (!Array.isArray(hrefs) || hrefs.length === 0) {
      return;
    }

    try {
      await Promise.all(hrefs.map(href => this.loadCss(href)));
    } catch (error) {
      this.logger.error('Error loading multiple CSS files', 'CssLoaderService', { error });
    }
  }

  private createLoadPromise(
    normalizedHref: string,
    styleId: string,
    originalHref: string,
    actualHref: string
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        const link = this.createLinkElement(normalizedHref, styleId);
        
        link.onload = () => {
          queueMicrotask(() => {
            this.markAsLoaded(styleId);
            resolve();
          });
        };

        link.onerror = () => {
          this.handleLoadError(styleId, originalHref, actualHref, normalizedHref, resolve);
        };

        this.insertBeforeCriticalStyles(link);
      } catch (error) {
        this.logger.error('Error creating load promise', 'CssLoaderService', { error });
        this.loadingPromises.delete(styleId);
        resolve();
      }
    });
  }

  private createLinkElement(href: string, styleId: string): HTMLLinkElement {
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.type = 'text/css';
    
    if (styleId !== href) {
      link.id = styleId;
    }

    return link;
  }

  private handleLoadError(
    styleId: string,
    originalHref: string,
    actualHref: string,
    normalizedHref: string,
    resolve: () => void
  ): void {
    this.loadingPromises.delete(styleId);

    if (actualHref === originalHref && !normalizedHref.includes('.')) {
      const hashedLink = this.findHashedCssLink(originalHref);
      if (hashedLink) {
        this.loadedStyles.add(styleId);
        resolve();
        return;
      }
    }

    this.logger.warn('Failed to load CSS', 'CssLoaderService', { originalHref });
    resolve();
  }

  private markAsLoaded(styleId: string): void {
    this.loadedStyles.add(styleId);
    this.loadingPromises.delete(styleId);
  }

  private insertBeforeCriticalStyles(link: HTMLLinkElement): void {
    const head = this.document.head;
    if (!head) {
      this.logger.warn('Document head not found', 'CssLoaderService');
      return;
    }

    try {
      const stylesheetLinks = head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
      
      if (stylesheetLinks.length > 0) {
        const lastStylesheet = stylesheetLinks[stylesheetLinks.length - 1];
        head.insertBefore(link, lastStylesheet);
      } else {
        head.appendChild(link);
      }
    } catch (error) {
      this.logger.error('Error inserting CSS link', 'CssLoaderService', { error });
      head.appendChild(link);
    }
  }

  private normalizeHref(href: string): string {
    if (!href) {
      return '/';
    }

    if (href.startsWith('/') || href.startsWith('http')) {
      return href;
    }
    
    return `/${href}`;
  }

  private extractPathname(urlString: string): string {
    try {
      const url = new URL(urlString, window.location.origin);
      return url.pathname;
    } catch {
      return urlString.startsWith('/') ? urlString : `/${urlString}`;
    }
  }

  private getBaseName(bundleName: string): string {
    return bundleName.replace(/\.css$/, '');
  }

  private getHrefFromElement(link: HTMLLinkElement): string {
    return link.href ?? link.getAttribute('href') ?? '';
  }

  private getSrcFromElement(script: HTMLScriptElement): string {
    return script.src ?? script.getAttribute('src') ?? '';
  }

  private findExistingCssLink(href: string): HTMLLinkElement | null {
    if (!this.document) {
      return null;
    }

    try {
      const exactMatch = this.document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
      if (exactMatch) {
        return exactMatch;
      }

      return this.document.querySelector<HTMLLinkElement>(`link[href*="${href}"]`);
    } catch (error) {
      this.logger.warn('Error finding existing CSS link', 'CssLoaderService', { error });
      return null;
    }
  }

  private findHashedCssFile(bundleName: string): string | null {
    const baseName = this.getBaseName(bundleName);
    return this.searchLinksForBaseName(baseName) ?? this.searchScriptsForBaseName(baseName);
  }

  private findHashedCssLink(bundleName: string): HTMLLinkElement | null {
    const baseName = this.getBaseName(bundleName);
    const allLinks = this.document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
    
    for (const link of Array.from(allLinks)) {
      const href = this.getHrefFromElement(link);
      if (href && href.includes(baseName)) {
        return link;
      }
    }

    return null;
  }

  private searchLinksForBaseName(baseName: string): string | null {
    const allLinks = this.document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
    
    for (const link of Array.from(allLinks)) {
      const href = this.getHrefFromElement(link);
      if (href && href.includes(baseName)) {
        return this.extractPathname(href);
      }
    }

    return null;
  }

  private searchScriptsForBaseName(baseName: string): string | null {
    const scripts = this.document.querySelectorAll<HTMLScriptElement>('script[src]');
    
    for (const script of Array.from(scripts)) {
      const src = this.getSrcFromElement(script);
      if (src && src.includes(baseName) && src.endsWith('.css')) {
        return this.extractPathname(src);
      }
    }

    return null;
  }
}
