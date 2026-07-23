import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { timeoutInterceptor } from './timeout.interceptor';

describe('timeoutInterceptor', () => {
  it('does not require a timeout provider when the interceptor is disabled', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([timeoutInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpTestingController);
    const response = firstValueFrom(
      TestBed.inject(HttpClient).get('/v1/auth/sessions/current'),
    );

    http.expectOne('/v1/auth/sessions/current').flush({});
    await expectAsync(response).toBeResolvedTo({});
    http.verify();
  });
});
