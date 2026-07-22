import { Injectable, DOCUMENT, inject } from '@angular/core';
import { GlobalEventsService } from './events.service';

export interface FocusManagementConfig {
  hasOpenDrawer: boolean;
  hasOpenNotification: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FocusManagementService {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly globalEventsService = inject(GlobalEventsService);

  calculateOverlayFocus(): void {
    this.handleFirstFormInputFocus();
  }

  handleNextFormSiblingFocus(currentNode: HTMLElement, offset = 1): void {
    if (!this.isValidInputNode(currentNode)) {
      return;
    }

    const anchorNode = currentNode.closest('ng-select') || currentNode;
    const focusTargetId = currentNode.getAttribute('focusTargetId');

    if (anchorNode.classList.contains('ng-invalid')) {
      this.handleInvalidNode(anchorNode);
      return;
    }

    if (focusTargetId) {
      this.document.getElementById(focusTargetId)?.focus();
      return;
    }

    if (currentNode.classList.contains('jumpNextFocus') && (currentNode as HTMLInputElement).value) {
      offset++;
    }

    this.focusNextFormElement(currentNode as HTMLInputElement, offset);
  }

  private isValidInputNode(node: HTMLElement | null): boolean {
    if (!node || node.nodeName !== 'INPUT') {
      return false;
    }

    if (node.classList.contains('skip-focused')) {
      return false;
    }

    const anchorNode = node.closest('ng-select') || node;
    if (node.hasAttribute('aria-autocomplete') && anchorNode.classList.contains('ng-select-opened')) {
      return false;
    }

    return true;
  }

  private handleInvalidNode(node: Element): void {
    if (node.nodeName === 'NG-SELECT') {
      const event = new KeyboardEvent('keydown', { keyCode: 40 });
      node.dispatchEvent(event);
    }
  }

  private focusNextFormElement(currentNode: HTMLInputElement, offset: number): void {
    const form = currentNode.form;
    if (!form) {
      return;
    }

    const currentIndex = Array.prototype.indexOf.call(form.elements, currentNode);
    const nextIndex = currentIndex + offset;
    const nextElement = form.elements[nextIndex] as HTMLElement;

    if (!nextElement) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      return;
    }

    if (this.isFocusableElement(nextElement)) {
      nextElement.focus();
    } else {
      this.focusNextFormElement(currentNode, offset + 1);
    }
  }

  private isFocusableElement(element: HTMLElement): boolean {
    if (!['INPUT', 'BUTTON'].includes(element.nodeName)) {
      return false;
    }

    const input = element as HTMLInputElement;
    return input.type !== 'hidden' && input.tabIndex !== -1 && !input.disabled;
  }

  handleFirstFormInputFocus(currentNode?: HTMLElement): void {
    const config = this.getFocusConfig();
    const selector = this.getFocusSelector(config);
    const container = (currentNode || this.document).querySelector<HTMLDivElement>(selector);
    
    if (!container) {
      return;
    }

    const form = container.querySelector<HTMLFormElement>('form');
    if (form && form.elements.length > 0) {
      form.click();
      this.handleNextFormSiblingFocus(form.elements[0] as HTMLElement, 0);
      return;
    }

    const button = container.querySelector<HTMLButtonElement>(
      'button:not([disabled]):not([style*="display:none"]):not([style*="display: none"])'
    );
    button?.focus();
  }

  private getFocusConfig(): FocusManagementConfig {
    return {
      hasOpenDrawer: this.globalEventsService.hasOpenDrawer(),
      hasOpenNotification: this.globalEventsService.hasOpenNotification()
    };
  }

  private getFocusSelector(config: FocusManagementConfig): string {
    if (config.hasOpenDrawer) {
      return '[data-velora-drawer="true"].drawer-on';
    }
    if (config.hasOpenNotification) {
      return '.swal2-container';
    }
    return 'ngb-modal-window, ngb-offcanvas-panel';
  }
}
