// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Provider } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ActiveAccessContextFacade,
  ActorContextFacade,
  AuthFacade,
  OrganizationContextFacade,
  UiCapabilityFacade,
} from '@core/state/context';
import { DemoActiveAccessContextFacade } from './demo-active-access-context.facade';
import { DemoActorContextFacade } from './demo-actor-context.facade';
import { DemoAuthFacade } from './demo-auth.facade';
import { DemoOrganizationContextFacade } from './demo-organization-context.facade';
import { DemoUiCapabilityFacade } from './demo-ui-capability.facade';

export const CONTEXT_DEMO_MODE_ENABLED =
  environment.contextDemoMode === true;

export const demoContextProviders: Provider[] =
  CONTEXT_DEMO_MODE_ENABLED
    ? [
        { provide: AuthFacade, useClass: DemoAuthFacade },
        {
          provide: OrganizationContextFacade,
          useClass: DemoOrganizationContextFacade,
        },
        {
          provide: ActiveAccessContextFacade,
          useClass: DemoActiveAccessContextFacade,
        },
        { provide: ActorContextFacade, useClass: DemoActorContextFacade },
        { provide: UiCapabilityFacade, useClass: DemoUiCapabilityFacade },
      ]
    : [];
