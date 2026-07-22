import '@angular/platform-server/init';

import { withFetch } from '@angular/common/http';
import { ApplicationRef, enableProdMode } from '@angular/core';
import { BootstrapContext, bootstrapApplication, provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { getAppProviders } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export default function main(context: BootstrapContext): Promise<ApplicationRef> {
  return bootstrapApplication(AppComponent, {
    providers: [
      provideServerRendering(),
      provideClientHydration(withIncrementalHydration()),
      ...getAppProviders({
        isServer: true,
        includeServiceWorker: false,
        includeBrowserOnlyInitializers: false,
        httpClientFeatures: [withFetch()],
      })
    ]
  }, context);
}
