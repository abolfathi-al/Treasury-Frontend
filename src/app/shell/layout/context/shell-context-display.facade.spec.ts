import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  ShellContextDisplayFacade,
  provideShellContextDisplayConfig,
} from './shell-context-display.facade';

describe('ShellContextDisplayFacade', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('hides the workspace switcher when context demo mode is disabled', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideShellContextDisplayConfig({ contextDemoMode: false }),
        ShellContextDisplayFacade,
      ],
    });

    const facade = TestBed.inject(ShellContextDisplayFacade);

    expect(facade.contextDemoModeEnabled()).toBeFalse();
    expect(facade.workspaceSwitcherVisible()).toBeFalse();
  });

  it('shows the workspace switcher when context demo mode is enabled', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideShellContextDisplayConfig({ contextDemoMode: true }),
        ShellContextDisplayFacade,
      ],
    });

    const facade = TestBed.inject(ShellContextDisplayFacade);

    expect(facade.contextDemoModeEnabled()).toBeTrue();
    expect(facade.workspaceSwitcherVisible()).toBeTrue();
  });
});
