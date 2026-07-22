import {
  Directive,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { DomUtil } from '@utils/dom.util';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export type SwapperMode = 'append' | 'prepend' | 'before' | 'after';

export interface SwapperOptions {
  activate?: boolean;
  mode?: SwapperMode | { [breakpoint: string]: SwapperMode };
  parents?: string | { [breakpoint: string]: string };
}

const DEFAULT_OPTIONS: Required<SwapperOptions> = {
  activate: true,
  mode: 'append',
  parents: '',
} as const;

@Directive({
  selector: '[vlVeloraSwapper]',
  exportAs: 'vlVeloraSwapper',
  standalone: true,
})
export class SwapperDirective
  extends BaseDirective<SwapperOptions, string>
  implements OnInit, OnDestroy
{
  private readonly host = useDirectiveHost();

  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;
  private currentParentSelector: string | null = null;
  private listenersBound = false;

  readonly swapperOptions = input<SwapperOptions>();
  readonly swapperActivate = input<boolean>();
  readonly swapperMode = input<SwapperMode | { [breakpoint: string]: SwapperMode }>();
  readonly swapperParents = input<string | { [breakpoint: string]: string }>();

  readonly swapperSwapped = output<void>();

  constructor() {
    super(inject(LoggerService), 'SwapperDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.setupBindings();
    this.bindInputs(this.getInputBindings());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    if (!this.canInit()) return;

    this.executeSafely(() => {
      this.syncInputs(this.getInputBindings());
      const options = this.swapperOptions();
      if (options) this.mergeOpts(options);
      this.initSwapper();
      this.setupListeners();
    }, 'Initialization failed');
  }

  private getInputBindings() {
    return [
      { input: this.swapperActivate, key: 'activate' as const },
      { input: this.swapperMode, key: 'mode' as const },
      { input: this.swapperParents, key: 'parents' as const },
    ];
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private setupBindings(): void {
    effect(() => {
      const opts = this.swapperOptions();
      untracked(() => {
        if (opts) this.mergeOpts(opts);
      });
    });
  }

  private canInit(): boolean {
    return Boolean(this.host.elementRef.nativeElement && this.isActivateOn());
  }

  private initSwapper(): void {
    this.storeOriginalState();
    this.evaluateAndSwap();
  }

  private setupListeners(): void {
    if (!this.host.isBrowser || this.listenersBound) return;

    this.executeSafely(() => {
      const handler = this.createDebouncedHandler(() => this.handleResize(), 100);
      this.addWindowListener('resize', handler);
      this.listenersBound = true;
    }, 'Event listener setup failed');
  }

  private storeOriginalState(): void {
    const element = this.host.elementRef.nativeElement;
    if (!this.placeholder) {
      this.placeholder = this.host.document.createComment('swapper-placeholder');
    }

    if (!this.originalParent) {
      this.originalParent = element.parentNode;
    }

    if (!this.host.isBrowser) return;

    if (
      this.placeholder &&
      this.placeholder.parentNode !== this.originalParent &&
      this.originalParent
    ) {
      this.host.renderer.insertBefore(this.originalParent, this.placeholder, element);
    }
  }

  private evaluateAndSwap(): void {
    this.executeSafely(() => {
      const mode = this.getCurrentMode();
      const parentSelector = this.getCurrentParentSelector();

      if (mode && parentSelector && this.shouldSwap(mode, parentSelector)) {
        this.performSwap(mode, parentSelector);
      } else {
        this.restoreOriginalPosition();
      }
    }, 'Swap evaluation failed');
  }

  private getCurrentMode(): SwapperMode {
    return (
      runSafely(
        () => {
          const { mode } = this.optionsManager.snapshot();

          if (typeof mode === 'string') return mode;

          if (typeof mode === 'object') {
            const breakpointValue = DomUtil.getBreakpointValue(mode);
            if (typeof breakpointValue === 'string' && this.isValidMode(breakpointValue)) {
              return breakpointValue as SwapperMode;
            }
          }

          return 'append';
        },
        (error) =>
          this.logger.error('Mode retrieval failed', 'SwapperDirective', { error })
      ) ?? 'append'
    );
  }

  private isValidMode(mode: string): mode is SwapperMode {
    return ['append', 'prepend', 'before', 'after'].includes(mode);
  }

  private getCurrentParentSelector(): string | null {
    return (
      runSafely(
        () => {
          const { parents } = this.optionsManager.snapshot();

          if (typeof parents === 'string') return parents;

          if (typeof parents === 'object') {
            const breakpointValue = DomUtil.getBreakpointValue(parents);
            return typeof breakpointValue === 'string' ? breakpointValue : null;
          }

          return null;
        },
        (error) =>
          this.logger.error('Parent selector retrieval failed', 'SwapperDirective', { error })
      ) ?? null
    );
  }

  private shouldSwap(mode: SwapperMode, parentSelector: string | null): boolean {
    return Boolean(mode && parentSelector);
  }

  private performSwap(mode: SwapperMode, parentSelector: string): void {
    this.executeSafely(() => {
      const targetParent = this.findTargetParent(parentSelector);

      if (!targetParent) {
        this.logger.error('Target parent not found', 'SwapperDirective', {
          data: { parentSelector },
        });
        return;
      }

      this.executeSwap(mode, targetParent);
      this.currentParentSelector = parentSelector;
      this.emitSwapEvent();
    }, 'Swap execution failed');
  }

  private findTargetParent(selector: string): HTMLElement | null {
    return (
      runSafely(
        () => this.host.document.querySelector(selector) as HTMLElement | null,
        (error) =>
          this.logger.error('Target parent search failed', 'SwapperDirective', { error })
      ) ?? null
    );
  }

  private executeSwap(mode: SwapperMode, targetParent: HTMLElement): void {
    if (!this.host.isBrowser) return;
    const element = this.host.elementRef.nativeElement;
    const { renderer } = this.host;

    switch (mode) {
      case 'append':
        renderer.appendChild(targetParent, element);
        break;
      case 'prepend':
        renderer.insertBefore(targetParent, element, targetParent.firstChild);
        break;
      case 'before':
        if (targetParent.parentNode) {
          renderer.insertBefore(targetParent.parentNode, element, targetParent);
        }
        break;
      case 'after':
        if (targetParent.parentNode) {
          renderer.insertBefore(targetParent.parentNode, element, targetParent.nextSibling);
        }
        break;
      default:
        this.logger.error('Unknown swap mode', 'SwapperDirective', { data: { mode } });
    }
  }

  private restoreOriginalPosition(): void {
    if (!this.host.isBrowser) return;

    if (this.placeholder && this.originalParent) {
      this.host.renderer.insertBefore(
        this.originalParent,
        this.host.elementRef.nativeElement,
        this.placeholder
      );
      this.currentParentSelector = null;
    }
  }

  private handleResize(): void {
    this.evaluateAndSwap();
  }

  private mergeOpts(options: SwapperOptions): void {
    this.executeSafely(() => {
      mergeOptionsIfChanged(this.optionsManager, options, () => this.evaluateAndSwap());
    }, 'Options update failed');
  }

  protected override updateOption<K extends keyof SwapperOptions>(key: K, value: SwapperOptions[K]): boolean {
    const changed = setOptionIfChanged(this.optionsManager, key, value, () => this.evaluateAndSwap());
    return changed;
  }

  private emitSwapEvent(): void {
    this.swapperSwapped.emit();
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.restoreOriginalPosition();
      this.placeholder = null;
      this.originalParent = null;
      this.currentParentSelector = null;

      this.clearBaseDomListeners();
      this.listenersBound = false;

      this.status.setError(null);
    }, 'Cleanup failed');
  }

  private addWindowListener(eventName: string, handler: EventListener): void {
    if (!this.host.isBrowser) return;
    this.addBaseDomListener('window', eventName, handler);
  }

  private createDebouncedHandler(handler: () => void, delayMs: number): EventListener {
    let timeoutId: number | null = null;
    return () => {
      const hostWindow = this.host.window ?? this.getHostWindow();
      if (!hostWindow) return;
      if (timeoutId !== null) hostWindow.clearTimeout(timeoutId);
      timeoutId = hostWindow.setTimeout(() => {
        timeoutId = null;
        handler();
      }, delayMs);
    };
  }
}
