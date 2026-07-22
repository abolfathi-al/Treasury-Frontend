import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  Provider,
  signal,
} from '@angular/core';
import { environment } from 'src/environments/environment';

export interface ShellContextDisplayConfig {
  readonly contextDemoMode: boolean;
}

export const SHELL_CONTEXT_DISPLAY_CONFIG =
  new InjectionToken<ShellContextDisplayConfig>(
    'SHELL_CONTEXT_DISPLAY_CONFIG',
    {
      providedIn: 'root',
      factory: () => ({
        contextDemoMode: environment.contextDemoMode === true,
      }),
    },
  );

export function provideShellContextDisplayConfig(
  config: ShellContextDisplayConfig,
): Provider {
  return {
    provide: SHELL_CONTEXT_DISPLAY_CONFIG,
    useValue: config,
  };
}

@Injectable({ providedIn: 'root' })
export class ShellContextDisplayFacade {
  private readonly config = signal(inject(SHELL_CONTEXT_DISPLAY_CONFIG));

  readonly contextDemoModeEnabled = computed(
    () => this.config().contextDemoMode,
  );
  readonly workspaceSwitcherVisible = computed(() =>
    this.contextDemoModeEnabled(),
  );
}
