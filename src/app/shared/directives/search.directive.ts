import {
  Directive,
  OnInit,
  TemplateRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { CoreUtil } from '@utils/core.util';
import { ResponsiveUtil } from '@utils/responsive.util';
import { SearchResultItem } from '@models/common';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface SearchOptions {
  activate?: boolean;
  inputSelector?: string;
  clearSelector?: string;
  spinnerSelector?: string;
  toolbarSelector?: string;
  responsive?: boolean | { [key: string]: boolean };
  minLength?: number;
  keypress?: boolean;
  enter?: boolean;
  layout?: 'inline' | 'menu' | string;
  showOnFocus?: boolean;
}

const SEARCH_CONSTANTS = {
  // defaults
  DEFAULTS: {
    MIN_LENGTH: 0,
    LAYOUT: 'inline',
    INPUT_SELECTOR: 'input[type="search"], input[type="text"]',
    CLEAR_SELECTOR:
      '[data-velora-search-control="clear"], [data-velora-search-element="clear"]',
    SPINNER_SELECTOR: '[data-velora-search-element="spinner"]',
    TOOLBAR_SELECTOR: '[data-velora-search-element="toolbar"]',
  },
} as const;

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  activate: true,
  inputSelector: SEARCH_CONSTANTS.DEFAULTS.INPUT_SELECTOR,
  clearSelector: SEARCH_CONSTANTS.DEFAULTS.CLEAR_SELECTOR,
  spinnerSelector: SEARCH_CONSTANTS.DEFAULTS.SPINNER_SELECTOR,
  toolbarSelector: SEARCH_CONSTANTS.DEFAULTS.TOOLBAR_SELECTOR,
  responsive: true,
  minLength: SEARCH_CONSTANTS.DEFAULTS.MIN_LENGTH,
  keypress: true,
  enter: true,
  layout: SEARCH_CONSTANTS.DEFAULTS.LAYOUT as 'inline' | 'menu' | string,
  showOnFocus: false,
} as const;

