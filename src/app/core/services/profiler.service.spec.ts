import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';
import { ProfilerService } from './profiler.service';

describe('ProfilerService', () => {
  it('routes default profiler log entries through the public logger API', () => {
    const logger = jasmine.createSpyObj<
      Pick<LoggerService, 'debug' | 'info' | 'warn' | 'error'>
    >('LoggerService', ['debug', 'info', 'warn', 'error']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ProfilerService,
        { provide: LoggerService, useValue: logger },
      ],
    });

    const profiler = TestBed.inject(ProfilerService);

    expect(() => profiler.add('rendered dashboard')).not.toThrow();
    expect(logger.debug).toHaveBeenCalledWith(
      'rendered dashboard',
      'Profiler',
      jasmine.objectContaining({
        message: 'rendered dashboard',
        level: 'log',
      })
    );
  });
});
