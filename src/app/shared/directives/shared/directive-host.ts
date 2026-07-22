import {
  DestroyRef,
  DOCUMENT,
  ElementRef,
  Renderer2,
  inject,
} from '@angular/core';

import { IS_BROWSER_PLATFORM, WINDOW } from '@core/tokens';

export interface DirectiveHost {
  readonly elementRef: ElementRef<HTMLElement>;
  readonly renderer: Renderer2;
  readonly destroyRef: DestroyRef;
  readonly document: Document;
  readonly isBrowser: boolean;
  readonly window: Window | null;
}

export function useDirectiveHost(): DirectiveHost {
  const isBrowser = inject(IS_BROWSER_PLATFORM);
  return {
    elementRef: inject(ElementRef<HTMLElement>),
    renderer: inject(Renderer2),
    destroyRef: inject(DestroyRef),
    document: inject(DOCUMENT),
    isBrowser,
    window: isBrowser ? inject(WINDOW) : null,
  };
}
