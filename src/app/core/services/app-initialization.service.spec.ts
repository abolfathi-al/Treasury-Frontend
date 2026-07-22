import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { LANGUAGE_SERVICE, LanguageServicePort } from '@core/i18n';
import { GlobalEventsService } from './events.service';
import { AppInitializationService } from './app-initialization.service';

class TranslateServiceStub {
  instant(key: string): string {
    return key;
  }
}

describe('AppInitializationService', () => {
  let service: AppInitializationService;
  let languageService: jasmine.SpyObj<LanguageServicePort>;

  beforeEach(() => {
    languageService = jasmine.createSpyObj<LanguageServicePort>(
      'LanguageService',
      [
        'getSelectedLanguage',
        'getLanguageDirection',
        'getLanguageDirectionChanges',
        'isLanguageRTL',
        'setLanguage',
        'loadRuntimeTranslations',
      ]
    );
    languageService.getSelectedLanguage.and.returnValue('fa');
    languageService.getLanguageDirection.and.returnValue('rtl');
    languageService.getLanguageDirectionChanges.and.returnValue(of('rtl'));
    languageService.isLanguageRTL.and.returnValue(true);
    languageService.setLanguage.and.returnValue(true);
    languageService.loadRuntimeTranslations.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AppInitializationService,
        NgSelectConfig,
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: LANGUAGE_SERVICE, useValue: languageService },
        {
          provide: NgbModal,
          useValue: {
            activeInstances: EMPTY,
          },
        },
        {
          provide: GlobalEventsService,
          useValue: {
            hasOpenNotification$: EMPTY,
            hasOpenDrawer$: EMPTY,
          },
        },
      ],
    });

    service = TestBed.inject(AppInitializationService);
  });

  it('loads runtime translations through the core language contract during startup', () => {
    service.initialize();

    expect(languageService.loadRuntimeTranslations).toHaveBeenCalledTimes(1);
  });
});
