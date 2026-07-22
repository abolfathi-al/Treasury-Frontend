import {
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import type Awesomplete from 'awesomplete';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely } from './shared/directive-helpers';

const EVENTS = {
  SELECT: 'awesomplete-select',
  SELECT_COMPLETE: 'awesomplete-selectcomplete',
  OPEN: 'awesomplete-open',
  CLOSE: 'awesomplete-close',
  HIGHLIGHT: 'awesomplete-highlight',
} as const;

const DEFAULT_OPTIONS = {
  minChars: 2,
  maxItems: 10,
  autoFirst: false,
  sort: true,
} as const;

const DEBOUNCE_TIME = 300;
const MAX_RETRIES = 3;

export interface AutocompleteItem {
  label: string;
  value: string | AutocompleteItem | Record<string, unknown>;
  disabled?: boolean;
  group?: string;
  metadata?: Record<string, unknown>;
}

export interface AutocompleteDataSource {
  (text: string):
    | Promise<AutocompleteItem[]>
    | Observable<AutocompleteItem[]>
    | AutocompleteItem[];
}

export interface AutocompleteConfig {
  dataSource?: AutocompleteDataSource;
  items?: AutocompleteItem[];
  itemTemplate?: (item: AutocompleteItem) => string;
  filter?: (text: string, input: string) => boolean;
  sort?: boolean | ((a: string, b: string, input: string) => number);
  replace?: (suggestion: AutocompleteItem) => string;
  minChars?: number;
  maxItems?: number;
  autoFirst?: boolean;
  tabSelect?: boolean;
  listLabel?: string;
  list?: string[] | AutocompleteItem[] | [string, string][] | HTMLElement | string;
  debounceTime?: number;
  caseSensitive?: boolean;
  highlightMatches?: boolean;
}

export interface AutocompleteError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface AutocompleteCustomEvent extends CustomEvent {
  text?: { value: string } | string;
}

