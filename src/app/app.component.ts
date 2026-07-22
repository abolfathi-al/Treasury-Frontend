import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppInitializationService } from '@core/services/app-initialization.service';
import { FocusManagementService } from '@core/services/focus-management.service';
import { KeyboardEventService } from '@core/services/keyboard-event.service';

@Component({
  selector: 'vl-root, body[root]',
  templateUrl: './app.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  host: {
    '(window:click)': 'handleKeyDown($event.target)',
    '(window:keydown)': 'handleKeyDown($event.target)',
    '(window:keydown.shift.+)': 'handleKeyPressCrud($event)',
    '(window:keydown.insert)': 'handleKeyPressCrud($event)',
    '(window:keydown.delete)': 'handleKeyPressCrud($event)',
    '(window:keydown.control.shift.ArrowLeft)':
      'handleKeyPressControlShiftArrowLeft($event)',
    '(window:keydown.control.shift.ArrowRight)':
      'handleKeyPressControlShiftArrowRight($event)',
    '(window:keydown.escape)': 'handleEscape($event)',
    '(window:keydown.F1)': 'handleKeyPressF1($event)',
    '(window:keydown.F5)': 'handleKeyPressF5($event)',
    '(window:keydown.enter)': 'handleEnter($event)',
  },
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly keyboardEventService = inject(KeyboardEventService);
  private readonly focusManagementService = inject(FocusManagementService);
  private readonly appInitializationService = inject(AppInitializationService);

  private readonly keyboardHandlers =
    this.keyboardEventService.createHandlers();

  handleKeyDown(target: HTMLElement): void {
    this.keyboardHandlers.onKeyDown(target);
  }

  handleKeyPressCrud(event: KeyboardEvent): void {
    this.keyboardHandlers.onCrudKeyPress(event);
  }

  handleKeyPressControlShiftArrowLeft(event: KeyboardEvent): void {
    this.keyboardHandlers.onControlShiftArrowLeft(event);
  }

  handleKeyPressControlShiftArrowRight(event: KeyboardEvent): void {
    this.keyboardHandlers.onControlShiftArrowRight(event);
  }

  handleEscape(event: KeyboardEvent): void {
    this.keyboardHandlers.onEscape(event);
  }

  handleKeyPressF1(event: KeyboardEvent): void {
    this.keyboardHandlers.onF1(event);
  }

  handleKeyPressF5(event: KeyboardEvent): void {
    this.keyboardHandlers.onF5(event);
  }

  handleEnter(event: KeyboardEvent): void {
    this.keyboardHandlers.onEnter(event);
  }

  ngOnInit(): void {
    this.appInitializationService.initialize({
      onOverlayChange: () => {
        // Focus management can be handled here if needed
      },
      onModalRefsChange: (modalRefs) => {
        this.keyboardEventService.setModalRefs(modalRefs);
      },
    });
  }

  ngOnDestroy(): void {
    this.appInitializationService.destroy();
  }

  handleCalculateOverlayFocus(): void {
    this.focusManagementService.calculateOverlayFocus();
  }

  handleNextFormSiblingFocus(currentNode: HTMLElement, offset = 1): void {
    this.focusManagementService.handleNextFormSiblingFocus(currentNode, offset);
  }

  handleFirstFormInputFocus(currentNode?: HTMLElement): void {
    this.focusManagementService.handleFirstFormInputFocus(currentNode);
  }
}
