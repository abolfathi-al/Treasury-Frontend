import {
  AfterViewInit,
  Directive,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface StepperOptions {
  activate?: boolean;
  startIndex?: number;
  loop?: boolean;
  contentSelector?: string;
  navSelector?: string;
  nextSelector?: string;
  prevSelector?: string;
  currentClass?: string;
  pendingClass?: string;
  completedClass?: string;
  stepActionSelector?: string;
  submitSelector?: string;
}

const DEFAULTS = {
  ACTIVATE: true,
  START_INDEX: 0,
  LOOP: false,
  CONTENT_SELECTOR: '[data-velora-stepper-element="content"]',
  NAV_SELECTOR: '[data-velora-stepper-element="nav"]',
  NEXT_SELECTOR: '[data-velora-stepper-action="next"]',
  PREV_SELECTOR: '[data-velora-stepper-action="previous"]',
  SUBMIT_SELECTOR: '[data-velora-stepper-action="submit"]',
  STEP_ACTION_SELECTOR: '[data-velora-stepper-action="step"]',
  CURRENT_CLASS: 'current',
  PENDING_CLASS: 'pending',
  COMPLETED_CLASS: 'completed',
} as const;

const DEFAULT_OPTIONS: Required<StepperOptions> = {
  activate: DEFAULTS.ACTIVATE,
  startIndex: DEFAULTS.START_INDEX,
  loop: DEFAULTS.LOOP,
  contentSelector: DEFAULTS.CONTENT_SELECTOR,
  navSelector: DEFAULTS.NAV_SELECTOR,
  nextSelector: DEFAULTS.NEXT_SELECTOR,
  prevSelector: DEFAULTS.PREV_SELECTOR,
  submitSelector: DEFAULTS.SUBMIT_SELECTOR,
  stepActionSelector: DEFAULTS.STEP_ACTION_SELECTOR,
  currentClass: DEFAULTS.CURRENT_CLASS,
  pendingClass: DEFAULTS.PENDING_CLASS,
  completedClass: DEFAULTS.COMPLETED_CLASS,
} as const;

@Directive({
  selector: '[vlVeloraStepper], [data-velora-stepper]',
  exportAs: 'vlVeloraStepper',
  standalone: true,
})
export class StepperDirective
  extends BaseDirective<StepperOptions, string>
  implements OnInit, AfterViewInit
{
  private readonly host = useDirectiveHost();

  private contentItems: HTMLElement[] = [];
  private navItems: HTMLElement[] = [];
  private animationTimeout: ReturnType<typeof setTimeout> | null = null;
  private hasAttemptedInitialization = false;
  private hasViewInitialized = false;

  private readonly _index = signal<number>(0);
  readonly index = computed(() => this._index());
  readonly count = computed(() => this.contentItems.length);

  public readonly instance = {
    goPrev: () => this.previous(),
    goNext: () => this.next(),
    goTo: (i: number) => this.goTo(i, 'api'),
    getCurrentStepIndex: () => this.getCurrentStepIndex(),
    getElement: () => this.host.elementRef.nativeElement,
  };

  readonly stepperOptions = input<StepperOptions>();
  readonly stepperActivate = input<boolean>();
  readonly stepperStartIndex = input<number>();
  readonly stepperLoop = input<boolean>();
  readonly stepperContentSelector = input<string>();
  readonly stepperNavSelector = input<string>();
  readonly stepperNextSelector = input<string>();
  readonly stepperPrevSelector = input<string>();
  readonly stepperCurrentClass = input<string>();
  readonly stepperPendingClass = input<string>();
  readonly stepperCompletedClass = input<string>();
  readonly stepperStepActionSelector = input<string>();
  readonly stepperSubmitSelector = input<string>();

  readonly stepperNext = output<{ from: number; to: number }>();
  readonly stepperPrevious = output<{ from: number; to: number }>();
  readonly stepperChange = output<{ from: number; to: number }>();
  readonly stepperChanged = output<{ current: number }>();
  readonly stepperClick = output<{ target: HTMLElement; index: number }>();
  readonly stepperSubmit = output<void>();

  constructor() {
    super(inject(LoggerService), 'StepperDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() =>
      this.executeSafely(() => this.cleanup(), 'Cleanup failed')
    );
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    effect(() => {
      const opts = this.stepperOptions();
      untracked(() => {
        if (opts !== undefined) this.mergeOpts(opts);
      });
    });

    effect(() => {
      const v = this.stepperStartIndex();
      untracked(() => {
        if (v !== undefined)
          this.updateOption(
            'startIndex',
            Number.isFinite(v) ? Math.max(0, Math.trunc(v)) : 0
          );
      });
    });

    const bindings = [
      { input: this.stepperActivate, key: 'activate' as const },
      { input: this.stepperLoop, key: 'loop' as const },
      { input: this.stepperContentSelector, key: 'contentSelector' as const },
      { input: this.stepperNavSelector, key: 'navSelector' as const },
      { input: this.stepperNextSelector, key: 'nextSelector' as const },
      { input: this.stepperPrevSelector, key: 'prevSelector' as const },
      { input: this.stepperCurrentClass, key: 'currentClass' as const },
      { input: this.stepperPendingClass, key: 'pendingClass' as const },
      { input: this.stepperCompletedClass, key: 'completedClass' as const },
      { input: this.stepperStepActionSelector, key: 'stepActionSelector' as const },
      { input: this.stepperSubmitSelector, key: 'submitSelector' as const },
    ];
    this.bindInputs(bindings);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.hasAttemptedInitialization = true;
    this.executeSafely(() => {
      if (!this.shouldInit()) return;
      this.initStepper();
    }, 'Initialization failed');
  }

  ngAfterViewInit(): void {
    this.hasViewInitialized = true;
    if (!this.isBaseInitialized()) return;

    this.executeSafely(() => this.initWithDelay(), 'AfterViewInit failed');
  }

  next(): void {
    if (!this.isBaseInitialized()) return;

    this.executeSafely(() => {
      const currentIndex = this._index();
      const nextIndex = this.getNextIndex(currentIndex);
      if (nextIndex !== currentIndex) {
        this.performStepChange(currentIndex, nextIndex, 'next');
      }
    }, 'Next step failed');
  }

  previous(): void {
    if (!this.isBaseInitialized()) return;

    this.executeSafely(() => {
      const currentIndex = this._index();
      const previousIndex = this.getPreviousIndex(currentIndex);
      if (previousIndex !== currentIndex) {
        this.performStepChange(currentIndex, previousIndex, 'previous');
      }
    }, 'Previous step failed');
  }

  goTo(index: number, source: 'next' | 'previous' | 'api' | 'click' = 'api'): void {
    if (!this.isBaseInitialized()) return;

    this.executeSafely(() => {
      const currentIndex = this._index();
      const targetIndex = this.validateIndex(index);
      if (targetIndex !== currentIndex) {
        this.performStepChange(currentIndex, targetIndex, source);
      }
    }, 'Go to step failed');
  }

  getCurrentStepIndex(): number {
    return this._index();
  }

  private shouldInit(): boolean {
    return Boolean(this.host.elementRef.nativeElement) && this.isActivateOn();
  }

  private initStepper(): void {
    if (this.isBaseInitialized()) return;

    this.markBaseInitialized();
    this.status.setActive(true);
    this.status.setLoading(true);

    const startingIndex = this.optionsManager.snapshot().startIndex ?? 0;
    this.refresh(startingIndex);
    this.setupListeners();

    if (this.hasViewInitialized) {
      this.initWithDelay();
    }

    this.status.setLoading(false);
  }

  private initWithDelay(): void {
    if (!this.host.isBrowser || typeof setTimeout === 'undefined') return;

    if (this.animationTimeout) clearTimeout(this.animationTimeout);
    this.animationTimeout = setTimeout(() => {
      this.executeSafely(() => this.refresh(), 'Delayed refresh failed');
    }, 100);
  }

  private setupListeners(): void {
    const options = this.optionsManager.snapshot();
    if (options.nextSelector) this.setupNextButton(options.nextSelector);
    if (options.prevSelector) this.setupPrevButton(options.prevSelector);
    if (options.stepActionSelector) this.setupStepActions(options.stepActionSelector);
    if (options.submitSelector) this.setupSubmitButton(options.submitSelector);
  }

  private setupNextButton(selector: string): void {
    const nextBtn = this.host.elementRef.nativeElement.querySelector(selector);
    if (!nextBtn) return;
    this.addListener(nextBtn, 'click', () => this.next());
  }

  private setupPrevButton(selector: string): void {
    const prevBtn = this.host.elementRef.nativeElement.querySelector(selector);
    if (!prevBtn) return;
    this.addListener(prevBtn, 'click', () => this.previous());
  }

  private setupStepActions(selector: string): void {
    const stepActions = this.host.elementRef.nativeElement.querySelectorAll(selector);
    stepActions.forEach((action: Element, index: number) => {
      this.addListener(action, 'click', () => {
        this.executeSafely(
          () => this.handleStepClick(action as HTMLElement, index),
          'Step action handler failed'
        );
      });
    });
  }

  private setupSubmitButton(selector: string): void {
    const submitBtn = this.host.elementRef.nativeElement.querySelector(selector);
    if (!submitBtn) return;
    this.addListener(submitBtn, 'click', () =>
      this.executeSafely(() => this.handleSubmit(), 'Submit handler failed')
    );
  }

  private addListener(target: Element | null, eventName: string, handler: (event: Event) => void): void {
    if (!target || !this.host.isBrowser) return;
    this.addBaseDomListener(target as HTMLElement, eventName, handler);
  }

  private handleStepClick(target: HTMLElement, index: number): void {
    this.stepperClick.emit({ target, index });
    this.goTo(index, 'click');
  }

  private handleSubmit(): void {
    this.stepperSubmit.emit();
  }

  private refresh(targetIndex?: number): void {
    if (!this.isBaseInitialized()) return;

    this.queryElements();

    const snapshot = this.optionsManager.snapshot();
    const preferredIndex = targetIndex ?? snapshot.startIndex ?? this._index();
    const resolvedIndex = this.validateIndex(preferredIndex);
    this._index.set(resolvedIndex);

    this.updateStepStates();
  }

  private queryElements(): void {
    const options = this.optionsManager.snapshot();
    const host = this.host.elementRef.nativeElement;
    this.contentItems = Array.from(host.querySelectorAll<HTMLElement>(options.contentSelector!));
    this.navItems = Array.from(host.querySelectorAll<HTMLElement>(options.navSelector!));
  }

  private updateStepStates(): void {
    const currentIndex = this._index();
    const options = this.optionsManager.snapshot();
    this.updateItemClasses(this.contentItems, currentIndex, options);
    this.updateItemClasses(this.navItems, currentIndex, options);
    this.updateButtonVisibility(currentIndex, options);
  }

  private updateItemClasses(items: HTMLElement[], currentIndex: number, options: StepperOptions): void {
    const { renderer } = this.host;
    items.forEach((item, index) => {
      this.setClass(renderer, item, options.currentClass!, index === currentIndex);
      this.setClass(renderer, item, options.pendingClass!, index > currentIndex);
      this.setClass(renderer, item, options.completedClass!, index < currentIndex);
    });
  }

  private updateButtonVisibility(currentIndex: number, options: StepperOptions): void {
    const totalSteps = this.contentItems.length;
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === totalSteps - 1;

    this.toggleButtonDisplay(options.prevSelector, isFirstStep ? 'none' : 'inline-block');
    this.toggleButtonDisplay(options.nextSelector, isLastStep ? 'none' : 'inline-block');
    this.toggleButtonDisplay(options.submitSelector, isLastStep ? 'inline-block' : 'none');
  }

  private toggleButtonDisplay(selector: string | undefined, display: string): void {
    if (!this.host.isBrowser || !selector) return;

    const button = this.host.elementRef.nativeElement.querySelector<HTMLElement>(selector);
    if (button) this.host.renderer.setStyle(button, 'display', display);
  }

  private getNextIndex(currentIndex: number): number {
    const options = this.optionsManager.snapshot();
    const maxIndex = Math.max(this.contentItems.length - 1, 0);
    if (currentIndex >= maxIndex) return options.loop ? 0 : currentIndex;
    return currentIndex + 1;
  }

  private getPreviousIndex(currentIndex: number): number {
    const options = this.optionsManager.snapshot();
    const maxIndex = Math.max(this.contentItems.length - 1, 0);
    if (currentIndex <= 0) return options.loop ? maxIndex : currentIndex;
    return currentIndex - 1;
  }

  private validateIndex(index: number): number {
    if (!Number.isFinite(index)) return 0;
    const maxIndex = Math.max(this.contentItems.length - 1, 0);
    const safeIndex = Math.trunc(index);
    return Math.max(0, Math.min(safeIndex, maxIndex));
  }

  private performStepChange(fromIndex: number, toIndex: number, source: string): void {
    this._index.set(toIndex);
    this.updateStepStates();
    this.emitStepEvents(fromIndex, toIndex, source);
  }

  private emitStepEvents(fromIndex: number, toIndex: number, source: string): void {
    const changeData = { from: fromIndex, to: toIndex };
    const changedData = { current: toIndex };

    this.stepperChange.emit(changeData);
    this.stepperChanged.emit(changedData);

    if (source === 'next') this.stepperNext.emit(changeData);
    else if (source === 'previous') this.stepperPrevious.emit(changeData);
  }

  private mergeOpts(options: StepperOptions): void {
    if (mergeOptionsIfChanged(this.optionsManager, options)) {
      this.handleOptsChanged();
    }
  }

  protected override updateOption<K extends keyof StepperOptions>(key: K, value: StepperOptions[K]): boolean {
    const changed = setOptionIfChanged(this.optionsManager, key, value);
    if (changed) this.handleOptsChanged(key);
    return changed;
  }

  private handleOptsChanged(changedKey?: keyof StepperOptions): void {
    const snapshot = this.optionsManager.snapshot();
    const desiredIndex = snapshot.startIndex ?? this._index();

    if (snapshot.activate === false) {
      this._index.set(this.validateIndex(desiredIndex));
      if (this.isBaseInitialized()) {
        this.executeSafely(() => this.cleanup(), 'Cleanup failed');
      }
      return;
    }

    if (!this.isBaseInitialized()) {
      this._index.set(this.validateIndex(desiredIndex));
      if (this.hasAttemptedInitialization) {
        this.executeSafely(() => this.initStepper(), 'Deferred initialization failed');
      }
      return;
    }

    const shouldRebindListeners =
      changedKey === undefined ||
      changedKey === 'nextSelector' ||
      changedKey === 'prevSelector' ||
      changedKey === 'stepActionSelector' ||
      changedKey === 'submitSelector';

    if (shouldRebindListeners) {
      this.detachListeners();
      this.setupListeners();
    }

    this.executeSafely(() => this.refresh(desiredIndex), 'Options refresh failed');
  }

  private detachListeners(): void {
    this.clearBaseDomListeners();
  }

  private cleanup(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    this.detachListeners();
    this.contentItems = [];
    this.navItems = [];
    this.baseCleanup();
    this.status.reset();
  }
}
