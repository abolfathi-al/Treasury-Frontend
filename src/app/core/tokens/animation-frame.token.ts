import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { WINDOW } from './window.token';

export const ANIMATION_FRAME = new InjectionToken<Observable<DOMHighResTimeStamp>>(
  'AnimationFrame',
  {
    factory: (): Observable<DOMHighResTimeStamp> => {
      const { requestAnimationFrame, cancelAnimationFrame } = inject(WINDOW);
      
      const animationFrame$ = new Observable<DOMHighResTimeStamp>(subscriber => {
        let animationId: number | null = null;
        
        const callback = (timestamp: DOMHighResTimeStamp): void => {
          subscriber.next(timestamp);
          animationId = requestAnimationFrame(callback);
        };

        animationId = requestAnimationFrame(callback);

        return (): void => {
          if (animationId !== null) {
            cancelAnimationFrame(animationId);
          }
        };
      });

      return animationFrame$.pipe(share());
    }
  }
);
