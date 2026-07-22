import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';

export interface DraggableConfig {
  enabled?: boolean;
  handle?: string | null;
  constrainToParent?: boolean;
  constrainToViewport?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  cursor?: string;
  disabledCursor?: string;
  dragClass?: string;
  ghostClass?: string;
  animationDuration?: number;
  threshold?: number;
  axis?: 'x' | 'y' | 'both';
  bounds?: { top?: number; right?: number; bottom?: number; left?: number };
}

export interface DragEvent {
  element: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  startX: number;
  startY: number;
  originalEvent: MouseEvent | TouchEvent;
}

const DEFAULT_CONFIG: Required<DraggableConfig> = {
  enabled: true,
  handle: null,
  constrainToParent: false,
  constrainToViewport: false,
  snapToGrid: false,
  gridSize: 10,
  cursor: 'move',
  disabledCursor: 'not-allowed',
  dragClass: 'velora-dragging',
  ghostClass: 'velora-drag-ghost',
  animationDuration: 0,
  threshold: 0,
  axis: 'both',
  bounds: {},
};

@Directive({
  selector: '[vlDraggable]',
  exportAs: 'vlDraggable',
  standalone: true,
  host: {
    '[style.cursor]': 'cursorStyle()',
    '[style.user-select]': '"none"',
    '[style.touch-action]': '"none"',
    '(mousedown)': 'onMouseDown($event)',
  },
})
export class DraggableDirective
  extends BaseDirective<Record<string, never>, string>
  implements OnInit, OnChanges
{
  private readonly host = useDirectiveHost();
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly window = this.host.isBrowser ? inject(WINDOW) : null;

  private isDragging = false;
  private isMouseDown = false;
  private hasMoved = false;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private previousX = 0;
  private previousY = 0;
  private initialX = 0;
  private initialY = 0;
  private dragHandle: HTMLElement | null = null;
  private originalTransform = '';
  private originalTransition = '';
  private originalZIndex = '';
  private lastEvent: MouseEvent | TouchEvent | null = null;
  private listenersAttached = false;

  readonly config = input<DraggableConfig>({});
  readonly enabled = input<boolean>(DEFAULT_CONFIG.enabled);
  readonly handle = input<string | null>(DEFAULT_CONFIG.handle);
  readonly constrainToParent = input<boolean>(DEFAULT_CONFIG.constrainToParent);
  readonly constrainToViewport = input<boolean>(DEFAULT_CONFIG.constrainToViewport);
  readonly snapToGrid = input<boolean>(DEFAULT_CONFIG.snapToGrid);
  readonly gridSize = input<number>(DEFAULT_CONFIG.gridSize);
  readonly threshold = input<number>(DEFAULT_CONFIG.threshold);
  readonly axis = input<'x' | 'y' | 'both'>(DEFAULT_CONFIG.axis);

  readonly dragStart = output<DragEvent>();
  readonly dragMove = output<DragEvent>();
  readonly dragEnd = output<DragEvent>();
  readonly dragCancel = output<DragEvent>();

  readonly mergedConfig = computed<Required<DraggableConfig>>(() => ({
    ...DEFAULT_CONFIG,
    enabled: this.enabled(),
    handle: this.handle(),
    constrainToParent: this.constrainToParent(),
    constrainToViewport: this.constrainToViewport(),
    snapToGrid: this.snapToGrid(),
    gridSize: this.gridSize(),
    threshold: this.threshold(),
    axis: this.axis(),
    ...this.config(),
  }));

  readonly cursorStyle = computed(() =>
    this.mergedConfig().enabled ? this.mergedConfig().cursor : this.mergedConfig().disabledCursor
  );

  constructor() {
    super(inject(LoggerService), 'DraggableDirective', {});
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.initializeDragHandle();
    this.attachGlobalListeners();
    this.attachTouchStartListener();
  }

  ngOnChanges(): void {
    this.stopDrag();
    this.initializeDragHandle();
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    if (!this.mergedConfig().enabled || this.isMouseDown) return;

    const coords = this.getEventCoordinates(event);
    if (!coords) return;

    if (event instanceof MouseEvent && event.button !== 0) return;

    this.isMouseDown = true;
    this.startX = coords.x;
    this.startY = coords.y;

    this.initialX = this.getCurrentTransformX();
    this.initialY = this.getCurrentTransformY();
    this.currentX = this.initialX;
    this.currentY = this.initialY;

    this.hasMoved = false;
    this.isDragging = false;
    this.lastEvent = event;

    this.storeOriginalStyles();
    this.addDragClass();

    if (this.host.isBrowser) {
      this.host.renderer.setStyle(this.element.nativeElement, 'transition', 'none');
    }

    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
  }

  stopDrag(): void {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;
    this.isDragging = false;
    this.removeDragClass();
    this.restoreNonTransformStyles();

    if (this.hasMoved) {
      this.dragEnd.emit(this.createDragEvent(this.currentX, this.currentY, this.getLastEvent()));
    }
  }

  cancelDrag(): void {
    if (!this.isMouseDown) return;

    this.lastEvent = this.getLastEvent();
    this.isMouseDown = false;
    this.isDragging = false;
    this.removeDragClass();
    this.restoreOriginalStyles();
    this.resetPosition();

    this.dragCancel.emit(this.createDragEvent(this.currentX, this.currentY, this.getLastEvent()));
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.isValidDragTarget(event.target as HTMLElement)) return;
    this.startDrag(event);
  }

  private initializeDragHandle(): void {
    if (this.mergedConfig().handle) {
      this.dragHandle = this.element.nativeElement.querySelector(this.mergedConfig().handle);
    } else {
      this.dragHandle = this.element.nativeElement;
    }
  }

  private attachGlobalListeners(): void {
    if (this.listenersAttached || !this.host.isBrowser) return;

    this.addBaseDomListener('document', 'mousemove', (event: Event) => {
      if (this.isMouseDown) this.handleDragMove(event as MouseEvent);
    });

    this.addBaseDomListener('document', 'mouseup', (event: Event) => {
      if (this.isMouseDown) this.handleDragEnd(event as MouseEvent);
    });

    this.addBaseDomListener(
      this.host.document,
      'touchmove',
      (event: Event) => {
        if (this.isMouseDown) this.handleDragMove(event as TouchEvent);
      },
      { passive: false }
    );

    this.addBaseDomListener('document', 'touchend', (event: Event) => {
      if (this.isMouseDown) this.handleDragEnd(event as TouchEvent);
    });

    this.addBaseDomListener('document', 'mouseleave', () => {
      if (this.isMouseDown) this.cancelDrag();
    });

    this.listenersAttached = true;
  }

  private handleDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isMouseDown) return;

    const coords = this.getEventCoordinates(event);
    if (!coords) return;

    const deltaX = coords.x - this.startX;
    const deltaY = coords.y - this.startY;

    if (!this.hasMoved && this.mergedConfig().threshold > 0) {
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < this.mergedConfig().threshold) return;
    }

    if (!this.hasMoved) {
      this.hasMoved = true;
      this.isDragging = true;
      this.dragStart.emit(this.createDragEvent(this.currentX, this.currentY, event));
    }

    const newX = this.initialX + deltaX;
    const newY = this.initialY + deltaY;

    this.updatePosition(newX, newY);
    this.dragMove.emit(this.createDragEvent(this.currentX, this.currentY, event));
    this.lastEvent = event;

    event.preventDefault();
    event.stopPropagation();
  }

  private handleDragEnd(event: MouseEvent | TouchEvent): void {
    this.lastEvent = event;
    this.stopDrag();
  }

  private getCurrentTransformX(): number {
    if (!this.host.isBrowser || !this.host.window) return 0;

    const transform = this.host.window.getComputedStyle(this.element.nativeElement).transform;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix.*\((.+)\)/)?.[1].split(', ');
      if (matrix && matrix.length >= 6) {
        return parseFloat(matrix[4]) || 0;
      }
    }
    return 0;
  }

  private getCurrentTransformY(): number {
    if (!this.host.isBrowser || !this.host.window) return 0;

    const transform = this.host.window.getComputedStyle(this.element.nativeElement).transform;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix.*\((.+)\)/)?.[1].split(', ');
      if (matrix && matrix.length >= 6) {
        return parseFloat(matrix[5]) || 0;
      }
    }
    return 0;
  }

  private updatePosition(x: number, y: number): void {
    this.previousX = this.currentX;
    this.previousY = this.currentY;

    let newX = x;
    let newY = y;

    if (this.mergedConfig().axis === 'x') {
      newY = this.currentY;
    } else if (this.mergedConfig().axis === 'y') {
      newX = this.currentX;
    }

    if (this.mergedConfig().snapToGrid) {
      newX = Math.round(newX / this.mergedConfig().gridSize) * this.mergedConfig().gridSize;
      newY = Math.round(newY / this.mergedConfig().gridSize) * this.mergedConfig().gridSize;
    }

    const constrained = this.applyConstraints(newX, newY);
    newX = constrained.x;
    newY = constrained.y;

    this.currentX = newX;
    this.currentY = newY;

    this.setTransform(newX, newY);
  }

  private applyConstraints(x: number, y: number): { x: number; y: number } {
    let constrainedX = x;
    let constrainedY = y;

    if (this.mergedConfig().constrainToParent) {
      const parent = this.element.nativeElement.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elementRect = this.element.nativeElement.getBoundingClientRect();

        const originalElementLeft = elementRect.left - parentRect.left - this.currentX;
        const originalElementTop = elementRect.top - parentRect.top - this.currentY;

        const newElementLeft = originalElementLeft + x;
        const newElementTop = originalElementTop + y;

        const minX = 0;
        const minY = 0;
        const maxX = parentRect.width - elementRect.width;
        const maxY = parentRect.height - elementRect.height;

        if (newElementLeft < minX) constrainedX = x - (newElementLeft - minX);
        if (newElementLeft > maxX) constrainedX = x - (newElementLeft - maxX);
        if (newElementTop < minY) constrainedY = y - (newElementTop - minY);
        if (newElementTop > maxY) constrainedY = y - (newElementTop - maxY);
      }
    }

    if (this.mergedConfig().constrainToViewport && this.host.window) {
      const viewportWidth = this.host.window.innerWidth;
      const viewportHeight = this.host.window.innerHeight;
      const elementRect = this.element.nativeElement.getBoundingClientRect();

      const originalElementLeft = elementRect.left - this.currentX;
      const originalElementTop = elementRect.top - this.currentY;

      const newElementLeft = originalElementLeft + x;
      const newElementTop = originalElementTop + y;

      const minX = 0;
      const minY = 0;
      const maxX = viewportWidth - elementRect.width;
      const maxY = viewportHeight - elementRect.height;

      if (newElementLeft < minX) constrainedX = x - (newElementLeft - minX);
      if (newElementLeft > maxX) constrainedX = x - (newElementLeft - maxX);
      if (newElementTop < minY) constrainedY = y - (newElementTop - minY);
      if (newElementTop > maxY) constrainedY = y - (newElementTop - maxY);
    }

    if (this.mergedConfig().bounds) {
      const bounds = this.mergedConfig().bounds;
      if (bounds.left !== undefined) constrainedX = Math.max(constrainedX, bounds.left);
      if (bounds.right !== undefined) constrainedX = Math.min(constrainedX, bounds.right);
      if (bounds.top !== undefined) constrainedY = Math.max(constrainedY, bounds.top);
      if (bounds.bottom !== undefined) constrainedY = Math.min(constrainedY, bounds.bottom);
    }

    return { x: constrainedX, y: constrainedY };
  }

  private setTransform(x: number, y: number): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.setStyle(this.element.nativeElement, 'transform', `translate3d(${x}px, ${y}px, 0)`);
  }

  private resetPosition(): void {
    this.setTransform(0, 0);
    this.currentX = 0;
    this.currentY = 0;
    this.previousX = 0;
    this.previousY = 0;
  }

  private storeOriginalStyles(): void {
    if (!this.host.isBrowser || !this.host.window) return;

    const computedStyle = this.host.window.getComputedStyle(this.element.nativeElement);
    this.originalTransform = computedStyle.transform || '';
    this.originalTransition = computedStyle.transition || '';
    this.originalZIndex = computedStyle.zIndex || '';
  }

  private restoreOriginalStyles(): void {
    if (!this.host.isBrowser) return;

    this.host.renderer.setStyle(this.element.nativeElement, 'transform', this.originalTransform);
    this.host.renderer.setStyle(this.element.nativeElement, 'transition', this.originalTransition);
    this.host.renderer.setStyle(this.element.nativeElement, 'z-index', this.originalZIndex);
  }

  private restoreNonTransformStyles(): void {
    if (!this.host.isBrowser) return;

    this.host.renderer.setStyle(this.element.nativeElement, 'transition', this.originalTransition);
    this.host.renderer.setStyle(this.element.nativeElement, 'z-index', this.originalZIndex);
  }

  private addDragClass(): void {
    if (!this.host.isBrowser) return;

    this.host.renderer.addClass(this.element.nativeElement, this.mergedConfig().dragClass);

    if (this.mergedConfig().ghostClass) {
      this.host.renderer.addClass(this.element.nativeElement, this.mergedConfig().ghostClass);
    }

    this.host.renderer.setStyle(this.element.nativeElement, 'touch-action', 'none');
    this.host.renderer.setStyle(this.element.nativeElement, 'pointer-events', 'none');
  }

  private removeDragClass(): void {
    if (!this.host.isBrowser) return;

    this.host.renderer.removeClass(this.element.nativeElement, this.mergedConfig().dragClass);

    if (this.mergedConfig().ghostClass) {
      this.host.renderer.removeClass(this.element.nativeElement, this.mergedConfig().ghostClass);
    }

    this.host.renderer.removeStyle(this.element.nativeElement, 'touch-action');
    this.host.renderer.removeStyle(this.element.nativeElement, 'pointer-events');
  }

  private isValidDragTarget(target: HTMLElement): boolean {
    if (!this.dragHandle) return false;
    return this.dragHandle === target || this.dragHandle.contains(target);
  }

  private getEventCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } | null {
    if ('touches' in event) {
      if (event.touches.length === 0) return null;
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else {
      return { x: event.clientX, y: event.clientY };
    }
  }

  private createDragEvent(x: number, y: number, originalEvent: MouseEvent | TouchEvent): DragEvent {
    return {
      element: this.element.nativeElement,
      x,
      y,
      deltaX: x - this.previousX,
      deltaY: y - this.previousY,
      startX: this.startX,
      startY: this.startY,
      originalEvent,
    };
  }

  private getLastEvent(): MouseEvent | TouchEvent {
    return this.lastEvent ?? new MouseEvent('drag');
  }

  private attachTouchStartListener(): void {
    const element = this.dragHandle || this.element.nativeElement;
    const handler: EventListener = (event) => {
      const touchEvent = event as TouchEvent;
      if (!this.isValidDragTarget(touchEvent.target as HTMLElement)) return;
      this.startDrag(touchEvent);
    };

    if (this.host.isBrowser) {
      this.addBaseDomListener(element, 'touchstart', handler, { passive: false });
    }
  }

  private cleanup(): void {
    this.stopDrag();
    this.clearBaseDomListeners();
    this.dragHandle = null;
    this.lastEvent = null;
    this.listenersAttached = false;
    this.baseCleanup();
  }
}
