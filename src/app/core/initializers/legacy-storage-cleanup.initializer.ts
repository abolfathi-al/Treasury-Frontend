import { inject } from '@angular/core';
import {
  IS_BROWSER_PLATFORM,
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@core/tokens';

const LEGACY_NAMESPACE_CHAR_CODES = [100, 115] as const;
const LEGACY_STORAGE_KEY_SUFFIXES = [
  'language',
  'theme_mode_value',
  'theme_mode_menu',
  'scroll_state',
  'anti_autocomplete_',
  'login_stepper',
  'login_password_reset_form',
  'password_reset_submit',
  'login_signup_form',
  'login_toc_agree',
  'sign_up_submit',
] as const;

const SKIPPED_MESSAGE = 'Legacy storage cleanup skipped (SSR)';
const COMPLETED_MESSAGE = 'Legacy storage cleanup completed';

export const legacyStorageCleanupSetup = () => {
  const isBrowser = inject(IS_BROWSER_PLATFORM);

  if (!isBrowser) {
    return Promise.resolve(SKIPPED_MESSAGE);
  }

  cleanupLegacyStorage(inject(LOCAL_STORAGE, { optional: true }));
  cleanupLegacyStorage(inject(SESSION_STORAGE, { optional: true }));

  return Promise.resolve(COMPLETED_MESSAGE);
};

export function shouldRemoveLegacyStorageKey(key: string): boolean {
  return (
    legacyStorageKeys().includes(key) ||
    legacyStorageKeyPrefixes().some(prefix => key.startsWith(prefix))
  );
}

function legacyNamespace(): string {
  return LEGACY_NAMESPACE_CHAR_CODES.map(code =>
    String.fromCharCode(code)
  ).join('');
}

function legacyStorageKeyPrefixes(): string[] {
  const namespace = legacyNamespace();
  return [
    `${namespace}_`,
    `${namespace}-`,
    ['data', namespace].join('-'),
  ];
}

function legacyStorageKeys(): string[] {
  const namespace = legacyNamespace();
  return LEGACY_STORAGE_KEY_SUFFIXES.map(suffix => `${namespace}_${suffix}`);
}

function cleanupLegacyStorage(storage: Storage | null): void {
  if (!storage) {
    return;
  }

  try {
    const keys = Array.from({ length: storage.length }, (_, index) =>
      storage.key(index)
    ).filter((key): key is string => Boolean(key));

    for (const key of keys) {
      if (shouldRemoveLegacyStorageKey(key)) {
        storage.removeItem(key);
      }
    }
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}
