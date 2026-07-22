import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { FocusManagementService } from './focus-management.service';
import { GlobalEventsService } from './events.service';
import { KeyboardEventService } from './keyboard-event.service';

describe('KeyboardEventService modal closing', () => {
  let service: KeyboardEventService;
  let modalService: jasmine.SpyObj<NgbModal>;
  let offcanvasService: jasmine.SpyObj<NgbOffcanvas>;
  let globalEventsService: jasmine.SpyObj<GlobalEventsService>;

  beforeEach(() => {
    modalService = jasmine.createSpyObj<NgbModal>('NgbModal', [
      'hasOpenModals',
    ]);
    offcanvasService = jasmine.createSpyObj<NgbOffcanvas>('NgbOffcanvas', [
      'hasOpenOffcanvas',
      'dismiss',
    ]);
    globalEventsService = jasmine.createSpyObj<GlobalEventsService>(
      'GlobalEventsService',
      ['hasOpenNotification', 'hasOpenDrawer', 'setKeydown']
    );

    modalService.hasOpenModals.and.returnValue(true);
    offcanvasService.hasOpenOffcanvas.and.returnValue(false);
    globalEventsService.hasOpenNotification.and.returnValue(false);
    globalEventsService.hasOpenDrawer.and.returnValue(false);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        KeyboardEventService,
        {
          provide: FocusManagementService,
          useValue: jasmine.createSpyObj<FocusManagementService>(
            'FocusManagementService',
            ['calculateOverlayFocus', 'handleNextFormSiblingFocus']
          ),
        },
        { provide: NgbModal, useValue: modalService },
        { provide: NgbOffcanvas, useValue: offcanvasService },
        { provide: GlobalEventsService, useValue: globalEventsService },
      ],
    });

    service = TestBed.inject(KeyboardEventService);
  });

  it('uses the modal component close handler before the fallback close callback', () => {
    const handleCloseModal = jasmine.createSpy('handleCloseModal');
    const close = jasmine.createSpy('close');

    service.setModalRefs([
      {
        componentInstance: { handleCloseModal },
        close,
      },
    ]);

    service.createHandlers().onEscape(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(handleCloseModal).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
    expect(offcanvasService.dismiss).toHaveBeenCalledTimes(1);
  });

  it('falls back to the modal close callback when no component close handler exists', () => {
    const close = jasmine.createSpy('close');

    service.setModalRefs([
      {
        componentInstance: {},
        close,
      },
    ]);

    service.createHandlers().onEscape(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(close).toHaveBeenCalledTimes(1);
    expect(offcanvasService.dismiss).toHaveBeenCalledTimes(1);
  });
});
