import {
  Directive,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type flatpickr from 'flatpickr-wrap';
import { IranianDateAdapter } from 'native-date-adapter';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';
import { toEnglish } from '@shared/pipes';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionsIfChanged,
} from './shared/directive-helpers';

export interface FlatpickrOptions {
  mode?: 'single' | 'multiple' | 'range' | 'time';
  dateFormat?: string;
  altFormat?: string;
  altInputClass?: string;
  ariaDateFormat?: string;
  timeFormat?: string;
  enableTime?: boolean;
  enableSeconds?: boolean;
  time_24hr?: boolean;
  noCalendar?: boolean;
  defaultDate?: string | Date | Date[];
  defaultHour?: number;
  defaultMinute?: number;
  minDate?: string | Date;
  maxDate?: string | Date;
  allowInput?: boolean;
  altInput?: boolean;
  allowInvalidPreload?: boolean;
  clickOpens?: boolean;
  inline?: boolean;
  static?: boolean;
  position?: 'auto' | 'above' | 'below';
  positionElement?: HTMLElement;
  appendTo?: HTMLElement;
  wrap?: boolean;
  prevArrow?: string;
  nextArrow?: string;
  showMonths?: number;
  monthSelectorType?: 'dropdown' | 'static';
  shorthandCurrentMonth?: boolean;
  hourIncrement?: number;
  minuteIncrement?: number;
  minTime?: string;
  maxTime?: string;
  disable?: string[] | Date[];
  enable?: string[] | Date[];
  disableMobile?: boolean;
  locale?: any;
  weekNumbers?: boolean;
  conjunction?: string;
  parseDate?: (dateString: string) => Date;
  formatDate?: (date: Date, format: string) => string;
  onChange?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onClose?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onOpen?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onReady?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onValueUpdate?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onDayCreate?: (dObj: Date[], dStr: string, fp: FlatpickrInstance, elem: HTMLElement) => void;
}

export interface FlatpickrValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FlatpickrError {
  code: string;
  message: string;
  details?: any;
}

type FlatpickrInstance = flatpickr.Instance;
type FlatpickrNativeOptions = flatpickr.Options.Options;
type FlatpickrFactory = typeof import('flatpickr-wrap')['default'];
type GlobalFlatpickrRegistry = typeof globalThis & {
  flatpickr?: FlatpickrFactory;
};

const registerGlobalFlatpickr = (factory: FlatpickrFactory): void => {
  (globalThis as GlobalFlatpickrRegistry).flatpickr = factory;
};

const DEFAULT_OPTIONS: FlatpickrOptions = {
  locale: 'fa',
  altFormat: 'Y/m/d',
  dateFormat: 'Y-m-d',
  altInput: true,
  allowInput: true,
  allowInvalidPreload: false,
  clickOpens: true,
  mode: 'single',
  enableTime: false,
  enableSeconds: false,
  noCalendar: false,
  timeFormat: 'H:i',
  inline: false,
  static: false,
  position: 'auto',
  weekNumbers: false,
  parseDate: (dateStr: string) => {
    const value = toEnglish(dateStr);
    const dateRegex = /^([0-9]{2})?[0-9]{2}(\/|-)(1[0-2]|0?[1-9])\2(3[01]|[12][0-9]|0?[1-9])$/;
    if (!dateRegex.test(value)) return new Date(NaN);
    const [y, m, d] = value.split(/[\/|-]/).map(Number);
    if (y > 1500) return new Date(y, m - 1, d, 0, 0, 0, 0);
    const iranianDateAdapter = new IranianDateAdapter();
    const [gy, gm, gd] = iranianDateAdapter.toGregorianDate(y, m - 1, d);
    return new Date(gy, gm, gd, 0, 0, 0, 0);
  },
} as const;

