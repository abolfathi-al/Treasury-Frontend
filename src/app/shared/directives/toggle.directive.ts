import {
  Directive,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';

export interface ToggleOptions {
  activate?: boolean;
  toggleSelector?: string;
  targetSelector?: string;
  toggleState?: string;
  toggleName?: string;
  responsive?: boolean | { [key: string]: boolean };
  animation?: boolean;
  animationDuration?: number;
  preventDefault?: boolean;
}

const DEFAULT_OPTIONS: Required<ToggleOptions> = {
  activate: true,
  toggleSelector: '[data-velora-toggle="toggle"]',
  targetSelector: '[data-velora-toggle="target"]',
  toggleState: 'active',
  toggleName: 'toggle',
  responsive: true,
  animation: true,
  animationDuration: 300,
  preventDefault: true,
} as const;

@Directive({
  selector: '[vlVeloraToggle]',
  exportAs: 'vlVeloraToggle',
  standalone: true,
})
export class ToggleDirective
  extends BaseDirective<ToggleOptions, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();

  private toggleEl: HTMLElement | null = null;
  private targetEl: HTMLElement | null = null;
  private animationTimeout: number | null = null;

  readonly toggleOptions = input<ToggleOptions>();
  readonly toggleActivate = input<boolean>();
  readonly toggleToggleSelector = input<string>();
  readonly toggleTargetSelector = input<string>();
  readonly toggleResponsive = input<boolean | { [key: string]: boolean }>();
  readonly toggleAnimation = input<boolean>();
  readonly toggleAnimationDuration = input<number>();
  readonly togglePreventDefault = input<boolean>();
  readonly toggleState = input<string>();
  readonly toggleName = input<string>();
  readonly toggleIsActive = input<boolean>();

  readonly toggleChange = output<boolean>();
  readonly toggleChanged = output<boolean>();
  readonly toggleEnable = output<void>();
  readonly toggleEnabled = output<void>();
  readonly toggleDisable = output<void>();
  readonly toggleDisabled = output<void>();

  constructor() {
    super(inject(LoggerService), 'ToggleDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.bindInputs(this.getInputBindings(), () => this.updateState());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    if (!this.canInit()) return;

    this.executeSafely(() => {
      this.syncInputs(this.getInputBindings());

      const opts = this.toggleOptions();
      if (opts) this.mergeOptions(opts);

      this.initElements();
      this.setupListeners();
      this.updateState();
      this.markBaseInitialized();
    }, 'Initialization failed');
  }

  private getInputBindings() {
    return [
      { input: this.toggleActivate, key: 'activate' as const },
      { input: this.toggleToggleSelector, key: 'toggleSelector' as const },
      { input: this.toggleTargetSelector, key: 'targetSelector' as const },
      { input: this.toggleResponsive, key: 'responsive' as const },
      { input: this.toggleAnimation, key: 'animation' as const },
      { input: this.toggleAnimationDuration, key: 'animationDuration' as const },
      { input: this.togglePreventDefault, key: 'preventDefault' as const },
      { input: this.toggleState, key: 'toggleState' as const },
      { input: this.toggleName, key: 'toggleName' as const },
    ];
  }

  enable(): void {
    if (!this.host.isBrowser || !this.toggleEl) return;
    this.executeSafely(() => {
      this.host.renderer.removeAttribute(this.toggleEl!, 'disabled');
      this.toggleEnable.emit();
      this.toggleEnabled.emit();
    }, 'Enable failed');
  }

  disable(): void {
    if (!this.host.isBrowser || !this.toggleEl) return;
    this.executeSafely(() => {
      this.host.renderer.setAttribute(this.toggleEl!, 'disabled', 'true');
      this.toggleDisable.emit();
      this.toggleDisabled.emit();
    }, 'Disable failed');
  }

  toggle(): void {
    if (!this.toggleEl) return;
    this.setActiveState(!this.status.getActive());
  }

  show(): void {
    this.setActiveState(true);
  }

  hide(): void {
    this.setActiveState(false);
  }

  private canInit(): boolean {
    return Boolean(this.host.elementRef.nativeElement && this.isActivateOn());
  }

  private initElements(): void {
    const { toggleSelector, targetSelector } = this.optionsManager.snapshot();
    const host = this.host.elementRef.nativeElement;

    this.toggleEl = host.querySelector<HTMLElement>(toggleSelector ?? '') || host;

    this.targetEl =
      targetSelector === 'body'
        ? this.host.document.body
        : host.querySelector<HTMLElement>(targetSelector ?? '') || host;
  }

  private setupListeners(): void {
    if (!this.toggleEl) return;
    this.addBaseDomListener(this.toggleEl, 'click', (e) => this.handleClick(e));
  }

  private handleClick(e: Event): void {
    this.executeSafely(() => {
      if (this.optionsManager.snapshot().preventDefault) e.preventDefault();
      this.toggle();
    }, 'Toggle click handling failed');
  }

  private setActiveState(active: boolean): void {
    const previousState = this.status.getActive();
    if (previousState === active) return;

    this.status.setActive(active);
    this.toggleChange.emit(active);
    this.toggleChanged.emit(active);
    this.updateState();
  }

  private updateState(): void {
    if (!this.toggleEl || !this.targetEl) return;

    this.executeSafely(() => {
      const isActive = this.status.getActive();
      const options = this.optionsManager.snapshot();
      const toggleState = options.toggleState || 'active';
      const toggleName = options.toggleName || 'toggle';

      this.setClass(this.host.renderer, this.toggleEl, toggleState, isActive);
      this.updateDataAttr(isActive, toggleName);

      if (this.targetEl === this.host.document.body) return;

      if (options.animation) {
        this.animateTarget(isActive, options.animationDuration || 300);
      } else {
        this.updateVisibility(isActive);
      }
    }, 'State update failed');
  }

  private updateVisibility(isActive: boolean): void {
    if (!this.targetEl) return;
    const { renderer } = this.host;
    renderer.removeStyle(this.targetEl, 'transition');
    renderer.setStyle(this.targetEl, 'opacity', isActive ? '1' : '0');
    this.setClass(renderer, this.targetEl, 'show', isActive);
    this.setClass(renderer, this.targetEl, 'active', isActive);
    renderer.setStyle(this.targetEl, 'display', isActive ? 'block' : 'none');
  }

  private updateDataAttr(isActive: boolean, toggleName: string): void {
    if (!this.host.isBrowser || !this.targetEl) return;
    const attributeName = toggleName.startsWith('app-sidebar-')
      ? `data-velora-${toggleName}`
      : `data-${toggleName}`;
    this.setDataAttr(this.host.renderer, this.targetEl, attributeName, isActive ? 'on' : null);
  }

  private animateTarget(isActive: boolean, duration: number): void {
    if (!this.targetEl) return;
    this.clearAnimationTimeout();

    if (isActive) this.showWithAnim(this.targetEl, duration);
    else this.hideWithAnim(this.targetEl, duration);
  }

  private showWithAnim(element: HTMLElement, duration: number): void {
    if (!this.host.isBrowser) return;
    const { renderer } = this.host;
    renderer.setStyle(element, 'display', 'block');
    renderer.setStyle(element, 'opacity', '0');
    renderer.setStyle(element, 'transition', `opacity ${duration}ms ease-in-out`);

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        renderer.setStyle(element, 'opacity', '1');
        this.setClass(renderer, element, 'show', true);
        this.setClass(renderer, element, 'active', true);
      });
    }
  }

  private hideWithAnim(element: HTMLElement, duration: number): void {
    if (!this.host.isBrowser) return;
    const { renderer } = this.host;
    renderer.setStyle(element, 'transition', `opacity ${duration}ms ease-in-out`);
    renderer.setStyle(element, 'opacity', '0');

    const hostWindow = this.host.window ?? this.getHostWindow();
    if (!hostWindow) return;

    this.animationTimeout = hostWindow.setTimeout(() => {
      renderer.setStyle(element, 'display', 'none');
      this.setClass(renderer, element, 'show', false);
      this.setClass(renderer, element, 'active', false);
      this.animationTimeout = null;
    }, duration);
  }

  private clearAnimationTimeout(): void {
    if (this.animationTimeout === null) return;
    const hostWindow = this.host.window ?? this.getHostWindow();
    hostWindow?.clearTimeout(this.animationTimeout);
    this.animationTimeout = null;
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.clearAnimationTimeout();
      this.baseCleanup();
      this.toggleEl = null;
      this.targetEl = null;
    }, 'Cleanup failed');
  }
}
