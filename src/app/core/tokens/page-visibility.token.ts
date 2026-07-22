import { inject, InjectionToken, DOCUMENT } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

const VISIBILITY_EVENT = 'visibilitychange';
const HIDDEN_STATE = 'hidden';
const SHARE_REPLAY_CONFIG = { refCount: false, bufferSize: 1 };

export const PAGE_VISIBILITY = new InjectionToken<Observable<boolean>>(
  'PageVisibility',
  {
    factory: (): Observable<boolean> => {
      const documentRef = inject(DOCUMENT);

      return fromEvent(documentRef, VISIBILITY_EVENT).pipe(
        startWith(0),
        map((): boolean => documentRef.visibilityState !== HIDDEN_STATE),
        distinctUntilChanged(),
        shareReplay(SHARE_REPLAY_CONFIG)
      );
    }
  }
);
