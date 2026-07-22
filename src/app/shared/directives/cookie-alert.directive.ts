import {
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
import { mergeOptionsIfChanged, runSafely, setOptionIfChanged } from './shared/directive-helpers';

export interface CookieAlertOptions {
  cookieName?: string;
  cookieValue?: string;
  cookieExpiryDays?: number;
  cookiePath?: string;
  cookieDomain?: string;
  cookieSecure?: boolean;
  cookieSameSite?: 'Strict' | 'Lax' | 'None';
  showOnLoad?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  position?: 'top' | 'bottom' | 'fixed-top' | 'fixed-bottom';
  theme?: 'light' | 'dark' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  dismissible?: boolean;
  animation?: boolean;
  animationDuration?: number;
  zIndex?: number;
  message?: string;
  acceptButtonText?: string;
  declineButtonText?: string;
  showDeclineButton?: boolean;
  learnMoreUrl?: string;
  learnMoreText?: string;
  learnMoreTarget?: '_blank' | '_self' | '_parent' | '_top';
  customClass?: string;
  customStyle?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

export interface CookieAlertValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface CookieAlertError {
  code: string;
  message: string;
  details?: unknown;
}

const DEFAULT_OPTIONS: Partial<CookieAlertOptions> = {
  cookieName: 'cookiealert',
  cookieValue: 'accepted',
  cookieExpiryDays: 365,
  cookiePath: '/',
  cookieDomain: '',
  cookieSecure: false,
  cookieSameSite: 'Lax',
  showOnLoad: true,
  autoHide: false,
  autoHideDelay: 5000,
  position: 'bottom',
  theme: 'light',
  dismissible: true,
  animation: true,
  animationDuration: 300,
  zIndex: 9999,
  message: 'We use cookies to ensure you get the best experience on our website.',
  acceptButtonText: 'I agree',
  declineButtonText: 'Decline',
  showDeclineButton: false,
  learnMoreUrl: 'https://cookiesandyou.com/',
  learnMoreText: 'Learn more',
  learnMoreTarget: '_blank',
  customClass: '',
  customStyle: '',
};

@Directive({
  selector: '[vlVeloraCookieAlert]',
  exportAs: 'veloraCookieAlert',
  standalone: true,
})
export class CookieAlertDirective
  extends BaseDirective<CookieAlertOptions, CookieAlertError>
  implements OnInit
{
  private readonly host = useDirectiveHost();

  private alertElement: HTMLElement | null = null;
  private acceptButton: HTMLElement | null = null;
  private declineButton: HTMLElement | null = null;
  private learnMoreLink: HTMLElement | null = null;
  private autoHideTimeout: number | null = null;
  private retryTimeout: number | null = null;
  private readonly directiveTimeouts = new Set<number>();
  private eventUnlisteners: Array<() => void> = [];
  private retryCount = 0;
  private readonly maxRetries = 3;

  private readonly _isVisible = signal<boolean>(false);
  private readonly _isAccepted = signal<boolean>(false);
  private readonly _isDeclined = signal<boolean>(false);
  private readonly _cookieExists = signal<boolean>(false);

  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;
  readonly isVisible = computed(() => this._isVisible());
  readonly isAccepted = computed(() => this._isAccepted());
  readonly isDeclined = computed(() => this._isDeclined());
  readonly cookieExists = computed(() => this._cookieExists());

  readonly cookieAlertCookieName = input<string>();
  readonly cookieAlertCookieValue = input<string>();
  readonly cookieAlertCookieExpiryDays = input<number>();
  readonly cookieAlertCookiePath = input<string>();
  readonly cookieAlertCookieDomain = input<string>();
  readonly cookieAlertCookieSecure = input<boolean>();
  readonly cookieAlertCookieSameSite = input<CookieAlertOptions['cookieSameSite']>();
  readonly cookieAlertShowOnLoad = input<boolean>();
  readonly cookieAlertAutoHide = input<boolean>();
  readonly cookieAlertAutoHideDelay = input<number>();
  readonly cookieAlertPosition = input<CookieAlertOptions['position']>();
  readonly cookieAlertTheme = input<CookieAlertOptions['theme']>();
  readonly cookieAlertDismissible = input<boolean>();
  readonly cookieAlertAnimation = input<boolean>();
  readonly cookieAlertAnimationDuration = input<number>();
  readonly cookieAlertZIndex = input<number>();
  readonly cookieAlertMessage = input<string>();
  readonly cookieAlertAcceptButtonText = input<string>();
  readonly cookieAlertDeclineButtonText = input<string>();
  readonly cookieAlertShowDeclineButton = input<boolean>();
  readonly cookieAlertLearnMoreUrl = input<string>();
  readonly cookieAlertLearnMoreText = input<string>();
  readonly cookieAlertLearnMoreTarget = input<CookieAlertOptions['learnMoreTarget']>();
  readonly cookieAlertCustomClass = input<string>();
  readonly cookieAlertCustomStyle = input<string>();

  readonly acceptEvent = output<void>();
  readonly declineEvent = output<void>();
  readonly showEvent = output<void>();
  readonly hideEvent = output<void>();
  readonly errorEvent = output<CookieAlertError>();
  readonly validationChange = output<CookieAlertValidationResult>();

  constructor() {
    super(inject(LoggerService), 'CookieAlertDirective', { ...DEFAULT_OPTIONS });
    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    const bindings = [
      { input: this.cookieAlertCookieName, key: 'cookieName' as const },
      { input: this.cookieAlertCookieValue, key: 'cookieValue' as const },
      { input: this.cookieAlertCookieExpiryDays, key: 'cookieExpiryDays' as const },
      { input: this.cookieAlertCookiePath, key: 'cookiePath' as const },
      { input: this.cookieAlertCookieDomain, key: 'cookieDomain' as const },
      { input: this.cookieAlertCookieSecure, key: 'cookieSecure' as const },
      { input: this.cookieAlertCookieSameSite, key: 'cookieSameSite' as const },
      { input: this.cookieAlertShowOnLoad, key: 'showOnLoad' as const },
      { input: this.cookieAlertAutoHide, key: 'autoHide' as const },
      { input: this.cookieAlertAutoHideDelay, key: 'autoHideDelay' as const },
      { input: this.cookieAlertPosition, key: 'position' as const },
      { input: this.cookieAlertTheme, key: 'theme' as const },
      { input: this.cookieAlertDismissible, key: 'dismissible' as const },
      { input: this.cookieAlertAnimation, key: 'animation' as const },
      { input: this.cookieAlertAnimationDuration, key: 'animationDuration' as const },
      { input: this.cookieAlertZIndex, key: 'zIndex' as const },
      { input: this.cookieAlertMessage, key: 'message' as const },
      { input: this.cookieAlertAcceptButtonText, key: 'acceptButtonText' as const },
      { input: this.cookieAlertDeclineButtonText, key: 'declineButtonText' as const },
      { input: this.cookieAlertShowDeclineButton, key: 'showDeclineButton' as const },
      { input: this.cookieAlertLearnMoreUrl, key: 'learnMoreUrl' as const },
      { input: this.cookieAlertLearnMoreText, key: 'learnMoreText' as const },
      { input: this.cookieAlertLearnMoreTarget, key: 'learnMoreTarget' as const },
      { input: this.cookieAlertCustomClass, key: 'customClass' as const },
      { input: this.cookieAlertCustomStyle, key: 'customStyle' as const },
    ];
    this.bindInputs(bindings);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.syncInputsToOptions();
    this.initialize();
    this.host.destroyRef.onDestroy(() => this.destroy());
  }

  private syncInputsToOptions(): void {
    const inputMap: Array<{ input: () => unknown; key: keyof CookieAlertOptions }> = [
      { input: this.cookieAlertCookieName, key: 'cookieName' },
      { input: this.cookieAlertCookieValue, key: 'cookieValue' },
      { input: this.cookieAlertCookieExpiryDays, key: 'cookieExpiryDays' },
      { input: this.cookieAlertCookiePath, key: 'cookiePath' },
      { input: this.cookieAlertCookieDomain, key: 'cookieDomain' },
      { input: this.cookieAlertCookieSecure, key: 'cookieSecure' },
      { input: this.cookieAlertCookieSameSite, key: 'cookieSameSite' },
      { input: this.cookieAlertShowOnLoad, key: 'showOnLoad' },
      { input: this.cookieAlertAutoHide, key: 'autoHide' },
      { input: this.cookieAlertAutoHideDelay, key: 'autoHideDelay' },
      { input: this.cookieAlertPosition, key: 'position' },
      { input: this.cookieAlertTheme, key: 'theme' },
      { input: this.cookieAlertDismissible, key: 'dismissible' },
      { input: this.cookieAlertAnimation, key: 'animation' },
      { input: this.cookieAlertAnimationDuration, key: 'animationDuration' },
      { input: this.cookieAlertZIndex, key: 'zIndex' },
      { input: this.cookieAlertMessage, key: 'message' },
      { input: this.cookieAlertAcceptButtonText, key: 'acceptButtonText' },
      { input: this.cookieAlertDeclineButtonText, key: 'declineButtonText' },
      { input: this.cookieAlertShowDeclineButton, key: 'showDeclineButton' },
      { input: this.cookieAlertLearnMoreUrl, key: 'learnMoreUrl' },
      { input: this.cookieAlertLearnMoreText, key: 'learnMoreText' },
      { input: this.cookieAlertLearnMoreTarget, key: 'learnMoreTarget' },
      { input: this.cookieAlertCustomClass, key: 'customClass' },
      { input: this.cookieAlertCustomStyle, key: 'customStyle' },
    ];

    inputMap.forEach(({ input, key }) => {
      const value = input();
      if (value !== undefined) {
        this.updateOption(key, value as CookieAlertOptions[typeof key]);
      }
    });
  }

  protected override updateOption<K extends keyof CookieAlertOptions>(
    key: K,
    value: CookieAlertOptions[K]
  ): boolean {
    if (value === undefined) return false;
    const changed = setOptionIfChanged(this.optionsManager, key, value);
    if (changed && this.isBaseInitialized()) {
      this.reinitialize();
    }
    return changed;
  }

  private initialize(): void {
    this.status.setLoading(true);
    this.status.setError(null);
    this.checkCookieExists();

    const options = this.optionsManager.snapshot();

    if (options.showOnLoad && !this._cookieExists()) {
      this.createAlert();
    } else {
      this.status.setLoading(false);
      this.status.setActive(false);
    }
  }

  private createAlert(): void {
    runSafely(
      () => {
        const options = this.optionsManager.snapshot();

        this.alertElement = this.host.renderer.createElement('div');
        this.host.renderer.addClass(this.alertElement, 'alert');
        this.host.renderer.addClass(this.alertElement, 'text-center');
        this.host.renderer.addClass(this.alertElement, 'cookiealert');
        this.host.renderer.setAttribute(this.alertElement, 'role', 'alert');

        if (options.customClass) {
          this.host.renderer.addClass(this.alertElement, options.customClass);
        }

        if (options.customStyle) {
          this.host.renderer.setStyle(this.alertElement, 'cssText', options.customStyle);
        }

        this.host.renderer.addClass(this.alertElement, `alert-${options.theme}`);
        this.setPosition(options.position);
        this.host.renderer.setStyle(this.alertElement, 'z-index', (options.zIndex ?? 1099).toString());

        this.createContent();
        this.host.renderer.appendChild(this.host.document.body, this.alertElement);
        this.bindEvents();
        this.showAlert();

        if (options.autoHide) {
          this.scheduleAutoHide();
        }

        this.status.setActive(true);
        this.status.setLoading(false);
        this.status.setError(null);
        this.markBaseInitialized();
      },
      (error) => this.handleError('Failed to create cookie alert', error)
    );
  }

  private createContent(): void {
    if (!this.alertElement) return;

    const options = this.optionsManager.snapshot();

    const messageSpan = this.host.renderer.createElement('span');
    this.host.renderer.setProperty(messageSpan, 'innerHTML', options.message);
    this.host.renderer.appendChild(this.alertElement, messageSpan);

    if (options.learnMoreUrl) {
      this.learnMoreLink = this.host.renderer.createElement('a');
      this.host.renderer.setProperty(this.learnMoreLink, 'textContent', options.learnMoreText);
      this.host.renderer.setAttribute(this.learnMoreLink, 'href', options.learnMoreUrl);
      this.host.renderer.setAttribute(this.learnMoreLink, 'target', options.learnMoreTarget ?? '_blank');
      this.host.renderer.setStyle(this.learnMoreLink, 'margin-left', '5px');
      this.host.renderer.appendChild(this.alertElement, this.learnMoreLink);
    }

    const buttonsContainer = this.host.renderer.createElement('div');
    this.host.renderer.setStyle(buttonsContainer, 'margin-top', '10px');

    this.acceptButton = this.host.renderer.createElement('button');
    this.host.renderer.addClass(this.acceptButton, 'btn');
    this.host.renderer.addClass(this.acceptButton, 'btn-primary');
    this.host.renderer.addClass(this.acceptButton, 'btn-sm');
    this.host.renderer.addClass(this.acceptButton, 'acceptcookies');
    this.host.renderer.setProperty(this.acceptButton, 'textContent', options.acceptButtonText);
    this.host.renderer.setAttribute(this.acceptButton, 'type', 'button');
    this.host.renderer.setStyle(this.acceptButton, 'margin-right', '10px');
    this.host.renderer.appendChild(buttonsContainer, this.acceptButton);

    if (options.showDeclineButton) {
      this.declineButton = this.host.renderer.createElement('button');
      this.host.renderer.addClass(this.declineButton, 'btn');
      this.host.renderer.addClass(this.declineButton, 'btn-secondary');
      this.host.renderer.addClass(this.declineButton, 'btn-sm');
      this.host.renderer.addClass(this.declineButton, 'declinecookies');
      this.host.renderer.setProperty(this.declineButton, 'textContent', options.declineButtonText);
      this.host.renderer.setAttribute(this.declineButton, 'type', 'button');
      this.host.renderer.appendChild(buttonsContainer, this.declineButton);
    }

    if (options.dismissible) {
      const dismissButton = this.host.renderer.createElement('button');
      this.host.renderer.addClass(dismissButton, 'btn-close');
      this.host.renderer.setAttribute(dismissButton, 'type', 'button');
      this.host.renderer.setAttribute(dismissButton, 'aria-label', 'Close');
      this.host.renderer.setStyle(dismissButton, 'margin-left', '10px');
      this.host.renderer.appendChild(buttonsContainer, dismissButton);
    }

    this.host.renderer.appendChild(this.alertElement, buttonsContainer);
  }

  private setPosition(position: CookieAlertOptions['position']): void {
    if (!this.alertElement) return;

    this.host.renderer.removeClass(this.alertElement, 'fixed-top');
    this.host.renderer.removeClass(this.alertElement, 'fixed-bottom');

    switch (position) {
      case 'top':
        this.host.renderer.setStyle(this.alertElement, 'position', 'fixed');
        this.host.renderer.setStyle(this.alertElement, 'top', '0');
        this.host.renderer.setStyle(this.alertElement, 'left', '0');
        this.host.renderer.setStyle(this.alertElement, 'right', '0');
        this.host.renderer.setStyle(this.alertElement, 'margin', '0');
        break;
      case 'bottom':
        this.host.renderer.setStyle(this.alertElement, 'position', 'fixed');
        this.host.renderer.setStyle(this.alertElement, 'bottom', '0');
        this.host.renderer.setStyle(this.alertElement, 'left', '0');
        this.host.renderer.setStyle(this.alertElement, 'right', '0');
        this.host.renderer.setStyle(this.alertElement, 'margin', '0');
        break;
      case 'fixed-top':
        this.host.renderer.addClass(this.alertElement, 'fixed-top');
        break;
      case 'fixed-bottom':
        this.host.renderer.addClass(this.alertElement, 'fixed-bottom');
        break;
    }
  }

  private bindEvents(): void {
    if (this.acceptButton) {
      const unlisten = this.host.renderer.listen(this.acceptButton, 'click', () => this.handleAccept());
      this.eventUnlisteners.push(unlisten);
    }

    if (this.declineButton) {
      const unlisten = this.host.renderer.listen(this.declineButton, 'click', () => this.handleDecline());
      this.eventUnlisteners.push(unlisten);
    }

    const dismissButtons = this.alertElement?.querySelectorAll('.btn-close');
    dismissButtons?.forEach((button) => {
      const unlisten = this.host.renderer.listen(button, 'click', () => this.handleDismiss());
      this.eventUnlisteners.push(unlisten);
    });
  }

  private handleAccept(): void {
    this.setCookie();
    this._isAccepted.set(true);
    this.acceptEvent.emit();

    const options = this.optionsManager.snapshot();
    runSafely(() => options.onAccept?.(), () => {});

    this.hideAlert();
  }

  private handleDecline(): void {
    this._isDeclined.set(true);
    this.declineEvent.emit();

    const options = this.optionsManager.snapshot();
    runSafely(() => options.onDecline?.(), () => {});

    this.hideAlert();
  }

  private handleDismiss(): void {
    this.hideAlert();
  }

  private setCookie(): void {
    const options = this.optionsManager.snapshot();
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (options.cookieExpiryDays ?? 365) * 24 * 60 * 60 * 1000);

    let cookieString = `${options.cookieName}=${options.cookieValue}; expires=${expiryDate.toUTCString()}; path=${options.cookiePath}`;

    if (options.cookieDomain) cookieString += `; domain=${options.cookieDomain}`;
    if (options.cookieSecure) cookieString += '; secure';
    if (options.cookieSameSite) cookieString += `; samesite=${options.cookieSameSite}`;

    this.host.document.cookie = cookieString;
    this._cookieExists.set(true);
  }

  private checkCookieExists(): void {
    const options = this.optionsManager.snapshot();
    const cookieValue = this.getCookie(options.cookieName ?? 'cookiealert');
    this._cookieExists.set(cookieValue === options.cookieValue);
  }

  private getCookie(name: string): string | null {
    if (!this.host.document?.cookie) return null;
    const nameEQ = name + '=';
    const ca = this.host.document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private showAlert(): void {
    if (!this.alertElement) return;

    const options = this.optionsManager.snapshot();

    if (options.animation) {
      this.host.renderer.setStyle(this.alertElement, 'opacity', '0');
      this.host.renderer.setStyle(this.alertElement, 'transform', 'translateY(100%)');
      this.host.renderer.setStyle(this.alertElement, 'transition', `all ${options.animationDuration}ms ease-in-out`);

      this.setDirectiveTimeout(() => {
        if (!this.alertElement) return;
        this.host.renderer.setStyle(this.alertElement, 'opacity', '1');
        this.host.renderer.setStyle(this.alertElement, 'transform', 'translateY(0)');
      }, 10);
    }

    this._isVisible.set(true);
    this.showEvent.emit();
    runSafely(() => options.onShow?.(), () => {});
  }

  private hideAlert(): void {
    if (!this.alertElement) return;

    const options = this.optionsManager.snapshot();

    if (options.animation) {
      this.host.renderer.setStyle(this.alertElement, 'opacity', '0');
      this.host.renderer.setStyle(this.alertElement, 'transform', 'translateY(100%)');
      this.setDirectiveTimeout(() => this.removeAlert(), options.animationDuration);
    } else {
      this.removeAlert();
    }

    this._isVisible.set(false);
    this.hideEvent.emit();
    runSafely(() => options.onHide?.(), () => {});
  }

  private removeAlert(): void {
    if (this.alertElement && this.alertElement.parentNode) {
      this.host.renderer.removeChild(this.alertElement.parentNode, this.alertElement);
      this.alertElement = null;
    }
  }

  private scheduleAutoHide(): void {
    const options = this.optionsManager.snapshot();
    this.clearAutoHideTimeout();
    this.autoHideTimeout = this.setDirectiveTimeout(() => this.hideAlert(), options.autoHideDelay);
  }

  private clearAutoHideTimeout(): void {
    this.clearDirectiveTimeout(this.autoHideTimeout);
  }

  private clearRetryTimeout(): void {
    this.clearDirectiveTimeout(this.retryTimeout);
  }

  private destroy(): void {
    this.clearAllDirectiveTimeouts();
    this.eventUnlisteners.forEach((unlisten) => unlisten());
    this.eventUnlisteners = [];
    this.removeAlert();
    this.status.setActive(false);
    this.status.setLoading(false);
    this.status.setError(null);
    this._isVisible.set(false);
    this.baseCleanup();
  }

  private handleError(message: string, error: Error): void {
    this.logger.error(message, 'CookieAlertDirective', { error: error.message });

    const cookieAlertError: CookieAlertError = {
      code: 'COOKIE_ALERT_ERROR',
      message: error.message,
      details: { originalMessage: message, stack: error.stack },
    };

    this.status.setError(cookieAlertError);
    this.errorEvent.emit(cookieAlertError);

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.clearRetryTimeout();
      this.retryTimeout = this.setDirectiveTimeout(() => this.initialize(), 1000 * this.retryCount);
    } else {
      this.status.setLoading(false);
    }
  }

  private setDirectiveTimeout(callback: () => void, delay?: number): number {
    let timeoutId: number;
    const run = (): void => {
      if (!this.directiveTimeouts.delete(timeoutId)) return;
      if (this.autoHideTimeout === timeoutId) this.autoHideTimeout = null;
      if (this.retryTimeout === timeoutId) this.retryTimeout = null;
      callback();
    };
    const setTimeoutFn = this.host.window?.setTimeout?.bind(this.host.window);
    timeoutId = (setTimeoutFn
      ? setTimeoutFn(run, delay)
      : globalThis.setTimeout(run, delay)) as number;
    this.directiveTimeouts.add(timeoutId);
    return timeoutId;
  }

  private clearDirectiveTimeout(timeoutId: number | null): void {
    if (timeoutId === null) return;
    this.directiveTimeouts.delete(timeoutId);
    if (this.autoHideTimeout === timeoutId) this.autoHideTimeout = null;
    if (this.retryTimeout === timeoutId) this.retryTimeout = null;
    const clearTimeoutFn = this.host.window?.clearTimeout?.bind(this.host.window);
    if (clearTimeoutFn) {
      clearTimeoutFn(timeoutId);
    } else {
      globalThis.clearTimeout(timeoutId);
    }
  }

  private clearAllDirectiveTimeouts(): void {
    [...this.directiveTimeouts].forEach((timeoutId) => this.clearDirectiveTimeout(timeoutId));
    this.autoHideTimeout = null;
    this.retryTimeout = null;
  }

  private reinitialize(): void {
    this.destroy();
    this.retryCount = 0;
    this.initialize();
  }

  private validate(): CookieAlertValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const options = this.optionsManager.snapshot();

    if (!options.cookieName || options.cookieName.trim() === '') {
      errors.push('Cookie name is required');
    }

    if ((options.cookieExpiryDays ?? 365) <= 0) {
      warnings.push('Cookie expiry days should be greater than 0');
    }

    if (options.autoHide && (options.autoHideDelay ?? 5000) <= 0) {
      warnings.push('Auto hide delay should be greater than 0 when auto hide is enabled');
    }

    return { isValid: errors.length === 0, warnings, errors };
  }

  show(): void {
    if (!this._cookieExists()) {
      this.createAlert();
    }
  }

  hide(): void {
    this.hideAlert();
  }

  accept(): void {
    this.handleAccept();
  }

  decline(): void {
    this.handleDecline();
  }

  hasCookie(): boolean {
    return this._cookieExists();
  }

  getCookieValue(): string | null {
    const options = this.optionsManager.snapshot();
    return this.getCookie(options.cookieName ?? 'cookiealert');
  }

  removeCookie(): void {
    const options = this.optionsManager.snapshot();
    this.host.document.cookie = `${options.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${options.cookiePath}`;
    this._cookieExists.set(false);
  }

  updateOptions(newOptions: Partial<CookieAlertOptions>): void {
    mergeOptionsIfChanged(this.optionsManager, newOptions, () => this.reinitialize());
  }

  refresh(): void {
    this.reinitialize();
  }

  recreate(): void {
    this.destroy();
    this.retryCount = 0;
    this.initialize();
  }

  getOptions(): CookieAlertOptions {
    return this.optionsManager.snapshot();
  }

  getError(): CookieAlertError | null {
    return this.status.getError();
  }

  clearError(): void {
    this.status.setError(null);
  }

  getValidationResult(): CookieAlertValidationResult {
    return this.validate();
  }

  reset(): void {
    this.destroy();
    this.retryCount = 0;
    this.status.setError(null);
    this.status.setLoading(false);
    this.status.setActive(false);
    this._isVisible.set(false);
    this._isAccepted.set(false);
    this._isDeclined.set(false);
    this._cookieExists.set(false);
  }
}
