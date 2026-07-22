import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';
import { VeloraIconComponent } from './velora-icon.component';

describe('VeloraIconComponent', () => {
  let fixture: ComponentFixture<VeloraIconComponent>;
  let logger: jasmine.SpyObj<LoggerService>;

  beforeEach(async () => {
    logger = jasmine.createSpyObj<LoggerService>('LoggerService', [
      'error',
      'warn',
    ]);

    await TestBed.configureTestingModule({
      imports: [VeloraIconComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoggerService, useValue: logger },
        {
          provide: CssLoaderService,
          useValue: {
            loadCss: jasmine
              .createSpy('loadCss')
              .and.returnValue(Promise.resolve()),
          },
        },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VeloraIconComponent);
  });

  it('warns when a valid icon type has no registered path data', () => {
    fixture.componentRef.setInput('name', 'missing-icon');

    fixture.detectChanges();

    expect(logger.warn).toHaveBeenCalledWith(
      "Icon 'missing-icon' not found for type 'duotone'",
      'VeloraIconComponent',
    );
    expect(fixture.componentInstance.isValid()).toBeFalse();
  });
});
