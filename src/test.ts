import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

const TEST_CONFIG = {
  TEARDOWN: {
    destroyAfterEach: true,
  },
  ERROR_ON_UNKNOWN_ELEMENTS: true,
  ERROR_ON_UNKNOWN_PROPERTIES: true,
} as const;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: TEST_CONFIG.TEARDOWN,
    errorOnUnknownElements: TEST_CONFIG.ERROR_ON_UNKNOWN_ELEMENTS,
    errorOnUnknownProperties: TEST_CONFIG.ERROR_ON_UNKNOWN_PROPERTIES,
  }
);
