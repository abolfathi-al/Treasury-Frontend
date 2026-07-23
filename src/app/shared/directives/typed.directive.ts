import {
  Directive,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type Typed from 'typed.js';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely, setOptionIfChanged } from './shared/directive-helpers';

export interface TypedOptions {
  strings?: string[];
  stringsElement?: string | Element | undefined;
  typeSpeed?: number;
  startDelay?: number;
  backSpeed?: number;
  smartBackspace?: boolean;
  shuffle?: boolean;
  backDelay?: number;
  fadeOut?: boolean;
  fadeOutClass?: string;
  fadeOutDelay?: number;
  loop?: boolean;
  loopCount?: number;
  showCursor?: boolean;
  cursorChar?: string;
  autoInsertCss?: boolean;
  attr?: string | undefined;
  bindInputFocusEvents?: boolean;
  contentType?: 'html' | undefined;
}

export interface TypedError {
  message: string;
  code: string;
  timestamp: Date;
}

export interface TypedValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const DEFAULT_OPTIONS: TypedOptions = {
  strings: ['Welcome to Typed.js!', 'This is a typing animation library.'],
  typeSpeed: 50,
  startDelay: 0,
  backSpeed: 0,
  smartBackspace: true,
  shuffle: false,
  backDelay: 700,
  fadeOut: false,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500,
  loop: false,
  loopCount: Infinity,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
  bindInputFocusEvents: false,
  contentType: 'html',
};

