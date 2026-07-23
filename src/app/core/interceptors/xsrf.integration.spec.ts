import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe('Angular native same-origin XSRF integration', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    document.cookie = 'XSRF-TOKEN=treasury-xsrf; path=/';
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    document.cookie =
      'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('copies XSRF-TOKEN to X-XSRF-TOKEN without synthesizing Origin', async () => {
    const response = firstValueFrom(
      http.post('/v1/method-definitions', { code: 'WIRE' }),
    );
    const request = httpTesting.expectOne('/v1/method-definitions');

    expect(request.request.headers.get('X-XSRF-TOKEN')).toBe(
      'treasury-xsrf',
    );
    expect(request.request.headers.has('Origin')).toBeFalse();
    request.flush({ ok: true });

    await response;
  });
});
