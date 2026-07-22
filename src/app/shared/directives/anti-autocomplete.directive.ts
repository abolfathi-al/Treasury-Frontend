import { Directive, OnInit, inject, input } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';

const CONSTANTS = {
  SELECTORS: {
    DIRECTIVE: '[vlAntiAutocomplete]',
    ANTI_AUTOCOMPLETE_ELEMENT: '.anti-autocomplete',
    DUMMY_USERNAME: 'input[name="username"], input[name="email"], input[name="user"]',
  },
  DEFAULTS: {
    AC_MODE: 'new-password',
    TARGET_SELECTOR: null,
    PREVENT_AUTOCOMPLETE: true,
    INJECT_DUMMY_USERNAME: true,
    RANDOMIZE_NAME: true,
    RENAME_ON_FOCUS: true,
    DEFER_PASSWORD_TYPE: false,
    MASK_TEXT_SECURITY: false,
    FORCE_BLUR_RESET: true,
  },
  DUMMY_INPUT_STYLES: {
    position: 'absolute',
    right: '-9999px',
    height: '0',
    width: '0',
    tabIndex: '-1',
  },
  RANDOM_NAME_PREFIX: 'velora_anti_autocomplete_',
  RANDOM_NAME_SUFFIX_LENGTH: 1000,
} as const;

const ATTRIBUTES = {
  AUTOCOMPLETE: 'autocomplete',
  AUTOCAPITALIZE: 'autocapitalize',
  AUTOCORRECT: 'autocorrect',
  SPELLCHECK: 'spellcheck',
  TYPE: 'type',
  NAME: 'name',
  DATA_ORIGINAL_TYPE: 'data-original-type',
} as const;

export type AutocompleteMode = 'off' | 'new-password' | 'current-password';

