import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/tokens';
import { FileDownloadService } from './file-download.service';

describe('FileDownloadService', () => {
  it('uses injected document and window APIs when saving blobs', () => {
    const anchor = {
      href: '',
      download: '',
      style: { display: '' },
      click: jasmine.createSpy('click'),
    } as unknown as HTMLAnchorElement;
    const documentRef = {
      createElement: jasmine.createSpy('createElement').and.returnValue(anchor),
      body: {
        appendChild: jasmine.createSpy('appendChild'),
        removeChild: jasmine.createSpy('removeChild'),
      },
    } as unknown as Document;
    const windowRef = {
      URL: {
        createObjectURL: jasmine
          .createSpy('createObjectURL')
          .and.returnValue('blob:download'),
        revokeObjectURL: jasmine.createSpy('revokeObjectURL'),
      },
    } as unknown as Window;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        FileDownloadService,
        { provide: DOCUMENT, useValue: documentRef },
        { provide: WINDOW, useValue: windowRef },
      ],
    });

    TestBed.inject(FileDownloadService).saveBlobToDisk(
      new Blob(['content']),
      'report.csv'
    );

    expect(documentRef.createElement).toHaveBeenCalledWith('a');
    expect(anchor.href).toBe('blob:download');
    expect(anchor.download).toBe('report.csv');
    expect(anchor.click).toHaveBeenCalled();
    expect(documentRef.body.appendChild).toHaveBeenCalledWith(anchor);
    expect(documentRef.body.removeChild).toHaveBeenCalledWith(anchor);
    expect(windowRef.URL.revokeObjectURL).toHaveBeenCalledWith(
      'blob:download'
    );
  });
});
