import { inject } from '@angular/core';
import { WINDOW } from '@core/tokens';

const DB_NAME = 'velora-db';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'keyval';
const COMPLETED_MESSAGE = 'Back forward cache setup completed';

export const backForwardCacheSetup = () => {
  const window = inject(WINDOW);
  let dbPromise: Promise<IDBDatabase> | null = null;

  const openDB = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          req.result.createObjectStore(OBJECT_STORE_NAME);
        };
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
      });
    }
    return dbPromise;
  };

  const closeDB = (): void => {
    if (dbPromise) {
      dbPromise.then(db => db.close()).catch(() => {});
      dbPromise = null;
    }
  };

  window.addEventListener('pagehide', closeDB);
  window.addEventListener('pageshow', () => openDB());

  return Promise.resolve(COMPLETED_MESSAGE);
};