@Directive({
  selector: '[vlAntiAutocomplete]',
  standalone: true,
})
export class AntiAutocompleteDirective
  extends BaseDirective<Record<string, never>, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();

  readonly acMode = input<AutocompleteMode>(CONSTANTS.DEFAULTS.AC_MODE as AutocompleteMode);
  readonly targetSelector = input<string | null>(CONSTANTS.DEFAULTS.TARGET_SELECTOR);
  readonly preventAutocomplete = input<boolean>(CONSTANTS.DEFAULTS.PREVENT_AUTOCOMPLETE);
  readonly injectDummyUsername = input<boolean>(CONSTANTS.DEFAULTS.INJECT_DUMMY_USERNAME);
  readonly randomizeName = input<boolean>(CONSTANTS.DEFAULTS.RANDOMIZE_NAME);
  readonly renameOnFocus = input<boolean>(CONSTANTS.DEFAULTS.RENAME_ON_FOCUS);
  readonly deferPasswordType = input<boolean>(CONSTANTS.DEFAULTS.DEFER_PASSWORD_TYPE);
  readonly maskTextSecurity = input<boolean>(CONSTANTS.DEFAULTS.MASK_TEXT_SECURITY);
  readonly forceBlurReset = input<boolean>(CONSTANTS.DEFAULTS.FORCE_BLUR_RESET);

  constructor() {
    super(inject(LoggerService), 'AntiAutocompleteDirective', {});
    this.host.destroyRef.onDestroy(() => this.clearBaseDomListeners());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    const inputEl = this.resolveInput(this.host.elementRef.nativeElement);
    if (!inputEl) return;

    this.setupInputAttributes(inputEl);
    this.setupPasswordMasking(inputEl);
    this.setupNameRandomization(inputEl);
    this.setupFormConfiguration(inputEl);
    this.setupReadOnlyBehavior(inputEl);
  }

  private setupInputAttributes(inputEl: HTMLInputElement): void {
    const { renderer } = this.host;
    renderer.setAttribute(inputEl, ATTRIBUTES.AUTOCOMPLETE, this.acMode());
    renderer.setAttribute(inputEl, ATTRIBUTES.AUTOCAPITALIZE, 'off');
    renderer.setAttribute(inputEl, ATTRIBUTES.AUTOCORRECT, 'off');
    renderer.setAttribute(inputEl, ATTRIBUTES.SPELLCHECK, 'false');
  }

  private setupPasswordMasking(inputEl: HTMLInputElement): void {
    if (this.maskTextSecurity()) {
      this.host.renderer.setAttribute(inputEl, ATTRIBUTES.TYPE, 'text');
      this.host.renderer.setStyle(inputEl, '-webkit-text-security', 'disc');
    } else if (this.deferPasswordType()) {
      this.setupPasswordTypeDeferring(inputEl);
    }
  }

  private setupPasswordTypeDeferring(inputEl: HTMLInputElement): void {
    const { renderer } = this.host;
    const originalType = inputEl.getAttribute(ATTRIBUTES.TYPE) || 'password';
    renderer.setAttribute(inputEl, ATTRIBUTES.DATA_ORIGINAL_TYPE, originalType);
    renderer.setAttribute(inputEl, ATTRIBUTES.TYPE, 'text');

    const switchToPassword = () => {
      const targetType = inputEl.getAttribute(ATTRIBUTES.DATA_ORIGINAL_TYPE) || 'password';
      const currentValue = inputEl.value;
      renderer.setAttribute(inputEl, ATTRIBUTES.TYPE, targetType);
      renderer.setProperty(inputEl, 'value', currentValue);
    };

    this.addBaseDomListener(inputEl, 'keydown', switchToPassword);
    this.addBaseDomListener(inputEl, 'input', switchToPassword);
  }

  private setupNameRandomization(inputEl: HTMLInputElement): void {
    if (!this.randomizeName()) return;

    const { renderer } = this.host;
    renderer.setAttribute(inputEl, ATTRIBUTES.NAME, this.generateRandomName());

    if (this.renameOnFocus()) {
      this.addBaseDomListener(inputEl, 'focus', () => {
        renderer.setAttribute(inputEl, ATTRIBUTES.NAME, this.generateRandomName());
      });
    }
  }

  private setupFormConfiguration(inputEl: HTMLInputElement): void {
    const form = this.findParentForm(inputEl);
    if (!form) return;

    this.host.renderer.setAttribute(form, ATTRIBUTES.AUTOCOMPLETE, 'off');
    if (this.injectDummyUsername()) {
      this.ensureDummyUsername(form);
    }
  }

  private setupReadOnlyBehavior(inputEl: HTMLInputElement): void {
    if (!this.preventAutocomplete()) return;

    const { renderer } = this.host;
    renderer.setProperty(inputEl, 'readOnly', true);

    this.addBaseDomListener(inputEl, 'focus', () =>
      renderer.setProperty(inputEl, 'readOnly', false)
    );

    if (this.forceBlurReset()) {
      this.addBaseDomListener(inputEl, 'blur', () =>
        renderer.setProperty(inputEl, 'readOnly', true)
      );
    }
  }

  private resolveInput(host: HTMLElement): HTMLInputElement | null {
    if (host.tagName.toLowerCase() === 'input') {
      return host as HTMLInputElement;
    }

    const selector = this.targetSelector();
    if (selector) {
      return host.querySelector<HTMLInputElement>(selector) ?? null;
    }

    return (
      host.querySelector<HTMLInputElement>('input[type="password"]') ??
      host.querySelector<HTMLInputElement>('input') ??
      null
    );
  }

  private generateRandomName(): string {
    return `${CONSTANTS.RANDOM_NAME_PREFIX}${Date.now()}_${Math.floor(
      Math.random() * CONSTANTS.RANDOM_NAME_SUFFIX_LENGTH
    )}`;
  }

  private findParentForm(el: HTMLElement): HTMLFormElement | null {
    return el.closest('form');
  }

  private ensureDummyUsername(form: HTMLFormElement): void {
    if (form.querySelector(CONSTANTS.SELECTORS.DUMMY_USERNAME)) return;

    const { renderer } = this.host;
    const dummyInput = renderer.createElement('input') as HTMLInputElement;
    renderer.setAttribute(dummyInput, 'type', 'text');
    renderer.setAttribute(dummyInput, 'name', 'username');
    renderer.setAttribute(dummyInput, 'autocomplete', 'off');

    Object.entries(CONSTANTS.DUMMY_INPUT_STYLES).forEach(([property, value]) => {
      renderer.setStyle(dummyInput, property, String(value));
    });

    renderer.setAttribute(dummyInput, 'tabindex', '-1');
    renderer.setAttribute(dummyInput, 'aria-hidden', 'true');

    if (form.firstChild) {
      renderer.insertBefore(form, dummyInput, form.firstChild);
    } else {
      renderer.appendChild(form, dummyInput);
    }
  }
}
