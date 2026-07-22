import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: Date | string;
  'max-age'?: number;
  secure?: boolean;
  samesite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

const DEFAULT_COOKIE_OPTIONS: Required<CookieOptions> = {
  path: '/',
  domain: '',
  expires: '',
  'max-age': 0,
  secure: false,
  samesite: 'lax',
  httpOnly: false
};

const COOKIE_NAME_REGEX = /([\.$?*|{}\(\)\[\]\\\/\+^])/g;
const COOKIE_VALUE_REGEX = /(?:^|; )([^=]+)=([^;]*)/;

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly document = inject<Document>(DOCUMENT);

  get(name: string): string | undefined {
    const escapedName = name.replace(COOKIE_NAME_REGEX, '\\$1');
    const regex = new RegExp(`(?:^|; )${escapedName}=([^;]*)`);
    const matches = this.document.cookie.match(regex);
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  set(name: string, value: string | number | boolean, options: CookieOptions = {}): void {
    const cookieOptions: Required<CookieOptions> = {
      ...DEFAULT_COOKIE_OPTIONS,
      ...options
    };

    if (cookieOptions.expires instanceof Date) {
      cookieOptions.expires = cookieOptions.expires.toUTCString();
    }

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`;

    for (const [key, val] of Object.entries(cookieOptions)) {
      if (val !== '' && val !== 0 && val !== false) {
        cookieString += `; ${key}`;
        if (val !== true) {
          cookieString += `=${val}`;
        }
      }
    }

    this.document.cookie = cookieString;
  }

  delete(name: string): void {
    this.set(name, '', { 'max-age': -1 });
  }

  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  getAllNames(): string[] {
    if (!this.document.cookie) {
      return [];
    }

    return this.document.cookie
      .split(';')
      .map(cookie => cookie.trim().split('=')[0])
      .filter(name => name.length > 0);
  }

  clearAll(): void {
    this.getAllNames().forEach(name => this.delete(name));
  }
}
