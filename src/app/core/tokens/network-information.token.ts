import { inject, InjectionToken } from '@angular/core';
import { NAVIGATOR } from './navigator.token';

export interface NetworkInformation {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

type NavigatorWithNetworkInformation = Navigator & {
  readonly connection?: NetworkInformation;
};

export const resolveNetworkInformation = (
  navigator: Navigator
): NetworkInformation | null =>
  (navigator as NavigatorWithNetworkInformation).connection ?? null;

export const NETWORK_INFORMATION = new InjectionToken<NetworkInformation | null>(
  'NetworkInformation',
  {
    factory: (): NetworkInformation | null => {
      return resolveNetworkInformation(inject(NAVIGATOR));
    }
  }
);
