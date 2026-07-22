import {
  ApplicationRef,
  createEnvironmentInjector,
  EnvironmentInjector,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SwUpdate,
  UnrecoverableStateEvent,
  VersionEvent,
} from '@angular/service-worker';
import { Subject, throwError } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { environment } from '@environments/environment';
import { swCheckForUpdate } from './service-worker.initializer';

class ApplicationRefStub {
  readonly isStable = new Subject<boolean>();
}

class SwUpdateStub {
  isEnabled = true;
  readonly versionUpdates = new Subject<VersionEvent>();
  readonly unrecoverable = new Subject<UnrecoverableStateEvent>();
  readonly checkForUpdate = jasmine
    .createSpy('checkForUpdate')
    .and.returnValue(throwError(() => new Error('network failed')));
  readonly activateUpdate = jasmine
    .createSpy('activateUpdate')
    .and.returnValue(Promise.resolve(true));
}

describe('swCheckForUpdate', () => {
  let originalProduction: boolean;
  let appRef: ApplicationRefStub;
  let logger: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    originalProduction = environment.production;
    environment.production = true;
    logger = jasmine.createSpyObj<LoggerService>('LoggerService', [
      'info',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
      ],
    });
  });

  afterEach(() => {
    environment.production = originalProduction;
  });

  it('normalizes update-check failures without breaking the update stream', async () => {
    appRef = new ApplicationRefStub();
    const childInjector = createEnvironmentInjector(
      [
        { provide: ApplicationRef, useValue: appRef },
        { provide: SwUpdate, useClass: SwUpdateStub },
        { provide: LoggerService, useValue: logger },
        {
          provide: WINDOW,
          useValue: {
            location: { reload: jasmine.createSpy('reload') },
          },
        },
      ],
      TestBed.inject(EnvironmentInjector)
    );

    await runInInjectionContext(childInjector, () => swCheckForUpdate());

    expect(() => appRef.isStable.next(true)).not.toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to check for updates',
      'ServiceWorkerInitializer',
      jasmine.objectContaining({ error: jasmine.any(Error) })
    );
  });
});