@Directive({
  selector: '[vlVeloraFlatpickr]',
  exportAs: 'veloraFlatpickr',
  standalone: true,
})
export class FlatpickrDirective extends BaseDirective<FlatpickrOptions, FlatpickrError> implements OnInit {
  private readonly host = useDirectiveHost();
  private readonly cssLoader = inject(CssLoaderService);

  private flatpickrInstance: FlatpickrInstance | null = null;
  private flatpickrFactory: FlatpickrFactory | null = null;
  private flatpickrLoader: Promise<FlatpickrFactory> | null = null;
  private isDirectiveDestroyed = false;

  private readonly _selectedDates = signal<Date[]>([]);
  private readonly _formattedDate = signal<string>('');
  private readonly _isOpen = signal<boolean>(false);

  readonly selectedDates = computed(() => this._selectedDates());
  readonly formattedDate = computed(() => this._formattedDate());
  readonly isOpen = computed(() => this._isOpen());

  readonly flatpickrMode = input<'single' | 'multiple' | 'range' | 'time'>();
  readonly flatpickrDateFormat = input<string>();
  readonly flatpickrAltFormat = input<string>();
  readonly flatpickrAltInput = input<boolean>();
  readonly flatpickrAltInputClass = input<string>();
  readonly flatpickrAriaDateFormat = input<string>();
  readonly flatpickrTime24hr = input<boolean>();
  readonly flatpickrDefaultHour = input<number>();
  readonly flatpickrDefaultMinute = input<number>();
  readonly flatpickrPositionElement = input<HTMLElement>();
  readonly flatpickrWrap = input<boolean>();
  readonly flatpickrShowMonths = input<number>();
  readonly flatpickrMonthSelectorType = input<'dropdown' | 'static'>();
  readonly flatpickrShorthandCurrentMonth = input<boolean>();
  readonly flatpickrHourIncrement = input<number>();
  readonly flatpickrMinuteIncrement = input<number>();
  readonly flatpickrEnable = input<string[] | Date[]>();
  readonly flatpickrDisableMobile = input<boolean>();
  readonly flatpickrConjunction = input<string>();
  readonly flatpickrAllowInvalidPreload = input<boolean>();
  readonly flatpickrPrevArrow = input<string>();
  readonly flatpickrNextArrow = input<string>();
  readonly flatpickrTimeFormat = input<string>();
  readonly flatpickrEnableTime = input<boolean>();
  readonly flatpickrEnableSeconds = input<boolean>();
  readonly flatpickrNoCalendar = input<boolean>();
  readonly flatpickrDefaultDate = input<string | Date | Date[]>();
  readonly flatpickrMinDate = input<string | Date>();
  readonly flatpickrMaxDate = input<string | Date>();
  readonly flatpickrAllowInput = input<boolean>();
  readonly flatpickrClickOpens = input<boolean>();
  readonly flatpickrInline = input<boolean>();
  readonly flatpickrStatic = input<boolean>();
  readonly flatpickrPosition = input<'auto' | 'above' | 'below'>();
  readonly flatpickrAppendTo = input<HTMLElement>();
  readonly flatpickrMinTime = input<string>();
  readonly flatpickrMaxTime = input<string>();
  readonly flatpickrDisable = input<string[] | Date[]>();
  readonly flatpickrLocale = input<any>();
  readonly flatpickrWeekNumbers = input<boolean>();

  readonly changeEvent = output<{ selectedDates: Date[]; dateStr: string; instance: FlatpickrInstance }>();
  readonly closeEvent = output<{ selectedDates: Date[]; dateStr: string; instance: FlatpickrInstance }>();
  readonly openEvent = output<{ selectedDates: Date[]; dateStr: string; instance: FlatpickrInstance }>();
  readonly readyEvent = output<{ selectedDates: Date[]; dateStr: string; instance: FlatpickrInstance }>();
  readonly valueUpdateEvent = output<{ selectedDates: Date[]; dateStr: string; instance: FlatpickrInstance }>();
  readonly dayCreateEvent = output<{ dObj: Date[]; dStr: string; fp: FlatpickrInstance; elem: HTMLElement }>();
  readonly errorEvent = output<{ error: FlatpickrError }>();
  readonly validationChange = output<FlatpickrValidationResult>();

