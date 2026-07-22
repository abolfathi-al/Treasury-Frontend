import {
  AfterViewInit,
  Directive,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { InputEffectBinding } from './shared/directive-helpers';

export interface PasswordMeterOptions {
  minLength: number;
  checkUppercase: boolean;
  checkLowercase: boolean;
  checkDigit: boolean;
  checkChar: boolean;
  scoreHighlightClass: string;
  inputSelector: string;
  visibilitySelector: string;
  highlightSelector: string;
}

const DEFAULT_OPTIONS: Required<PasswordMeterOptions> = {
  minLength: 8,
  checkUppercase: true,
  checkLowercase: true,
  checkDigit: true,
  checkChar: true,
  scoreHighlightClass: 'bg-success',
  inputSelector: 'input[type]',
  visibilitySelector: '[data-velora-password-meter-control="visibility"]',
  highlightSelector: '[data-velora-password-meter-control="highlight"]',
} as const;

const instances = new WeakMap<HTMLElement, PasswordMeterDirective>();

@Directive({
  selector: '[vlVeloraPasswordMeter]',
  exportAs: 'vlVeloraPasswordMeter',
  standalone: true,
})
export class PasswordMeterDirective
  extends BaseDirective<PasswordMeterOptions, string>
  implements OnInit, AfterViewInit
{
  private readonly host = useDirectiveHost();

  private inputElement: HTMLInputElement | null = null;
  private visibilityElement: HTMLElement | null = null;
  private highlightElements: HTMLElement[] = [];

  private readonly _score = signal<number>(0);
  private readonly _isVisible = signal<boolean>(false);
  private readonly _isActivated = signal<boolean>(true);

  readonly score = computed(() => this._score());
  readonly isVisible = computed(() => this._isVisible());
  readonly isActivated = computed(() => this._isActivated());

  readonly passwordMeterOptions = input<PasswordMeterOptions>();
  readonly passwordMeterActivate = input<boolean>();
  readonly passwordMeterMinLength = input<number>();
  readonly passwordMeterCheckUppercase = input<boolean>();
  readonly passwordMeterCheckLowercase = input<boolean>();
  readonly passwordMeterCheckDigit = input<boolean>();
  readonly passwordMeterCheckChar = input<boolean>();
  readonly passwordMeterScoreHighlightClass = input<string>();
  readonly passwordMeterInputSelector = input<string>();
  readonly passwordMeterVisibilitySelector = input<string>();
  readonly passwordMeterHighlightSelector = input<string>();

  readonly passwordMeterChange = output<number>();
  readonly passwordMeterScoreChange = output<number>();
  readonly passwordMeterVisibilityChange = output<boolean>();

  constructor() {
    super(inject(LoggerService), 'PasswordMeterDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    const bindings: InputEffectBinding<PasswordMeterOptions>[] = [
      { input: this.passwordMeterMinLength, key: 'minLength' },
      { input: this.passwordMeterCheckUppercase, key: 'checkUppercase' },
      { input: this.passwordMeterCheckLowercase, key: 'checkLowercase' },
      { input: this.passwordMeterCheckDigit, key: 'checkDigit' },
      { input: this.passwordMeterCheckChar, key: 'checkChar' },
      { input: this.passwordMeterScoreHighlightClass, key: 'scoreHighlightClass' },
      { input: this.passwordMeterInputSelector, key: 'inputSelector' },
      { input: this.passwordMeterVisibilitySelector, key: 'visibilitySelector' },
      { input: this.passwordMeterHighlightSelector, key: 'highlightSelector' },
    ];
    this.bindInputs(bindings, () => this.handleOptsUpdated());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    if (!this.shouldInit()) return;

    this.executeSafely(() => {
      this.initPasswordMeter();
      this.markBaseInitialized();
    }, 'Initialization failed');
  }

  ngAfterViewInit(): void {
    if (!this.host.isBrowser || !this.isBaseInitialized()) return;

    this.executeSafely(() => {
      this.queryElements();
      this.setupListeners();
      this.setInitialIconState();
    }, 'AfterViewInit setup failed');
  }

  toggleVisibility(): void {
    if (!this.isBaseInitialized()) return;

    this.executeSafely(() => {
      const newVisibility = !this._isVisible();
      this._isVisible.set(newVisibility);
      this.updateInputType(newVisibility);
      this.passwordMeterVisibilityChange.emit(newVisibility);
    }, 'Visibility toggle failed');
  }

  getScore(): number {
    return this._score();
  }

  private shouldInit(): boolean {
    return !!this.host.elementRef.nativeElement && this._isActivated();
  }

  private initPasswordMeter(): void {
    this.status.setLoading(true);
    this.status.setError(null);

    this.queryElements();
    this.setupListeners();
    instances.set(this.host.elementRef.nativeElement, this);
    this.setInitialIconState();

    if (this.inputElement) {
      this.applyPasswordScore(this.inputElement.value);
    }

    this.status.setActive(true);
    this.status.setLoading(false);
  }

  private queryElements(): void {
    const options = this.optionsManager.snapshot();
    const host = this.host.elementRef.nativeElement;
    this.inputElement = host.querySelector<HTMLInputElement>(options.inputSelector);
    this.visibilityElement = host.querySelector<HTMLElement>(options.visibilitySelector);
    this.highlightElements = Array.from(
      host.querySelectorAll<HTMLElement>(options.highlightSelector)
    );
  }

  private setupListeners(): void {
    this.clearBaseDomListeners();
    if (this.inputElement) {
      this.addBaseDomListener(this.inputElement, 'input', () => this.handleInputChange());
    }
    if (this.visibilityElement) {
      this.addBaseDomListener(this.visibilityElement, 'click', () => this.toggleVisibility());
    }
  }

  private handleInputChange(): void {
    this.executeSafely(() => {
      if (!this.inputElement) return;
      this.applyPasswordScore(this.inputElement.value);
    }, 'Input change handling failed');
  }

  private applyPasswordScore(password: string): void {
    const score = this.calculateScore(password);
    this._score.set(score);
    this.updateHighlightElements(score);
    this.passwordMeterChange.emit(score);
    this.passwordMeterScoreChange.emit(score);
  }

  private calculateScore(password: string): number {
    const options = this.optionsManager.snapshot();
    let score = 0;
    let maxScore = 0;

    if (password.length >= options.minLength) score += 1;
    maxScore += 1;

    if (options.checkUppercase) {
      if (/[A-Z]/.test(password)) score += 1;
      maxScore += 1;
    }

    if (options.checkLowercase) {
      if (/[a-z]/.test(password)) score += 1;
      maxScore += 1;
    }

    if (options.checkDigit) {
      if (/\d/.test(password)) score += 1;
      maxScore += 1;
    }

    if (options.checkChar) {
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      maxScore += 1;
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }

  private updateHighlightElements(score: number): void {
    const { scoreHighlightClass } = this.optionsManager.snapshot();
    this.highlightElements.forEach((element, index) => {
      const threshold = ((index + 1) / this.highlightElements.length) * 100;
      this.setClass(this.host.renderer, element, scoreHighlightClass, score >= threshold);
    });
  }

  private updateInputType(isVisible: boolean): void {
    if (this.inputElement) {
      this.host.renderer.setAttribute(this.inputElement, 'type', isVisible ? 'text' : 'password');
    }
    this.updateVisibilityIcons(isVisible);
  }

  private updateVisibilityIcons(isVisible: boolean): void {
    if (!this.visibilityElement || !this.host.isBrowser) return;

    const { hideIcon, showIcon } = this.getVisibilityIcons();
    const toShow = isVisible ? hideIcon : showIcon;
    const toHide = isVisible ? showIcon : hideIcon;

    const { renderer } = this.host;
    if (toShow) {
      renderer.removeClass(toShow, 'd-none');
      renderer.setStyle(toShow, 'display', 'inline-flex', 1);
    }
    if (toHide) {
      renderer.addClass(toHide, 'd-none');
      renderer.setStyle(toHide, 'display', 'none', 1);
    }
  }

  private getVisibilityIcons(): { hideIcon: HTMLElement | null; showIcon: HTMLElement | null } {
    if (!this.visibilityElement) return { hideIcon: null, showIcon: null };

    const candidates = Array.from(
      this.visibilityElement.querySelectorAll<HTMLElement>('app-velora-icon, i, .svg-icon')
    );
    return { hideIcon: candidates[0] || null, showIcon: candidates[1] || null };
  }

  private setInitialIconState(): void {
    this.updateVisibilityIcons(false);
  }

  private handleOptsUpdated(): void {
    if (!this.isBaseInitialized()) return;

    this.executeSafely(() => {
      this.queryElements();
      this.setupListeners();
      if (this.inputElement) {
        this.applyPasswordScore(this.inputElement.value);
      }
    }, 'Options refresh failed');
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.baseCleanup();
      instances.delete(this.host.elementRef.nativeElement);
      this.inputElement = null;
      this.visibilityElement = null;
      this.highlightElements = [];
      this._isVisible.set(false);
    }, 'Cleanup failed');
  }
}
