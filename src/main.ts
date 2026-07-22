import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { getAppProviders } from './app/app.config';
import { LoggerService } from '@core/services';

const MAIN_CONSTANTS = {
  BOOTSTRAP_ERROR_MESSAGE: 'Bootstrap failed',
  BOOTSTRAP_CONTEXT: 'Main',
} as const;

try {
  const providers = getAppProviders({
    isServer: false,
    includeServiceWorker: false,
    includeBrowserOnlyInitializers: true,
  });

  bootstrapApplication(AppComponent, { providers }).catch((err) => {
    LoggerService.Error(MAIN_CONSTANTS.BOOTSTRAP_ERROR_MESSAGE, MAIN_CONSTANTS.BOOTSTRAP_CONTEXT, { error: err });
  });
} catch (err) {
  LoggerService.Error(MAIN_CONSTANTS.BOOTSTRAP_ERROR_MESSAGE, MAIN_CONSTANTS.BOOTSTRAP_CONTEXT, { error: err });
}
