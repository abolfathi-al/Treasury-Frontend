import { inject, InjectionToken, DOCUMENT } from '@angular/core';

const WINDOW_ERROR_MESSAGE = 'Window is not available in this environment';

export const WINDOW = new InjectionToken<Window>(
  'Window',
  {
    factory: (): Window => {
      const { defaultView } = inject(DOCUMENT);

      if (!defaultView) {
        throw new Error(WINDOW_ERROR_MESSAGE);
      }

      return defaultView;
    }
  }
);
