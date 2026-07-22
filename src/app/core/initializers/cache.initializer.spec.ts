import {
  createEnvironmentInjector,
  EnvironmentInjector,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/tokens';
import { backForwardCacheSetup } from './cache.initializer';

describe('backForwardCacheSetup', () => {
  it('uses the injected window IndexedDB and registers bfcache listeners', async () => {
    const listeners = new Map<string, EventListener>();
    const objectStore = jasmine.createSpy('createObjectStore');
    const request = {
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null,
      error: null,
      result: {
        close: jasmine.createSpy('close'),
        createObjectStore: objectStore,
      },
    } as unknown as IDBOpenDBRequest;
    const indexedDBRef = {
      open: jasmine.createSpy('open').and.returnValue(request),
    } as unknown as IDBFactory;
    const windowRef = {
      indexedDB: indexedDBRef,
      addEventListener: jasmine
        .createSpy('addEventListener')
        .and.callFake((eventName: string, listener: EventListener) => {
          listeners.set(eventName, listener);
        }),
    } as unknown as Window;

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    const childInjector = createEnvironmentInjector(
      [{ provide: WINDOW, useValue: windowRef }],
      TestBed.inject(EnvironmentInjector)
    );

    await runInInjectionContext(childInjector, () => backForwardCacheSetup());

    expect(windowRef.addEventListener).toHaveBeenCalledWith(
      'pagehide',
      jasmine.any(Function)
    );
    expect(windowRef.addEventListener).toHaveBeenCalledWith(
      'pageshow',
      jasmine.any(Function)
    );

    listeners.get('pageshow')?.(new Event('pageshow'));

    expect(indexedDBRef.open).toHaveBeenCalledWith('velora-db', 1);
  });
});