@Directive({
  selector: '[vlVeloraAutocomplete], [data-velora-autocomplete]',
  exportAs: 'vlVeloraAutocomplete',
  standalone: true,
})
export class AutocompleteDirective
  extends BaseDirective<Record<string, never>, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();
  private readonly el = this.host.elementRef as ElementRef<HTMLInputElement>;
  private readonly rootFormControl = inject(NgControl, { optional: true });

  private awesompleteInstance: Awesomplete | null = null;
  private retryCount = 0;
  private inputSubject = new Subject<string>();
  private AwesompleteClass: typeof Awesomplete | null = null;
  private _dynamicItems: AutocompleteItem[] = [];

  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;

  readonly dataDsAutocomplete = input<AutocompleteConfig>({}, { alias: 'data-velora-autocomplete' });
  readonly config = input<AutocompleteConfig>({});
  readonly dataSource = input<AutocompleteDataSource | null>(null);
  readonly items = input<AutocompleteItem[]>([]);
  readonly disabled = input<boolean>(false);

  readonly itemSelect = output<AutocompleteItem>();
  readonly itemSelectComplete = output<AutocompleteItem>();
  readonly dropdownOpen = output<void>();
  readonly dropdownClose = output<void>();
  readonly itemHighlight = output<AutocompleteItem>();
  readonly textInput = output<string>();
  readonly loadingEvent = output<boolean>();
  readonly errorOccurred = output<AutocompleteError>();

  constructor() {
    super(inject(LoggerService), 'AutocompleteDirective', {});
    this.setupInputDebouncing();
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);

    effect(() => {
      this.config();
      this.dataDsAutocomplete();
      this.items();
      this.dataSource();
      untracked(() => {
        if (this.awesompleteInstance) {
          this.updateInstance();
        }
      });
    });

    effect(() => {
      this.disabled();
      untracked(() => {
        if (this.awesompleteInstance) {
          this.updateDisabledState();
        }
      });
    });
  }

  ngOnInit(): void {
    if (!this.host.isBrowser || this.isBaseDestroyed() || !this.el.nativeElement) return;

    import('awesomplete')
      .then((AwesompleteModule) => {
        if (this.isBaseDestroyed()) return;

        this.AwesompleteClass = AwesompleteModule.default || AwesompleteModule;
        runSafely(
          () => {
            this.initAutocomplete();
            this.setupEventListeners();
          },
          (error) => this.handleError('Failed to initialize autocomplete', error)
        );
      })
      .catch((error) => {
        this.handleError('Failed to load Awesomplete library', error as Error);
      });
  }

  get instance(): Awesomplete | null {
    return this.awesompleteInstance;
  }

  evaluate(): void {
    this.safeExecute(() => this.awesompleteInstance?.evaluate());
  }

  close(): void {
    this.safeExecute(() => this.awesompleteInstance?.close());
  }

  open(): void {
    this.safeExecute(() => this.awesompleteInstance?.open());
  }

  next(): void {
    this.safeExecute(() => this.awesompleteInstance?.next());
  }

  previous(): void {
    this.safeExecute(() => this.awesompleteInstance?.previous());
  }

  goto(index: number): void {
    this.safeExecute(() => {
      if (this.awesompleteInstance && index >= 0) {
        this.awesompleteInstance.goto(index);
      }
    });
  }

  select(): void {
    this.safeExecute(() => this.awesompleteInstance?.select());
  }

  destroy(): void {
    this.destroyInstance();
  }

  private setupInputDebouncing(): void {
    const mergedConfig = this.getMergedConfig();
    const debounceTimeMs = mergedConfig.debounceTime || DEBOUNCE_TIME;

    this.inputSubject
      .pipe(
        debounceTime(debounceTimeMs),
        distinctUntilChanged(),
        switchMap((inputValue: string) => {
          if (this.dataSource() && inputValue.length >= (mergedConfig.minChars || 2)) {
            return this.handleDynamicDataSource(inputValue);
          }
          return of([]);
        }),
        catchError((error) => {
          this.handleError('Failed to load data from source', error as Error);
          return of([]);
        }),
        takeUntilDestroyed(this.host.destroyRef)
      )
      .subscribe();
  }

  private initAutocomplete(): void {
    if (!this.AwesompleteClass) {
      this.handleError('Awesomplete library not loaded', new Error('Library not available'));
      return;
    }

    const element = this.el.nativeElement as HTMLInputElement & { Awesomplete?: Awesomplete };

    if (element.Awesomplete) {
      this.awesompleteInstance = element.Awesomplete;
      this.updateInstance();
      return;
    }

    this.safeExecute(() => {
      const options = this.buildOptions();
      this.awesompleteInstance = new this.AwesompleteClass!(element, options);
    });
  }

  private buildOptions(): Record<string, unknown> {
    const mergedConfig = this.getMergedConfig();

    const options: Record<string, unknown> = {
      ...mergedConfig,
      list: this.buildItemList(),
      filter: this.buildFilterFunction(),
      sort: this.buildSortFunction(),
      replace: this.buildReplaceFunction(),
    };

    const itemTemplate = this.buildItemTemplate();
    if (itemTemplate) {
      options.item = itemTemplate;
    }

    return options;
  }

  private buildItemList(): string[] | AutocompleteItem[] | [string, string][] | HTMLElement | string {
    const mergedConfig = this.getMergedConfig();

    if (this.dataSource()) return [];
    if (mergedConfig.list) return mergedConfig.list;

    const items = this.items();
    if (items?.length > 0) {
      return items.filter((item) => this.isValidItem(item)).map((item) => String(item.label));
    }

    return [];
  }

  private buildFilterFunction(): ((text: string, input: string) => boolean) | undefined {
    const mergedConfig = this.getMergedConfig();

    if (mergedConfig.filter) return mergedConfig.filter;

    return (text: string, input: string) => {
      const textStr = String(text || '');
      const inputStr = String(input || '');

      if (mergedConfig.caseSensitive) {
        return textStr.includes(inputStr);
      }

      return textStr.toLowerCase().includes(inputStr.toLowerCase());
    };
  }

  private buildSortFunction(): ((a: string, b: string, input: string) => number) | undefined {
    const mergedConfig = this.getMergedConfig();

    if (typeof mergedConfig.sort === 'function') return mergedConfig.sort;

    if (mergedConfig.sort === true) {
      return (a: string, b: string) => {
        const aStr = String(a || '');
        const bStr = String(b || '');
        const aLower = mergedConfig.caseSensitive ? aStr : aStr.toLowerCase();
        const bLower = mergedConfig.caseSensitive ? bStr : bStr.toLowerCase();

        if (aLower.length !== bLower.length) {
          return aLower.length - bLower.length;
        }

        return aLower.localeCompare(bLower);
      };
    }

    return undefined;
  }

  private buildItemTemplate(): ((text: string, input: string) => HTMLElement) | undefined {
    const mergedConfig = this.getMergedConfig();

    if (mergedConfig.itemTemplate) {
      return (text: string) => {
        if (!this.host.isBrowser) return undefined as unknown as HTMLElement;

        const item = this.findItemByLabel(text);

        if (item) {
          const element = this.host.renderer.createElement('li');
          this.host.renderer.setProperty(element, 'innerHTML', mergedConfig.itemTemplate!(item));
          return element;
        }

        const element = this.host.renderer.createElement('li');
        this.host.renderer.setProperty(element, 'textContent', text);
        return element;
      };
    }

    return undefined;
  }

  private buildReplaceFunction(): ((suggestion: string | AutocompleteItem) => void) | undefined {
    const mergedConfig = this.getMergedConfig();

    if (mergedConfig.replace) {
      return (suggestion: string | AutocompleteItem) => {
        const item = this.findItemFromSuggestion(suggestion);

        if (item) {
          mergedConfig.replace!(item);
        } else {
          this.setInputValue(this.getSuggestionValue(suggestion));
        }
      };
    }

    return (suggestion: string | AutocompleteItem) => {
      this.setInputValue(this.getSuggestionValue(suggestion));
    };
  }

  private updateInstance(): void {
    this.safeExecute(() => {
      if (!this.awesompleteInstance) return;

      const options = this.buildOptions();
      Object.assign(this.awesompleteInstance, options);
      this.awesompleteInstance.evaluate();
    });
  }

  private updateDisabledState(): void {
    this.safeExecute(() => {
      this.el.nativeElement.disabled = this.disabled();
    });
  }

  private setupEventListeners(): void {
    const element = this.el.nativeElement;

    this.setupSelectEvent(element);
    this.setupSelectCompleteEvent(element);
    this.setupOpenEvent(element);
    this.setupCloseEvent(element);
    this.setupHighlightEvent(element);
    this.setupInputEvent(element);
  }

  private setupSelectEvent(element: HTMLInputElement): void {
    this.addListener(element, EVENTS.SELECT, (event: Event) => {
      this.safeExecute(() => {
        const customEvent = event as AutocompleteCustomEvent;
        const selectedText =
          typeof customEvent.text === 'string' ? customEvent.text : customEvent.text?.value || '';
        const selectedItem = this.findItemByLabel(selectedText);

        if (selectedItem) {
          this.itemSelect.emit(selectedItem);
          this.updateFormControl(selectedItem.value);
        } else {
          const simpleItem: AutocompleteItem = { label: selectedText, value: selectedText };
          this.itemSelect.emit(simpleItem);
          this.updateFormControl(selectedText);
        }
      });
    });
  }

  private setupSelectCompleteEvent(element: HTMLInputElement): void {
    this.addListener(element, EVENTS.SELECT_COMPLETE, (event: Event) => {
      this.safeExecute(() => {
        const customEvent = event as AutocompleteCustomEvent;
        const selectedText =
          typeof customEvent.text === 'string' ? customEvent.text : customEvent.text?.value || '';
        const selectedItem = this.findItemByLabel(selectedText);

        if (selectedItem) {
          this.itemSelectComplete.emit(selectedItem);
        } else {
          const simpleItem: AutocompleteItem = { label: selectedText, value: selectedText };
          this.itemSelectComplete.emit(simpleItem);
        }
      });
    });
  }

  private setupOpenEvent(element: HTMLInputElement): void {
    this.addListener(element, EVENTS.OPEN, () => this.dropdownOpen.emit());
  }

  private setupCloseEvent(element: HTMLInputElement): void {
    this.addListener(element, EVENTS.CLOSE, () => this.dropdownClose.emit());
  }

  private setupHighlightEvent(element: HTMLInputElement): void {
    this.addListener(element, EVENTS.HIGHLIGHT, (event: Event) => {
      this.safeExecute(() => {
        const customEvent = event as AutocompleteCustomEvent;
        const highlightedText =
          typeof customEvent.text === 'string' ? customEvent.text : customEvent.text?.value || '';
        const highlightedItem = this.findItemByLabel(highlightedText);

        if (highlightedItem) {
          this.itemHighlight.emit(highlightedItem);
        } else {
          const simpleItem: AutocompleteItem = { label: highlightedText, value: highlightedText };
          this.itemHighlight.emit(simpleItem);
        }
      });
    });
  }

  private setupInputEvent(element: HTMLInputElement): void {
    this.addListener(element, 'input', (event: Event) => {
      this.safeExecute(() => {
        const target = event.target as HTMLInputElement;
        const inputValue = target?.value || '';
        this.textInput.emit(inputValue);
        this.inputSubject.next(inputValue);
      });
    });
  }

  private async handleDynamicDataSource(inputValue: string): Promise<void> {
    if (!this.dataSource() || this.status.getLoading() || this.isBaseDestroyed()) return;

    this.setLoadingState(true);
    this.retryCount = 0;

    const execution = runSafely(
      async () => {
        while (!this.isBaseDestroyed()) {
          let succeeded = false;
          const attempt = this.safeExecute(async () => {
            await this.executeDataSource(inputValue);
            succeeded = true;
          });

          if (attempt) await attempt;

          if (succeeded) {
            this.retryCount = 0;
            this.status.setError(null);
            break;
          }

          this.retryCount += 1;
          if (this.retryCount >= MAX_RETRIES) {
            this.handleError(
              'Max retries exceeded for data source',
              new Error(`Retry attempts reached ${this.retryCount}`)
            );
            break;
          }

          await this.delay(1000 * this.retryCount);
        }
      },
      (error) => this.handleError('Dynamic data source handler failed', error)
    );

    if (execution) await execution;

    this.setLoadingState(false);
  }

  private async executeDataSource(inputValue: string): Promise<void> {
    const dataSource = this.dataSource();
    if (!dataSource) return;
    const result = dataSource(inputValue);

    if (result instanceof Promise) {
      const items = await result;
      this.updateItemsFromDataSource(items);
    } else if (result instanceof Observable) {
      result.pipe(takeUntilDestroyed(this.host.destroyRef)).subscribe({
        next: (items: AutocompleteItem[]) => this.updateItemsFromDataSource(items),
        error: (error) => this.handleError('Observable data source error', error as Error),
      });
    } else {
      this.updateItemsFromDataSource(result);
    }
  }

  private updateItemsFromDataSource(items: AutocompleteItem[]): void {
    this.safeExecute(() => {
      this._dynamicItems = items;

      if (this.awesompleteInstance) {
        this.awesompleteInstance.list = items.map((item) => item.label);
        this.awesompleteInstance.evaluate();
      }
    });
  }

  private setLoadingState(loading: boolean): void {
    this.status.setLoading(loading);
    this.loadingEvent.emit(loading);
  }

  private findItemByLabel(label: string): AutocompleteItem | undefined {
    const allItems = [...this.items(), ...this._dynamicItems];
    return allItems.find((item) => item.label === label);
  }

  private findItemFromSuggestion(suggestion: string | AutocompleteItem): AutocompleteItem | undefined {
    if (typeof suggestion === 'string') {
      return this.findItemByLabel(suggestion);
    } else if (suggestion && typeof suggestion === 'object') {
      return suggestion.label ? suggestion : this.findItemByLabel(suggestion.label);
    }
    return undefined;
  }

  private getSuggestionValue(suggestion: string | AutocompleteItem): string {
    if (typeof suggestion === 'string') return suggestion;
    if (suggestion && typeof suggestion === 'object') {
      return (
        suggestion.label ||
        (typeof suggestion.value === 'string' ? suggestion.value : '') ||
        ''
      );
    }
    return '';
  }

  private setInputValue(value: string): void {
    this.safeExecute(() => {
      if (this.host.isBrowser) {
        this.host.renderer.setProperty(this.el.nativeElement, 'value', value);
      }
    });
  }

  private updateFormControl(value: string | AutocompleteItem | Record<string, unknown>): void {
    this.safeExecute(() => {
      if (this.rootFormControl?.control) {
        this.rootFormControl.control.setValue(value);
      }
    });
  }

  private destroyInstance(): void {
    this.safeExecute(() => {
      if (this.awesompleteInstance) {
        this.awesompleteInstance.destroy();
        this.awesompleteInstance = null;
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getMergedConfig(): AutocompleteConfig {
    return {
      ...DEFAULT_OPTIONS,
      ...this.dataDsAutocomplete(),
      ...this.config(),
    };
  }

  private isValidItem(item: AutocompleteItem): boolean {
    return item && typeof item.label === 'string' && item.label.trim().length > 0;
  }

  private safeExecute<T>(operation: () => T | Promise<T>): T | Promise<T | undefined> | undefined {
    if (!this.host.isBrowser || this.isBaseDestroyed()) return undefined;
    return runSafely(operation, (error) => this.handleError('Operation failed', error));
  }

  private addListener(target: HTMLElement, eventName: string, handler: (event: Event) => void): void {
    if (!this.host.isBrowser || !target) return;
    this.addBaseDomListener(target, eventName, handler);
  }

  private handleError(message: string, error: unknown): void {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    this.status.setError(message);
    this.logger.error(message, 'AutocompleteDirective', { error: normalizedError });
  }

  private cleanup(): void {
    if (this.isBaseDestroyed()) return;

    this.destroyInstance();
    this.inputSubject.complete();
    this.clearBaseDomListeners();
    this.markBaseDestroyed();
    this.status.reset();
  }
}
