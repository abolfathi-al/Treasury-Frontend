import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export interface CssApi {
  escape(ident: string): string;
  supports(property: string, value: string): boolean;
  supports(conditionText: string): boolean;
}

const fallbackCssApi: CssApi = {
  escape: (ident: string): string => ident,
  supports: (): boolean => false
};

type WindowWithCssApi = Window & { CSS?: CssApi };

export const resolveCssApi = (windowRef: Window): CssApi =>
  (windowRef as WindowWithCssApi).CSS ?? fallbackCssApi;

export const CSS = new InjectionToken<CssApi>(
  'CSS',
  {
    factory: (): CssApi => {
      return resolveCssApi(inject(WINDOW));
    }
  }
);
