import { DOCUMENT } from '@angular/common';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpProgressEvent,
  HttpResponse
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, scan } from 'rxjs/operators';

import { WINDOW } from '@core/tokens';

export interface DownloadState {
  content: Blob | null;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export interface DownloadOptions {
  headers?: HttpHeaders | Record<string, string>;
  params?: Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  filename?: string;
  mimeType?: string;
  saver?: (blob: Blob, headers: HttpHeaders) => void;
  method?: 'GET' | 'POST';
  body?: unknown;
  observeFilenameFromHeader?: boolean;
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}

@Injectable({ providedIn: 'root' })
export class FileDownloadService {
  private readonly http = inject(HttpClient);
  private readonly window = inject(WINDOW);
  private readonly document = inject(DOCUMENT);

  getFilenameFromHeader(headers: HttpHeaders): string | undefined {
    const disposition = headers.get('content-disposition');
    if (!disposition || !disposition.includes('attachment')) {
      return undefined;
    }

    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    return matches?.[1]?.replace(/['"]/g, '');
  }

  downloadOperator(
    saver?: (b: Blob, headers: HttpHeaders) => void
  ): (source: Observable<HttpEvent<Blob>>) => Observable<DownloadState> {
    return (source: Observable<HttpEvent<Blob>>) =>
      source.pipe(
        scan(
          (download: DownloadState, event): DownloadState => {
            if (isHttpProgressEvent(event)) {
              return {
                state: 'IN_PROGRESS',
                progress: event.total
                  ? Math.round((100 * event.loaded) / event.total)
                  : download.progress,
                content: null
              };
            }
            if (isHttpResponse(event)) {
              if (saver) {
                saver(event.body!, event.headers);
              }
              return {
                state: 'DONE',
                progress: 100,
                content: event.body || null
              };
            }
            return download;
          },
          {
            state: 'PENDING' as const,
            progress: 0,
            content: null
          }
        ),
        distinctUntilChanged((a, b) =>
          a.state === b.state &&
          a.progress === b.progress &&
          a.content === b.content
        )
      );
  }

  stream(url: string, options?: DownloadOptions): Observable<DownloadState> {
    const method = options?.method ?? 'GET';
    const headers = this.normalizeHeaders(options?.headers);
    const httpOptions = {
      observe: 'events',
      reportProgress: true,
      responseType: 'blob',
      headers,
      params: options?.params
    } as const;

    const request$ = (
      method === 'POST'
        ? this.http.post(url, options?.body, httpOptions)
        : this.http.get(url, httpOptions)
    );

    return request$.pipe(this.downloadOperator(options?.saver));
  }

  save(url: string, options?: DownloadOptions): Observable<DownloadState> {
    const observeHeader = options?.observeFilenameFromHeader !== false;
    const saver = (blob: Blob, headers: HttpHeaders) => {
      const filename = observeHeader
        ? (this.getFilenameFromHeader(headers) ?? options?.filename)
        : options?.filename;
      this.saveBlobToDisk(blob, filename ?? 'download');
    };
    return this.stream(url, { ...options, saver });
  }

  saveBlobToDisk(blob: Blob, filename: string): void {
    const blobUrl = this.window.URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';

    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);

    this.window.URL.revokeObjectURL(blobUrl);
  }

  private normalizeHeaders(
    headers?: HttpHeaders | Record<string, string>
  ): HttpHeaders | undefined {
    if (!headers) {
      return undefined;
    }
    return headers instanceof HttpHeaders ? headers : new HttpHeaders(headers);
  }
}
