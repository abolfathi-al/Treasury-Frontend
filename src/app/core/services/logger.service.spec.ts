import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/tokens';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('registers global error handlers on the injected window', () => {
    const windowRef = {
      addEventListener: jasmine.createSpy('addEventListener'),
    } as unknown as Window;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LoggerService,
        { provide: WINDOW, useValue: windowRef },
      ],
    });

    TestBed.inject(LoggerService);

    expect(windowRef.addEventListener).toHaveBeenCalledWith(
      'error',
      jasmine.any(Function)
    );
    expect(windowRef.addEventListener).toHaveBeenCalledWith(
      'unhandledrejection',
      jasmine.any(Function)
    );
  });

  it('sanitizes circular data when exporting logs', () => {
    const circular: Record<string, unknown> = { name: 'payload' };
    circular['self'] = circular;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LoggerService,
        {
          provide: WINDOW,
          useValue: {
            addEventListener: () => undefined,
            document,
          },
        },
      ],
    });

    const logger = TestBed.inject(LoggerService);
    logger.warn('Stored warning', 'LoggerSpec', circular);

    const exported = JSON.parse(logger.exportLogs()) as Array<{
      data: { self: string };
    }>;

    expect(exported[0].data.self).toBe('[Circular Reference]');
  });
});
