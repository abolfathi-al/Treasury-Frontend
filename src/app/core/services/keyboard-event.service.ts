import { Injectable, NgZone, inject } from '@angular/core';
import { GlobalEventsService } from './events.service';
import { ModalRef } from '@models/common';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FocusManagementService } from './focus-management.service';

export interface KeyboardEventHandlers {
  onKeyDown: (target: HTMLElement) => void;
  onCrudKeyPress: (event: KeyboardEvent) => void;
  onControlShiftArrowLeft: (event: KeyboardEvent) => void;
  onControlShiftArrowRight: (event: KeyboardEvent) => void;
  onEscape: (event: KeyboardEvent) => void;
  onF1: (event: KeyboardEvent) => void;
  onF5: (event: KeyboardEvent) => void;
  onEnter: (event: KeyboardEvent) => void;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardEventService {
  private isAriaExpanded = false;
  private modalRefs: ModalRef[] = [];
  private overlayStateCache: boolean | null = null;
  private lastOverlayCheck = 0;
  private readonly CACHE_DURATION = 100;

  private readonly focusManagementService = inject(FocusManagementService);
  private readonly ngZone = inject(NgZone);
  private readonly offcanvasService = inject(NgbOffcanvas);
  private readonly modalService = inject(NgbModal);
  private readonly globalEventsService = inject(GlobalEventsService);

  setModalRefs(modalRefs: ModalRef[]): void {
    this.modalRefs = modalRefs;
    this.invalidateOverlayCache();
  }

  private invalidateOverlayCache(): void {
    this.overlayStateCache = null;
  }

  get hasActiveOverlay(): boolean {
    const now = Date.now();

    if (this.overlayStateCache !== null && (now - this.lastOverlayCheck) < this.CACHE_DURATION) {
      return this.overlayStateCache;
    }

    const hasOpenModals = this.modalService.hasOpenModals();
    const hasOpenOffcanvas = this.offcanvasService.hasOpenOffcanvas();
    const hasOpenNotification = this.globalEventsService.hasOpenNotification();
    const hasOpenDrawer = this.globalEventsService.hasOpenDrawer();

    const result = hasOpenModals || hasOpenOffcanvas || hasOpenNotification || hasOpenDrawer;

    this.overlayStateCache = result;
    this.lastOverlayCheck = now;

    return result;
  }

  get hasOpenDrawer(): boolean {
    return this.globalEventsService.hasOpenDrawer();
  }

  createHandlers(): KeyboardEventHandlers {
    return {
      onKeyDown: (target: HTMLElement) => this.handleKeyDown(target),
      onCrudKeyPress: (event: KeyboardEvent) => this.handleKeyPressCrud(event),
      onControlShiftArrowLeft: (event: KeyboardEvent) => this.handleKeyPressControlShiftArrowLeft(event),
      onControlShiftArrowRight: (event: KeyboardEvent) => this.handleKeyPressControlShiftArrowRight(event),
      onEscape: (event: KeyboardEvent) => this.handleEscape(event),
      onF1: (event: KeyboardEvent) => this.handleKeyPressF1(event),
      onF5: (event: KeyboardEvent) => this.handleKeyPressF5(event),
      onEnter: (event: KeyboardEvent) => this.handleEnter(event)
    };
  }

  private handleKeyDown(target: HTMLElement): void {
    if (target.hasAttribute('aria-autocomplete')) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.isAriaExpanded = !!target.getAttribute('aria-activedescendant');
        });
      });
    }
  }

  private handleKeyPressCrud(event: KeyboardEvent): void {
    if (this.hasActiveOverlay || (event.target as HTMLElement).closest('form')) {
      return;
    }
    event.preventDefault();
    this.globalEventsService.setKeydown(event);
  }

  private handleKeyPressControlShiftArrowLeft(event: KeyboardEvent): void {
    this.handleControlShiftKey(event);
  }

  private handleKeyPressControlShiftArrowRight(event: KeyboardEvent): void {
    this.handleControlShiftKey(event);
  }

  private handleControlShiftKey(event: KeyboardEvent): void {
    if (this.hasActiveOverlay) {
      return;
    }
    event.preventDefault();
    this.globalEventsService.setKeydown(event);
  }

  private handleEscape(event: KeyboardEvent): void {
    if (this.isAriaExpanded) {
      this.isAriaExpanded = false;
      event.preventDefault();
      return;
    }

    if (this.hasOpenDrawer) {
      return;
    }

    if (this.hasActiveOverlay) {
      this.closeAllModals();
      this.offcanvasService.dismiss();
      return;
    }

    this.globalEventsService.setKeydown(event);
  }

  private closeAllModals(): void {
    this.modalRefs.forEach((modalRef) => {
      const componentInstance = modalRef.componentInstance;
      if (typeof componentInstance.handleCloseModal === 'function') {
        componentInstance.handleCloseModal();
      } else {
        modalRef.close();
      }
    });
  }

  private handleKeyPressF1(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.hasActiveOverlay === false) {
    }

    this.globalEventsService.setKeydown(event);
  }

  private handleKeyPressF5(event: KeyboardEvent): void {
    event.preventDefault();
    this.globalEventsService.setKeydown(event);
  }

  private handleEnter(event: KeyboardEvent): void {
    const currentNode = event.target as HTMLElement;
    const nodeName = currentNode.nodeName;

    switch (nodeName) {
      case 'NGB-OFFCANVAS-PANEL':
      case 'NGB-MODAL-WINDOW':
        this.focusManagementService.calculateOverlayFocus();
        break;
      case 'INPUT':
        if (this.isFormInput(currentNode)) {
          this.focusManagementService.handleNextFormSiblingFocus(currentNode);
        }
        break;
      default:
        if (this.hasActiveOverlay) {
          this.focusManagementService.calculateOverlayFocus();
        }
        break;
    }
  }

  private isFormInput(element: HTMLElement): boolean {
    return ['ag-grid-angular', 'form'].some((selector) => element.closest(selector));
  }
}