@Directive({
  selector: '[vlVeloraTyped]',
  standalone: true,
  exportAs: 'veloraTyped',
})
export class TypedDirective
  extends BaseDirective<TypedOptions, TypedError>
  implements OnInit
{
  private readonly host = useDirectiveHost();

  private instance: Typed | null = null;
  private TypedClass: typeof Typed | null = null;
  private retryCount = 0;
  private readonly maxRetries = 3;

  private readonly _currentString = signal<string>('');
  private readonly _currentIndex = signal<number>(0);
  private readonly _isComplete = signal(false);
  private readonly _isPaused = signal(false);

  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;
  readonly currentString = this._currentString.asReadonly();
  readonly currentIndex = this._currentIndex.asReadonly();
  readonly isComplete = this._isComplete.asReadonly();
  readonly isPaused = this._isPaused.asReadonly();

  readonly typedStrings = input<string[]>();
  readonly typedStringsElement = input<string | Element>();
  readonly typedTypeSpeed = input<number>();
  readonly typedStartDelay = input<number>();
  readonly typedBackSpeed = input<number>();
  readonly typedSmartBackspace = input<boolean>();
  readonly typedShuffle = input<boolean>();
  readonly typedBackDelay = input<number>();
  readonly typedFadeOut = input<boolean>();
  readonly typedFadeOutClass = input<string>();
  readonly typedFadeOutDelay = input<number>();
  readonly typedLoop = input<boolean>();
  readonly typedLoopCount = input<number>();
  readonly typedShowCursor = input<boolean>();
  readonly typedCursorChar = input<string>();
  readonly typedAutoInsertCss = input<boolean>();
  readonly typedAttr = input<string>();
  readonly typedBindInputFocusEvents = input<boolean>();
  readonly typedContentType = input<'html'>();

  readonly typedBegin = output<void>();
  readonly typedComplete = output<void>();
  readonly typedPreStringTyped = output<number>();
  readonly typedStringTyped = output<number>();
  readonly typedLastStringBackspaced = output<void>();
  readonly typedTypingPaused = output<number>();
  readonly typedTypingResumed = output<number>();
  readonly typedReset = output<void>();
  readonly typedStop = output<number>();
  readonly typedStart = output<number>();
  readonly typedDestroy = output<void>();
  readonly typedError = output<TypedError>();

  constructor() {
    super(inject(LoggerService), 'TypedDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.destroyTyped();
    });
    this.setupBindings();
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    import('typed.js')
      .then((TypedModule) => {
        if (this.isBaseDestroyed()) return;
        this.TypedClass = TypedModule.default || TypedModule;
        this.initTyped();
      })
      .catch((error) => {
        this.handleErr('Failed to load Typed.js library', error as Error, true);
      });
  }

  startTyping(): void {
    runSafely(
      () => {
        if (!this.instance) return;
        this.instance.start();
        this._isPaused.set(false);
        this.typedStart.emit(this._currentIndex());
      },
      (error) => this.handleErr('Failed to start typing', error)
    );
  }

  stopTyping(): void {
    runSafely(
      () => {
        if (!this.instance) return;
        this.instance.stop();
        this._isPaused.set(true);
        this.typedStop.emit(this._currentIndex());
      },
      (error) => this.handleErr('Failed to stop typing', error)
    );
  }

  resetTyping(): void {
    runSafely(
      () => {
        if (!this.instance) return;
        this.instance.reset();
        this._isComplete.set(false);
        this._isPaused.set(false);
        this._currentIndex.set(0);
        this._currentString.set('');
        this.typedReset.emit();
      },
      (error) => this.handleErr('Failed to reset typing', error)
    );
  }

  toggleTyping(): void {
    if (this._isPaused()) this.startTyping();
    else this.stopTyping();
  }

  getTypingState(): {
    isActive: boolean;
    isLoading: boolean;
    isComplete: boolean;
    isPaused: boolean;
    currentString: string;
    currentIndex: number;
    error: TypedError | null;
  } {
    const { isActive, isLoading, error } = this.status.snapshot();
    return {
      isActive,
      isLoading,
      isComplete: this._isComplete(),
      isPaused: this._isPaused(),
      currentString: this._currentString(),
      currentIndex: this._currentIndex(),
      error,
    };
  }

  updateStrings(strings: string[]): void {
    if (!this.instance || !strings || strings.length === 0) return;
    if (this.updateOption('strings', strings)) this.recreateTyped();
  }

  updateTypeSpeed(speed: number): void {
    if (!this.instance || speed < 0) return;
    if (this.updateOption('typeSpeed', speed)) this.recreateTyped();
  }

  updateBackSpeed(speed: number): void {
    if (!this.instance || speed < 0) return;
    if (this.updateOption('backSpeed', speed)) this.recreateTyped();
  }

  isValidTyped(): boolean {
    return this.instance !== null && this.isBaseInitialized();
  }

  getOptions(): TypedOptions {
    return { ...this.optionsManager.snapshot() };
  }

  recreateTyped(): void {
    if (!this.host.isBrowser || !this.TypedClass) return;
    this.destroyTyped();
    this.retryCount = 0;
    this.initTyped();
  }

  protected override updateOption<K extends keyof TypedOptions>(
    key: K,
    value: TypedOptions[K] | undefined
  ): boolean {
    return setOptionIfChanged(this.optionsManager, key, value);
  }

  private setupBindings(): void {
    const bindings = [
      { input: this.typedStrings, key: 'strings' as const },
      { input: this.typedStringsElement, key: 'stringsElement' as const },
      { input: this.typedTypeSpeed, key: 'typeSpeed' as const },
      { input: this.typedStartDelay, key: 'startDelay' as const },
      { input: this.typedBackSpeed, key: 'backSpeed' as const },
      { input: this.typedSmartBackspace, key: 'smartBackspace' as const },
      { input: this.typedShuffle, key: 'shuffle' as const },
      { input: this.typedBackDelay, key: 'backDelay' as const },
      { input: this.typedFadeOut, key: 'fadeOut' as const },
      { input: this.typedFadeOutClass, key: 'fadeOutClass' as const },
      { input: this.typedFadeOutDelay, key: 'fadeOutDelay' as const },
      { input: this.typedLoop, key: 'loop' as const },
      { input: this.typedLoopCount, key: 'loopCount' as const },
      { input: this.typedShowCursor, key: 'showCursor' as const },
      { input: this.typedCursorChar, key: 'cursorChar' as const },
      { input: this.typedAutoInsertCss, key: 'autoInsertCss' as const },
      { input: this.typedAttr, key: 'attr' as const },
      { input: this.typedBindInputFocusEvents, key: 'bindInputFocusEvents' as const },
      { input: this.typedContentType, key: 'contentType' as const },
    ];
    this.bindInputs(bindings, () => {
      if (this.isBaseInitialized() && !this.isBaseDestroyed()) {
        this.recreateTyped();
      }
    });
  }

  private initTyped(): void {
    const TypedCtor = this.TypedClass;
    if (!this.host.isBrowser || !TypedCtor) return;

    this.status.setLoading(true);
    this.status.setError(null);

    runSafely(
      () => {
        const options = this.optionsManager.snapshot();
        const validation = this.validate(options);

        if (!validation.isValid) {
          this.status.setLoading(false);
          return;
        }

        this.instance = new TypedCtor(this.host.elementRef.nativeElement, options);
        this.markBaseInitialized();
        this.retryCount = 0;
        this.status.setActive(true);
        this.status.setLoading(false);
      },
      (error) => this.handleErr('Failed to initialize Typed.js', error, true)
    );
  }

  private validate(options: TypedOptions): TypedValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!options.strings || options.strings.length === 0) {
      errors.push('Strings array cannot be empty');
    }

    if (options.typeSpeed !== undefined && options.typeSpeed < 0) {
      errors.push('Type speed must be non-negative');
    }

    if (options.backSpeed !== undefined && options.backSpeed < 0) {
      errors.push('Back speed must be non-negative');
    }

    if (options.loopCount !== undefined && options.loopCount < 0) {
      errors.push('Loop count must be non-negative');
    }

    if (
      options.stringsElement &&
      typeof options.stringsElement === 'string' &&
      !this.host.document.getElementById(options.stringsElement)
    ) {
      errors.push(`Strings element with ID '${options.stringsElement}' not found`);
    }

    if (options.strings && options.strings.some((str) => typeof str !== 'string')) {
      warnings.push('All strings should be of type string');
    }

    const result: TypedValidationResult = { isValid: errors.length === 0, errors, warnings };

    if (!result.isValid) {
      this.logger.error('Typed.js validation failed', 'TypedDirective', { errors: result.errors });
    }

    if (result.warnings.length > 0) {
      this.logger.error('Typed.js validation warnings', 'TypedDirective', { warnings: result.warnings });
    }

    return result;
  }

  private destroyTyped(): void {
    runSafely(
      () => {
        if (!this.instance) {
          this.status.setActive(false);
          this.status.setLoading(false);
          return;
        }
        this.instance.destroy();
        this.instance = null;
        this.baseCleanup();
        this.status.setActive(false);
        this._isComplete.set(false);
        this._isPaused.set(false);
        this.typedDestroy.emit();
      },
      (error) => this.handleErr('Failed to destroy Typed.js instance', error)
    );
  }

  private handleErr(message: string, error: Error, shouldRetry = false): void {
    const typedError: TypedError = {
      message: `${message}: ${error.message}`,
      code: 'TYPED_ERROR',
      timestamp: new Date(),
    };

    this.status.setError(typedError);
    this.status.setLoading(false);
    this.typedError.emit(typedError);

    this.logger.error(message, 'TypedDirective', { error: error.message });

    if (shouldRetry && this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.initTyped(), 1000 * this.retryCount);
    }
  }
}
