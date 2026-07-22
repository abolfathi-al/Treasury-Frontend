import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { ERROR_REPORTER, ErrorReporterPort } from '@core/errors';
import { errorInterceptor, getHttpErrorStackTrace } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let errorReporter: jasmine.SpyObj<ErrorReporterPort>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    errorReporter = jasmine.createSpyObj<ErrorReporterPort>('ErrorReporter', [
      'isCriticalError',
      'getUserFriendlyMessage',
      'navigateToError',
    ]);
    errorReporter.isCriticalError.and.returnValue(true);
    errorReporter.getUserFriendlyMessage.and.returnValue(
      'workspace.errors.error500.message'
    );
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ERROR_REPORTER, useValue: errorReporter },
        { provide: ToastrService, useValue: toastr },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('routes critical HTTP errors through the core error reporter contract', async () => {
    const response = firstValueFrom(http.get('/error/orders'));

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const request = httpTesting.expectOne('/error/orders');
      request.flush(
        { stack: 'server-stack' },
        { status: 500, statusText: 'Server Error' }
      );
    }

    await expectAsync(response).toBeRejected();
    expect(errorReporter.navigateToError).toHaveBeenCalledWith(
      '500',
      jasmine.objectContaining({
        url: '/error/orders',
        method: 'GET',
        status: 500,
        statusText: 'Server Error',
        stackTrace: 'server-stack',
      })
    );
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it('extracts stack traces from server payloads before response errors', () => {
    const error = new Error('response error');
    const httpError = {
      error: { stack: 'server-stack' },
      stack: error.stack,
    } as unknown as HttpErrorResponse;

    expect(getHttpErrorStackTrace(httpError)).toBe('server-stack');
  });
});