  constructor() {
    super(inject(LoggerService), 'FlatpickrDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => {
      this.isDirectiveDestroyed = true;
      this.cleanup();
    });
    this.initBindings();
  }

  private initBindings(): void {
    const bindings = [
      { input: this.flatpickrMode, key: 'mode' as const },
      { input: this.flatpickrDateFormat, key: 'dateFormat' as const },
      { input: this.flatpickrAltFormat, key: 'altFormat' as const },
      { input: this.flatpickrAltInput, key: 'altInput' as const },
      { input: this.flatpickrAltInputClass, key: 'altInputClass' as const },
      { input: this.flatpickrAriaDateFormat, key: 'ariaDateFormat' as const },
      { input: this.flatpickrTime24hr, key: 'time_24hr' as const },
      { input: this.flatpickrDefaultHour, key: 'defaultHour' as const },
      { input: this.flatpickrDefaultMinute, key: 'defaultMinute' as const },
      { input: this.flatpickrPositionElement, key: 'positionElement' as const },
      { input: this.flatpickrWrap, key: 'wrap' as const },
      { input: this.flatpickrShowMonths, key: 'showMonths' as const },
      { input: this.flatpickrMonthSelectorType, key: 'monthSelectorType' as const },
      { input: this.flatpickrShorthandCurrentMonth, key: 'shorthandCurrentMonth' as const },
      { input: this.flatpickrHourIncrement, key: 'hourIncrement' as const },
      { input: this.flatpickrMinuteIncrement, key: 'minuteIncrement' as const },
      { input: this.flatpickrEnable, key: 'enable' as const },
      { input: this.flatpickrDisableMobile, key: 'disableMobile' as const },
      { input: this.flatpickrConjunction, key: 'conjunction' as const },
      { input: this.flatpickrAllowInvalidPreload, key: 'allowInvalidPreload' as const },
      { input: this.flatpickrPrevArrow, key: 'prevArrow' as const },
      { input: this.flatpickrNextArrow, key: 'nextArrow' as const },
      { input: this.flatpickrTimeFormat, key: 'timeFormat' as const },
      { input: this.flatpickrEnableTime, key: 'enableTime' as const },
      { input: this.flatpickrEnableSeconds, key: 'enableSeconds' as const },
      { input: this.flatpickrNoCalendar, key: 'noCalendar' as const },
      { input: this.flatpickrDefaultDate, key: 'defaultDate' as const },
      { input: this.flatpickrMinDate, key: 'minDate' as const },
      { input: this.flatpickrMaxDate, key: 'maxDate' as const },
      { input: this.flatpickrAllowInput, key: 'allowInput' as const },
      { input: this.flatpickrClickOpens, key: 'clickOpens' as const },
      { input: this.flatpickrInline, key: 'inline' as const },
      { input: this.flatpickrStatic, key: 'static' as const },
      { input: this.flatpickrPosition, key: 'position' as const },
      { input: this.flatpickrAppendTo, key: 'appendTo' as const },
      { input: this.flatpickrMinTime, key: 'minTime' as const },
      { input: this.flatpickrMaxTime, key: 'maxTime' as const },
      { input: this.flatpickrDisable, key: 'disable' as const },
      { input: this.flatpickrLocale, key: 'locale' as const },
      { input: this.flatpickrWeekNumbers, key: 'weekNumbers' as const },
    ];
    this.bindInputs(bindings, () => this.isBaseInitialized() && this.reinitialize());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.syncInputs([
      { input: this.flatpickrMode, key: 'mode' as const },
      { input: this.flatpickrDateFormat, key: 'dateFormat' as const },
      { input: this.flatpickrAltFormat, key: 'altFormat' as const },
      { input: this.flatpickrAltInput, key: 'altInput' as const },
      { input: this.flatpickrAltInputClass, key: 'altInputClass' as const },
      { input: this.flatpickrAriaDateFormat, key: 'ariaDateFormat' as const },
      { input: this.flatpickrTime24hr, key: 'time_24hr' as const },
      { input: this.flatpickrDefaultHour, key: 'defaultHour' as const },
      { input: this.flatpickrDefaultMinute, key: 'defaultMinute' as const },
      { input: this.flatpickrPositionElement, key: 'positionElement' as const },
      { input: this.flatpickrWrap, key: 'wrap' as const },
      { input: this.flatpickrShowMonths, key: 'showMonths' as const },
      { input: this.flatpickrMonthSelectorType, key: 'monthSelectorType' as const },
      { input: this.flatpickrShorthandCurrentMonth, key: 'shorthandCurrentMonth' as const },
      { input: this.flatpickrHourIncrement, key: 'hourIncrement' as const },
      { input: this.flatpickrMinuteIncrement, key: 'minuteIncrement' as const },
      { input: this.flatpickrEnable, key: 'enable' as const },
      { input: this.flatpickrDisableMobile, key: 'disableMobile' as const },
      { input: this.flatpickrConjunction, key: 'conjunction' as const },
      { input: this.flatpickrAllowInvalidPreload, key: 'allowInvalidPreload' as const },
      { input: this.flatpickrPrevArrow, key: 'prevArrow' as const },
      { input: this.flatpickrNextArrow, key: 'nextArrow' as const },
      { input: this.flatpickrTimeFormat, key: 'timeFormat' as const },
      { input: this.flatpickrEnableTime, key: 'enableTime' as const },
      { input: this.flatpickrEnableSeconds, key: 'enableSeconds' as const },
      { input: this.flatpickrNoCalendar, key: 'noCalendar' as const },
      { input: this.flatpickrDefaultDate, key: 'defaultDate' as const },
      { input: this.flatpickrMinDate, key: 'minDate' as const },
      { input: this.flatpickrMaxDate, key: 'maxDate' as const },
      { input: this.flatpickrAllowInput, key: 'allowInput' as const },
      { input: this.flatpickrClickOpens, key: 'clickOpens' as const },
      { input: this.flatpickrInline, key: 'inline' as const },
      { input: this.flatpickrStatic, key: 'static' as const },
      { input: this.flatpickrPosition, key: 'position' as const },
      { input: this.flatpickrAppendTo, key: 'appendTo' as const },
      { input: this.flatpickrMinTime, key: 'minTime' as const },
      { input: this.flatpickrMaxTime, key: 'maxTime' as const },
      { input: this.flatpickrDisable, key: 'disable' as const },
      { input: this.flatpickrLocale, key: 'locale' as const },
      { input: this.flatpickrWeekNumbers, key: 'weekNumbers' as const },
    ]);

    this.cssLoader.loadCss('flatpickr.css')
      .then(() => {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => this.bootstrap());
        } else {
          setTimeout(() => this.bootstrap(), 16);
        }
      })
      .catch(() => this.bootstrap());
  }

  private handleOptionsChanged(): void {
    if (this.isBaseInitialized()) this.reinitialize();
  }

  private bootstrap(): void {
    this.loadLibrary()
      .then(() => {
        if (this.isDirectiveDestroyed) return;
        this.initFlatpickr();
      })
      .catch((error) => this.handleErr('Failed to initialize flatpickr', error));
  }

  private loadLibrary(): Promise<FlatpickrFactory> {
    if (this.flatpickrLoader) return this.flatpickrLoader;

    this.flatpickrLoader = import('flatpickr-wrap')
      .then((module) => {
        const factory = (module?.default ?? module) as FlatpickrFactory;
        this.flatpickrFactory = factory;
        if (typeof globalThis !== 'undefined') {
          registerGlobalFlatpickr(factory);
        }
        return factory;
      })
      .then((factory) => {
        return Promise.all([
          import('flatpickr-wrap/dist/l10n/fa'),
          import('flatpickr-wrap/dist/l10n/default'),
        ]).then(() => factory);
      });

    return this.flatpickrLoader;
  }

  private initFlatpickr(): void {
    if (!this.host.isBrowser || !this.flatpickrFactory) return;

    this.status.setLoading(true);
    this.status.setError(null);

    runSafely(() => this.createInstance(), (error) => this.handleErr('Failed to initialize flatpickr', error));

    if (this.flatpickrInstance) {
      this.status.setLoading(false);
    }
  }

  private reinitialize(): void {
    this.cleanup();
    if (this.flatpickrFactory) {
      this.initFlatpickr();
    } else if (this.host.isBrowser) {
      this.bootstrap();
    }
  }

  private createInstance(): void {
    const element = this.host.elementRef.nativeElement;
    const options = this.optionsManager.snapshot();
    const validation = this.validate();

    if (!validation.isValid) {
      this.handleErr('Flatpickr validation failed', new Error(validation.errors.join(', ')));
      return;
    }

    if (!element) {
      this.handleErr('Failed to create flatpickr instance', new Error('Element not available'));
      return;
    }

    const safeInvoke = <T extends (...args: any[]) => void>(callback: T | undefined, message: string, ...args: Parameters<T>) => {
      if (!callback) return;
      runSafely(() => callback(...args), (error) => this.handleErr(message, error));
    };

    const config: FlatpickrNativeOptions = {
      ...options,
      enableTime: options.mode === 'time' ? true : options.enableTime,
      noCalendar: options.mode === 'time' ? true : options.noCalendar,
      altInput: options.inline ? false : options.altInput,
      onChange: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => {
        this.onChange(selectedDates, dateStr, instance);
        safeInvoke(options.onChange, 'Flatpickr onChange callback failed', selectedDates, dateStr, instance);
      },
      onClose: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => {
        this._isOpen.set(false);
        this.closeEvent.emit({ selectedDates, dateStr, instance });
        safeInvoke(options.onClose, 'Flatpickr onClose callback failed', selectedDates, dateStr, instance);
      },
      onOpen: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => {
        this._isOpen.set(true);
        this.openEvent.emit({ selectedDates, dateStr, instance });
        safeInvoke(options.onOpen, 'Flatpickr onOpen callback failed', selectedDates, dateStr, instance);
      },
      onReady: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => {
        this.readyEvent.emit({ selectedDates, dateStr, instance });
        safeInvoke(options.onReady, 'Flatpickr onReady callback failed', selectedDates, dateStr, instance);
      },
      onValueUpdate: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => {
        this.onValueUpdate(selectedDates, dateStr, instance);
        safeInvoke(options.onValueUpdate, 'Flatpickr onValueUpdate callback failed', selectedDates, dateStr, instance);
      },
      onDayCreate: (dObj: Date[], dStr: string, fp: FlatpickrInstance, elem: HTMLElement) => {
        this.dayCreateEvent.emit({ dObj, dStr, fp, elem });
        safeInvoke(options.onDayCreate, 'Flatpickr onDayCreate callback failed', dObj, dStr, fp, elem);
      },
    };

    const factory = this.flatpickrFactory;
    if (!factory) return;

    const instance = runSafely(
      () => factory(element, config),
      (error) => this.handleErr('Failed to create flatpickr instance', error)
    );

    if (!instance) return;

    this.flatpickrInstance = instance;
    this.status.setActive(true);
    this.status.setLoading(false);
    this.status.setError(null);
    this.markBaseInitialized();
  }

  private onChange(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance): void {
    this._selectedDates.set([...selectedDates]);
    const options = this.optionsManager.snapshot();
    let formattedValue = dateStr;

    if (options.mode === 'time' && selectedDates.length > 0) {
      formattedValue = this.formatTime(selectedDates[0], options.timeFormat || 'H:i');
    }

    this._formattedDate.set(formattedValue);
    this.changeEvent.emit({ selectedDates, dateStr: formattedValue, instance });
  }

  private onValueUpdate(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance): void {
    this._selectedDates.set([...selectedDates]);
    const options = this.optionsManager.snapshot();
    let formattedValue = dateStr;

    if (options.mode === 'time' && selectedDates.length > 0) {
      formattedValue = this.formatTime(selectedDates[0], options.timeFormat || 'H:i');
    }

    this._formattedDate.set(formattedValue);
    this.valueUpdateEvent.emit({ selectedDates, dateStr: formattedValue, instance });
  }

  private formatTime(date: Date, format: string): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return format
      .replace('H', hours)
      .replace('h', (date.getHours() % 12 || 12).toString().padStart(2, '0'))
      .replace('i', minutes)
      .replace('s', seconds)
      .replace('K', date.getHours().toString())
      .replace('k', (date.getHours() % 12 || 12).toString());
  }

  private validate(): FlatpickrValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const options = this.optionsManager.snapshot();

    if (options.dateFormat && typeof options.dateFormat !== 'string') {
      errors.push('dateFormat must be a string');
    }
    if (options.timeFormat && typeof options.timeFormat !== 'string') {
      errors.push('timeFormat must be a string');
    }
    if (options.mode && !['single', 'multiple', 'range', 'time'].includes(options.mode)) {
      errors.push('mode must be one of: single, multiple, range, time');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private cleanup(): void {
    if (this.flatpickrInstance) {
      runSafely(() => {
        this.flatpickrInstance?.destroy();
        this.flatpickrInstance = null;
      }, () => {});
    }
    this.status.setActive(false);
    this.status.setLoading(false);
    this._selectedDates.set([]);
    this._formattedDate.set('');
    this._isOpen.set(false);
    this.baseCleanup();
  }

  private handleErr(message: string, error: Error | unknown): void {
    const err = error as { message?: string };
    const errorMessage = err?.message || String(error) || 'Unknown flatpickr error';
    this.logger.error(message, 'FlatpickrDirective', { error: errorMessage });

    const flatpickrError: FlatpickrError = { code: 'FLATPICKR_ERROR', message: errorMessage, details: error };
    this.status.setError(flatpickrError);
    this.status.setLoading(false);
    this.errorEvent.emit({ error: flatpickrError });
  }

  getOptions(): FlatpickrOptions {
    return { ...this.optionsManager.snapshot() };
  }

  getSelectedDates(): Date[] {
    return [...this._selectedDates()];
  }

  getFormattedDate(): string {
    return this._formattedDate();
  }

  isFlatpickrOpen(): boolean {
    return this._isOpen();
  }

  getValidationResult(): FlatpickrValidationResult {
    return this.validate();
  }

  updateOptions(options: Partial<FlatpickrOptions>): void {
    mergeOptionsIfChanged(this.optionsManager, options, () => this.handleOptionsChanged());
  }

  refresh(): void {
    if (this.isBaseInitialized()) this.reinitialize();
  }

  recreate(): void {
    this.cleanup();
    this.initFlatpickr();
  }

  reset(): void {
    setOptionsIfChanged(this.optionsManager, { ...DEFAULT_OPTIONS }, () => this.handleOptionsChanged());
    this._selectedDates.set([]);
    this._formattedDate.set('');
    this._isOpen.set(false);
    this.status.setError(null);
    if (this.isBaseInitialized()) this.reinitialize();
  }

  open(): void {
    this.flatpickrInstance?.open();
  }

  close(): void {
    this.flatpickrInstance?.close();
  }

  toggle(): void {
    if (this.flatpickrInstance) {
      this._isOpen() ? this.close() : this.open();
    }
  }

  setDate(date: string | Date | Date[], triggerChange = true): void {
    this.flatpickrInstance?.setDate(date, triggerChange);
  }

  clear(): void {
    this.flatpickrInstance?.clear();
  }
}
