import { ApplicationRef, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import {
  catchError,
  concat,
  filter,
  first,
  interval,
  of,
  switchMap,
  tap
} from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { environment } from '@environments/environment';

const CHECK_INTERVAL_MS = 60 * 60 * 1000;
const DISABLED_MESSAGE = 'Service worker disabled in development';
const INITIALIZED_MESSAGE = 'Service worker update check initialized';
const NOT_AVAILABLE_MESSAGE = 'Service worker not available';

export const swCheckForUpdate = () => {
  try {
    const appRef = inject(ApplicationRef);
    const swUpdate = inject(SwUpdate);
    const logger = inject(LoggerService);
    const windowRef = inject(WINDOW);

    if (!swUpdate.isEnabled || !environment.production) {
      return Promise.resolve(DISABLED_MESSAGE);
    }

    setupUpdateChecking(appRef, swUpdate, logger);
    setupVersionActivation(swUpdate, logger, windowRef);
    setupUnrecoverableHandling(swUpdate, logger, windowRef);

    return Promise.resolve(INITIALIZED_MESSAGE);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    LoggerService.Error('Service worker not available:', 'ServiceWorkerInitializer', {
      error: errorMessage
    });
    return Promise.resolve(NOT_AVAILABLE_MESSAGE);
  }
};

const setupUpdateChecking = (
  appRef: ApplicationRef,
  swUpdate: SwUpdate,
  logger: LoggerService
): void => {
  const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
  const everyHour$ = interval(CHECK_INTERVAL_MS);
  const everyHourOnceAppIsStable$ = concat(appIsStable$, everyHour$);

  everyHourOnceAppIsStable$.pipe(
    switchMap(() => swUpdate.checkForUpdate()),
    tap(updateFound => {
      const message = updateFound
        ? 'A new version is available.'
        : 'Already on the latest version.';
      logger.info(message, 'ServiceWorkerInitializer');
    }),
    catchError(err => {
      logger.error('Failed to check for updates', 'ServiceWorkerInitializer', { error: err });
      return of(false);
    })
  ).subscribe();
};

const setupVersionActivation = (
  swUpdate: SwUpdate,
  logger: LoggerService,
  windowRef: Window
): void => {
  swUpdate.versionUpdates.pipe(
    filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
    switchMap(() => swUpdate.activateUpdate()),
    tap(() => {
      logger.info('New version activated, reloading...', 'ServiceWorkerInitializer');
      windowRef.location.reload();
    })
  ).subscribe();
};

const setupUnrecoverableHandling = (
  swUpdate: SwUpdate,
  logger: LoggerService,
  windowRef: Window
): void => {
  swUpdate.unrecoverable.pipe(
    switchMap(() => swUpdate.activateUpdate()),
    tap(() => {
      logger.info('Unrecoverable error, reloading...', 'ServiceWorkerInitializer');
      windowRef.location.reload();
    })
  ).subscribe();
};