@Directive({
  selector: '[vlVeloraSearch]',
  exportAs: 'vlVeloraSearch',
  standalone: true,
})
export class SearchDirective
  extends BaseDirective<SearchOptions, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();
  // ============================================================================
  // DEPENDENCY INJECTION
  // ============================================================================
  private readonly window = this.host.isBrowser ? inject(WINDOW) : null;

  constructor() {
    super(inject(LoggerService), 'SearchDirective', {
      ...DEFAULT_SEARCH_OPTIONS,
    });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    effect(() => {
      const options = this.searchOptions();
      untracked(() => {
        if (options) {
          this.executeSafely(() => {
            mergeOptionsIfChanged(this.optionsManager, options);
          }, 'Update search options failed');
        }
      });
    });

    const bindings = [
      { input: this.searchActivate, key: 'activate' as const },
      { input: this.searchInputSelector, key: 'inputSelector' as const },
      { input: this.searchClearSelector, key: 'clearSelector' as const },
      { input: this.searchSpinnerSelector, key: 'spinnerSelector' as const },
      { input: this.searchToolbarSelector, key: 'toolbarSelector' as const },
      { input: this.searchResponsive, key: 'responsive' as const },
      { input: this.searchMinLength, key: 'minLength' as const },
      { input: this.searchKeypress, key: 'keypress' as const },
      { input: this.searchEnter, key: 'enter' as const },
      { input: this.searchLayout, key: 'layout' as const },
      { input: this.searchShowOnFocus, key: 'showOnFocus' as const },
    ];
    this.bindInputs(bindings);
  }

  // ============================================================================
  // PRIVATE PROPERTIES
  // ============================================================================

  private inputEl: HTMLInputElement | null = null;
  private clearEl: HTMLElement | null = null;
  private spinnerEl: HTMLElement | null = null;
  private toolbarEl: HTMLElement | null = null;
  private spinnerTimeout: number | null = null;

  // ============================================================================
  // SIGNALS & COMPUTED VALUES
  // ============================================================================

  private readonly _query = signal<string>('');
  private readonly _isSearching = signal<boolean>(false);

  readonly isResponsive = computed(() =>
    this.resolveResponsiveValue(this.optionsManager.snapshot().responsive)
  );

  get query(): string {
    return this._query();
  }

  get isSearching(): boolean {
    return this._isSearching();
  }

  // ============================================================================
  // INPUTS (Signal-based)
  // ============================================================================

  readonly searchOptions = input<SearchOptions>();
  readonly searchActivate = input<boolean>();
  readonly searchInputSelector = input<string>();
  readonly searchClearSelector = input<string>();
  readonly searchSpinnerSelector = input<string>();
  readonly searchToolbarSelector = input<string>();
  readonly searchResponsive = input<boolean | { [key: string]: boolean }>();
  readonly searchMinLength = input<number>();
  readonly searchKeypress = input<boolean>();
  readonly searchEnter = input<boolean>();
  readonly searchLayout = input<'inline' | 'menu' | string>();
  readonly searchShowOnFocus = input<boolean>();
  readonly searchData = input<SearchResultItem[]>([]);

  // ============================================================================
  // CONTENT CHILDREN (Signal-based)
  // ============================================================================

  readonly emptyTemplate = contentChild<TemplateRef<unknown>>('emptyTemplate');
  readonly loadingTemplate =
    contentChild<TemplateRef<unknown>>('loadingTemplate');
  readonly noResultsTemplate =
    contentChild<TemplateRef<unknown>>('noResultsTemplate');
  readonly resultsTemplate =
    contentChild<TemplateRef<unknown>>('resultsTemplate');

  // ============================================================================
  // OUTPUTS (Signal-based)
  // ============================================================================

  readonly searchProcess = output<string>();
  readonly searchClear = output<void>();
  readonly searchCleared = output<void>();
  readonly searchEnterPress = output<string>();
  readonly searchKeypressEvent = output<string>();
  readonly searchFilterEvent = output<string>();

  readonly filteredResults = computed(() => {
    return (
      runSafely(
        () => {
          const query = this._query();
          const data = this.searchData();

          if (!query.trim()) {
            return [];
          }

          return data.filter((item) => this.matchesSearchQuery(item, query));
        },
        (error) => {
          this.logger.error(
            'Filtered results computation failed',
            'SearchDirective',
            { error }
          );
        }
      ) ?? []
    );
  });

  readonly hasResults = computed(() => this.filteredResults().length > 0);

  readonly hasQuery = computed(() => this._query().trim().length > 0);

  get results(): SearchResultItem[] {
    return this.filteredResults();
  }
  get inputElement(): HTMLInputElement | null {
    return this.inputEl;
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) {
      return;
    }

    if (!this.shouldInitialize()) {
      return;
    }

    this.executeSafely(() => {
      this.syncInputsToOptions();
      this.initializeElements();
      this.setupEventListeners();
      this.initializeState();
    }, 'Initialization failed');
  }

  private syncInputsToOptions(): void {
    const options = this.searchOptions();
    if (options) mergeOptionsIfChanged(this.optionsManager, options);

    const activate = this.searchActivate();
    if (activate !== undefined) this.updateOption('activate', activate);

    const inputSelector = this.searchInputSelector();
    if (inputSelector !== undefined)
      this.updateOption('inputSelector', inputSelector);

    const clearSelector = this.searchClearSelector();
    if (clearSelector !== undefined)
      this.updateOption('clearSelector', clearSelector);

    const spinnerSelector = this.searchSpinnerSelector();
    if (spinnerSelector !== undefined)
      this.updateOption('spinnerSelector', spinnerSelector);

    const toolbarSelector = this.searchToolbarSelector();
    if (toolbarSelector !== undefined)
      this.updateOption('toolbarSelector', toolbarSelector);

    const responsive = this.searchResponsive();
    if (responsive !== undefined) this.updateOption('responsive', responsive);

    const minLength = this.searchMinLength();
    if (typeof minLength === 'number')
      this.updateOption('minLength', minLength);

    const keypress = this.searchKeypress();
    if (keypress !== undefined) this.updateOption('keypress', keypress);

    const enter = this.searchEnter();
    if (enter !== undefined) this.updateOption('enter', enter);

    const layout = this.searchLayout();
    if (layout) this.updateOption('layout', layout);

    const showOnFocus = this.searchShowOnFocus();
    if (showOnFocus !== undefined)
      this.updateOption('showOnFocus', showOnFocus);
  }

  focus(): void {
    this.inputEl?.focus();
  }

  value(): string {
    return this.inputEl?.value || '';
  }

  getValue(): string {
    return this.value();
  }

  setValue(value: string): void {
    this.executeSafely(() => {
      if (this.host.isBrowser && this.inputEl) {
        this.host.renderer.setProperty(this.inputEl, 'value', value);
        this.updateUIState(value);
      }
    }, 'Set value failed');
  }

  clear(): void {
    this.executeSafely(() => {
      if (!this.inputEl) {
        return;
      }

      this.emitClearEvents();
      this.resetInputValue();
      this.updateClearVisibility();
      this.inputEl.focus();
    }, 'Clear failed');
  }

  updateClearButtonVisibility(): void {
    this.updateClearVisibility();
  }

  setSpinnerVisible(visible: boolean): void {
    if (!this.spinnerEl) {
      return;
    }

    this.executeSafely(() => {
      if (visible) {
        this.showSpinner();
      } else {
        this.hideSpinner();
      }
    }, 'Set spinner visible failed');
  }

  // Helper Methods
  protected override updateOption<K extends keyof SearchOptions>(
    key: K,
    value: SearchOptions[K]
  ): boolean {
    const changed = setOptionIfChanged(this.optionsManager, key, value);
    return changed;
  }

  private shouldInitialize(): boolean {
    return (
      runSafely(
        () =>
          Boolean(
            this.host.elementRef.nativeElement &&
              (this.optionsManager.snapshot().activate ?? true)
          ),
        (error) =>
          this.logger.error(
            'Should initialize check failed',
            'SearchDirective',
            { error }
          )
      ) ?? false
    );
  }

  private initializeElements(): void {
    this.executeSafely(() => {
      const host = this.host.elementRef.nativeElement;
      this.applyLayoutClass(host);
      this.queryElements(host);
    }, 'Initialize elements failed');
  }

  private setupEventListeners(): void {
    this.executeSafely(() => {
      this.setupInputEvents();
      this.setupFocusEvents();
      this.setupClearEvents();
    }, 'Setup event listeners failed');
  }

  private initializeState(): void {
    this.updateClearVisibility();
  }

  private applyLayoutClass(host: HTMLElement): void {
    if (!this.host.isBrowser) return;

    const layout = this.optionsManager.snapshot().layout || 'inline';
    this.host.renderer.removeClass(host, 'search-inline');
    this.host.renderer.removeClass(host, 'search-menu');
    this.host.renderer.addClass(host, `search-${layout}`);
  }

  private queryElements(host: HTMLElement): void {
    this.inputEl = this.findInputElement(host);
    this.clearEl = this.findClearElement(host);
    this.spinnerEl = this.findSpinnerElement(host);
    this.toolbarEl = this.findToolbarElement(host);
  }

  private findInputElement(host: HTMLElement): HTMLInputElement | null {
    const selector =
      this.optionsManager.snapshot().inputSelector ||
      'input[type="search"], input[type="text"]';
    return host.querySelector(selector);
  }

  private findClearElement(host: HTMLElement): HTMLElement | null {
    const selector =
      this.optionsManager.snapshot().clearSelector ||
      '[data-velora-search-control="clear"], [data-velora-search-element="clear"]';
    return host.querySelector(selector);
  }

  private findSpinnerElement(host: HTMLElement): HTMLElement | null {
    const selector =
      this.optionsManager.snapshot().spinnerSelector ||
      '[data-velora-search-element="spinner"]';
    return host.querySelector(selector);
  }

  private findToolbarElement(host: HTMLElement): HTMLElement | null {
    const selector =
      this.optionsManager.snapshot().toolbarSelector ||
      '[data-velora-search-element="toolbar"]';
    return host.querySelector(selector);
  }

  private setupInputEvents(): void {
    if (!this.inputEl) return;

    this.addDomListener(
      this.inputEl,
      'input',
      this.createDebouncedHandler((event) => this.handleInputEvent(event), 300)
    );
    this.addDomListener(this.inputEl, 'keypress', (event) =>
      this.handleKeypressEvent(event)
    );
    this.addDomListener(this.inputEl, 'keydown', (event) =>
      this.handleKeydownEvent(event)
    );
  }

  private setupFocusEvents(): void {
    if (!this.inputEl) return;

    this.addDomListener(this.inputEl, 'focus', () => this.handleFocusEvent());
    this.addDomListener(this.inputEl, 'blur', () => this.handleBlurEvent());
  }

  private setupClearEvents(): void {
    if (!this.clearEl) return;

    this.addDomListener(this.clearEl, 'click', () => this.clear());
  }

  private handleInputEvent(event: Event): void {
    this.executeSafely(() => {
      const target = event.target as HTMLInputElement;
      const term = target.value;

      this._query.set(term);
      this.updateUIState(term);

      if (this.shouldEmitSearchEvents(term)) {
        this.emitSearchEvents(term);
      }
    }, 'Handle input event failed');
  }

  private handleKeypressEvent(event: Event): void {
    this.executeSafely(() => {
      const value = (event.target as HTMLInputElement).value;

      if (this.shouldEmitSearchEvents(value)) {
        this.searchKeypressEvent.emit(value);
        this.searchFilterEvent.emit(value);
      }
    }, 'Handle keypress event failed');
  }

  private handleKeydownEvent(event: Event): void {
    this.executeSafely(() => {
      const keyboardEvent = event as KeyboardEvent;

      if (keyboardEvent.key === 'Escape') {
        keyboardEvent.preventDefault();
        this.clear();
        return;
      }

      if (
        keyboardEvent.key === 'Enter' &&
        this.optionsManager.snapshot().enter
      ) {
        const value = (event.target as HTMLInputElement).value;
        this.searchEnterPress.emit(value);
        this._query.set(value);
      }
    }, 'Handle keydown event failed');
  }

  private handleFocusEvent(): void {
    if (this.optionsManager.snapshot().showOnFocus) {
      this.updateClearVisibility();
    }
  }

  private handleBlurEvent(): void {
    // Blur hook placeholder
  }

  private emitSearchEvents(value: string): void {
    this.executeSafely(() => {
      this.searchProcess.emit(value);
      this.searchKeypressEvent.emit(value);
      this.searchFilterEvent.emit(value);
    }, 'Emit search events failed');
  }

  private emitClearEvents(): void {
    this.executeSafely(() => {
      this.searchClear.emit();
      this.searchCleared.emit();
    }, 'Emit clear events failed');
  }

  private resetInputValue(): void {
    if (this.host.isBrowser && this.inputEl) {
      this.host.renderer.setProperty(this.inputEl, 'value', '');
      this._query.set('');
    }
  }

  private updateUIState(value: string): void {
    this.updateClearVisibility();
    this.updateSpinnerState(value);
  }

  private updateSpinnerState(value: string): void {
    if (!this.spinnerEl) return;

    const shouldShow = value.length > 0 && this.shouldEmitSearchEvents(value);

    if (shouldShow) {
      this.showSpinner();
    } else {
      this.hideSpinner();
    }
  }

  private updateClearVisibility(): void {
    if (!this.clearEl) return;

    const hasValue = !!this.inputEl?.value;
    this.toggleElementClass(this.clearEl, 'd-none', !hasValue);

    if (this.toolbarEl) {
      this.toggleElementClass(this.toolbarEl, 'd-none', hasValue);
    }
  }

  private showSpinner(): void {
    if (!this.spinnerEl) return;

    this.toggleElementClass(this.spinnerEl, 'd-none', false);
    this._isSearching.set(true);

    if (this.clearEl) {
      this.toggleElementClass(this.clearEl, 'd-none', true);
    }

    if (this.toolbarEl) {
      this.toggleElementClass(this.toolbarEl, 'd-none', true);
    }

    this.scheduleSpinnerHide();
  }

  private hideSpinner(): void {
    if (!this.spinnerEl) return;

    this.toggleElementClass(this.spinnerEl, 'd-none', true);
    this._isSearching.set(false);

    if (this.clearEl && this.inputEl?.value) {
      this.toggleElementClass(this.clearEl, 'd-none', false);
    }

    if (this.toolbarEl && !this.inputEl?.value) {
      this.toggleElementClass(this.toolbarEl, 'd-none', false);
    }
  }

  private matchesSearchQuery(item: SearchResultItem, query: string): boolean {
    const searchText = query.toLowerCase();

    if (item.title && item.title.toLowerCase().includes(searchText)) {
      return true;
    }

    if (
      item.description &&
      item.description.toLowerCase().includes(searchText)
    ) {
      return true;
    }

    if (item.category && item.category.toLowerCase().includes(searchText)) {
      return true;
    }

    return false;
  }

  private shouldEmitSearchEvents(term: string): boolean {
    return !!(
      this.optionsManager.snapshot().keypress && this.meetsMinLength(term)
    );
  }

  private meetsMinLength(term: string): boolean {
    const minLength = this.optionsManager.snapshot().minLength || 0;
    return term.length >= minLength;
  }

  private toggleElementClass(
    element: HTMLElement,
    className: string,
    add: boolean
  ): void {
    if (!this.host.isBrowser) return;

    if (add) {
      this.host.renderer.addClass(element, className);
    } else {
      this.host.renderer.removeClass(element, className);
    }
  }

  // ============================================================================
  // STANDARDIZED UTILITY METHODS
  // ============================================================================

  private scheduleSpinnerHide(): void {
    this.clearSpinnerTimeout();
    const hostWindow = this.host.window ?? window;
    this.spinnerTimeout = hostWindow.setTimeout(() => {
      this.spinnerTimeout = null;
      this.hideSpinner();
    }, 500);
  }

  private clearSpinnerTimeout(): void {
    if (this.spinnerTimeout !== null) {
      const hostWindow = this.host.window ?? window;
      hostWindow.clearTimeout(this.spinnerTimeout);
      this.spinnerTimeout = null;
    }
  }

  private resolveResponsiveValue(value: SearchOptions['responsive']): boolean {
    return (
      runSafely(
        () => {
          if (typeof value === 'boolean') return value;
          if (typeof value === 'object' && value !== null) {
            return CoreUtil.coerceBooleanProperty(
              ResponsiveUtil.getBreakpointValue(value)
            );
          }
          return true;
        },
        (error) =>
          this.logger.error(
            'Responsive value resolution failed',
            'SearchDirective',
            { error }
          )
      ) ?? true
    );
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.clearSpinnerTimeout();

      this.inputEl = null;
      this.clearEl = null;
      this.spinnerEl = null;
      this.toolbarEl = null;
      this.clearBaseDomListeners();

      this.status.setError(null);
    }, 'Cleanup failed');
  }

  private addDomListener(
    target: HTMLElement | null,
    eventName: string,
    handler: EventListener
  ): void {
    if (!this.host.isBrowser || !target) return;
    this.addBaseDomListener(target, eventName, handler);
  }

  private createDebouncedHandler(
    handler: (event: Event) => void,
    delayMs: number
  ): EventListener {
    let timeoutId: number | null = null;
    return (event: Event) => {
      const hostWindow = this.host.window ?? window;
      if (timeoutId !== null) {
        hostWindow.clearTimeout(timeoutId);
      }
      timeoutId = hostWindow.setTimeout(() => {
        timeoutId = null;
        handler(event);
      }, delayMs);
    };
  }
}
