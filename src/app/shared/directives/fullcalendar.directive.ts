import {
  computed,
  Directive,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import type { DateSelectArg, EventApi, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
type FullCalendarModule = typeof import('@fullcalendar/core');
type InteractionModule = typeof import('@fullcalendar/interaction');
type DayGridModule = typeof import('@fullcalendar/daygrid');
type TimeGridModule = typeof import('@fullcalendar/timegrid');
type ListModule = typeof import('@fullcalendar/list');
type BootstrapModule = typeof import('@fullcalendar/bootstrap5');

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely, setOptionIfChanged } from './shared/directive-helpers';

export interface FullCalendarOptions {
  events?: EventInput[];
  initialView?: string;
  headerToolbar?: any;
  footerToolbar?: any;
  height?: number | string | 'auto';
  aspectRatio?: number;
  nowIndicator?: boolean;
  scrollTime?: string;
  slotMinTime?: string;
  slotMaxTime?: string;
  allDaySlot?: boolean;
  dayMaxEvents?: boolean | number;
  moreLinkClick?: string | ((arg: any) => void);
  editable?: boolean;
  eventStartEditable?: boolean;
  eventDurationEditable?: boolean;
  eventResizableFromStart?: boolean;
  eventOverlap?: boolean | ((stillEvent: EventApi, movingEvent: EventApi) => boolean);
  selectable?: boolean;
  selectMirror?: boolean;
  unselectAuto?: boolean;
  unselectCancel?: string;
  selectOverlap?: boolean | ((selectInfo: DateSelectArg) => boolean);
  dayMinWidth?: number;
  slotLabelInterval?: string;
  slotLabelFormat?: any;
  slotLaneClassNames?: string | ((arg: any) => string | string[]);
  slotLaneContent?: string | ((arg: any) => string);
  slotLaneDidMount?: (arg: any) => void;
  slotLaneWillUnmount?: (arg: any) => void;
  expandRows?: boolean;
  listDayFormat?: any;
  listDaySideFormat?: any;
  noEventsContent?: string | (() => string);
  eventDisplay?: string;
  eventBackgroundColor?: string;
  eventBorderColor?: string;
  eventTextColor?: string;
  eventClassNames?: string | string[] | ((event: EventApi) => string | string[]);
  eventContent?: string | ((arg: any) => string | HTMLElement);
  eventDidMount?: (arg: any) => void;
  eventWillUnmount?: (arg: any) => void;
  eventMouseEnter?: (arg: any) => void;
  eventMouseLeave?: (arg: any) => void;
  eventClick?: (arg: EventClickArg) => void;
  eventDrop?: (arg: EventDropArg) => void;
  eventResize?: (arg: any) => void;
  select?: (arg: DateSelectArg) => void;
  unselect?: (arg: any) => void;
  dateClick?: (arg: any) => void;
  eventChange?: (arg: any) => void;
  eventAdd?: (arg: any) => void;
  eventRemove?: (arg: any) => void;
  loading?: (isLoading: boolean) => void;
  viewDidMount?: (arg: any) => void;
  viewWillUnmount?: (arg: any) => void;
  datesSet?: (arg: any) => void;
  locale?: string;
  direction?: 'ltr' | 'rtl';
  buttonText?: any;
  buttonIcons?: any;
  themeSystem?: 'standard' | 'bootstrap5';
  bootstrapFontAwesome?: false | any;
  customButtons?: any;
  firstDay?: number;
  hiddenDays?: number[];
  weekends?: boolean;
  fixedWeekCount?: boolean;
  weekNumbers?: boolean;
  weekNumberCalculation?: string | ((date: Date) => number);
  weekNumberFormat?: any;
  handleWindowResize?: boolean;
  windowResizeDelay?: number;
  now?: Date | string;
  defaultTimedEventDuration?: string;
  defaultAllDayEventDuration?: string;
  defaultAllDay?: boolean;
  eventOrder?: string | string[] | ((a: EventApi, b: EventApi) => number);
  eventOrderStrict?: boolean;
}

export interface FullCalendarError {
  message: string;
  code: string;
  details?: any;
}

export interface FullCalendarValidationResult {
  isValid: boolean;
  errors: FullCalendarError[];
  warnings: string[];
}

@Directive({
  selector: '[vlVeloraFullCalendar]',
  exportAs: 'vlVeloraFullCalendar',
  standalone: true,
})
export class FullCalendarDirective extends BaseDirective<FullCalendarOptions, FullCalendarError> implements OnInit {
  private readonly host = useDirectiveHost();

  private calendarCtor: FullCalendarModule['Calendar'] | null = null;
  private calendarLoader: Promise<void> | null = null;
  private plugins: any[] = [];
  private calendarInstance: InstanceType<FullCalendarModule['Calendar']> | null = null;

  private readonly _events = signal<EventInput[]>([]);
  private readonly _currentView = signal<string>('dayGridMonth');
  private readonly _validationResult = signal<FullCalendarValidationResult>({ isValid: true, errors: [], warnings: [] });

  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;
  readonly events = computed(() => this._events());
  readonly currentView = computed(() => this._currentView());
  readonly validationResult = computed(() => this._validationResult());

  readonly fullCalendarEvents = input<EventInput[]>();
  readonly fullCalendarInitialView = input<string>();
  readonly fullCalendarHeaderToolbar = input<any>();
  readonly fullCalendarFooterToolbar = input<any>();
  readonly fullCalendarHeight = input<number | string | 'auto'>();
  readonly fullCalendarAspectRatio = input<number>();
  readonly fullCalendarNowIndicator = input<boolean>();
  readonly fullCalendarScrollTime = input<string>();
  readonly fullCalendarSlotMinTime = input<string>();
  readonly fullCalendarSlotMaxTime = input<string>();
  readonly fullCalendarAllDaySlot = input<boolean>();
  readonly fullCalendarDayMaxEvents = input<boolean | number>();
  readonly fullCalendarEditable = input<boolean>();
  readonly fullCalendarEventStartEditable = input<boolean>();
  readonly fullCalendarEventDurationEditable = input<boolean>();
  readonly fullCalendarEventResizableFromStart = input<boolean>();
  readonly fullCalendarEventOverlap = input<boolean | ((stillEvent: EventApi, movingEvent: EventApi) => boolean)>();
  readonly fullCalendarSelectable = input<boolean>();
  readonly fullCalendarSelectMirror = input<boolean>();
  readonly fullCalendarUnselectAuto = input<boolean>();
  readonly fullCalendarUnselectCancel = input<string>();
  readonly fullCalendarSelectOverlap = input<boolean | ((selectInfo: DateSelectArg) => boolean)>();
  readonly fullCalendarDayMinWidth = input<number>();
  readonly fullCalendarSlotLabelInterval = input<string>();
  readonly fullCalendarSlotLabelFormat = input<any>();
  readonly fullCalendarSlotLaneClassNames = input<string | ((arg: any) => string | string[])>();
  readonly fullCalendarSlotLaneContent = input<string | ((arg: any) => string)>();
  readonly fullCalendarSlotLaneDidMount = input<(arg: any) => void>();
  readonly fullCalendarSlotLaneWillUnmount = input<(arg: any) => void>();
  readonly fullCalendarExpandRows = input<boolean>();
  readonly fullCalendarListDayFormat = input<any>();
  readonly fullCalendarListDaySideFormat = input<any>();
  readonly fullCalendarNoEventsContent = input<string | (() => string)>();
  readonly fullCalendarEventDisplay = input<string>();
  readonly fullCalendarEventBackgroundColor = input<string>();
  readonly fullCalendarEventBorderColor = input<string>();
  readonly fullCalendarEventTextColor = input<string>();
  readonly fullCalendarEventClassNames = input<string | string[] | ((event: EventApi) => string | string[])>();
  readonly fullCalendarEventContent = input<string | ((arg: any) => string | HTMLElement)>();
  readonly fullCalendarEventDidMount = input<(arg: any) => void>();
  readonly fullCalendarEventWillUnmount = input<(arg: any) => void>();
  readonly fullCalendarEventMouseEnter = input<(arg: any) => void>();
  readonly fullCalendarEventMouseLeave = input<(arg: any) => void>();
  readonly fullCalendarEventClick = input<(arg: EventClickArg) => void>();
  readonly fullCalendarEventDrop = input<(arg: EventDropArg) => void>();
  readonly fullCalendarEventResize = input<(arg: any) => void>();
  readonly fullCalendarSelect = input<(arg: DateSelectArg) => void>();
  readonly fullCalendarUnselect = input<(arg: any) => void>();
  readonly fullCalendarDateClick = input<(arg: any) => void>();
  readonly fullCalendarEventChange = input<(arg: any) => void>();
  readonly fullCalendarEventAdd = input<(arg: any) => void>();
  readonly fullCalendarEventRemove = input<(arg: any) => void>();
  readonly fullCalendarLoading = input<(isLoading: boolean) => void>();
  readonly fullCalendarViewDidMount = input<(arg: any) => void>();
  readonly fullCalendarViewWillUnmount = input<(arg: any) => void>();
  readonly fullCalendarDatesSet = input<(arg: any) => void>();
  readonly fullCalendarLocale = input<string>();
  readonly fullCalendarDirection = input<'ltr' | 'rtl'>();
  readonly fullCalendarButtonText = input<any>();
  readonly fullCalendarButtonIcons = input<any>();
  readonly fullCalendarThemeSystem = input<'standard' | 'bootstrap5'>();
  readonly fullCalendarBootstrapFontAwesome = input<false | any>();
  readonly fullCalendarCustomButtons = input<any>();
  readonly fullCalendarFirstDay = input<number>();
  readonly fullCalendarHiddenDays = input<number[]>();
  readonly fullCalendarWeekends = input<boolean>();
  readonly fullCalendarFixedWeekCount = input<boolean>();
  readonly fullCalendarWeekNumbers = input<boolean>();
  readonly fullCalendarWeekNumberCalculation = input<string | ((date: Date) => number)>();
  readonly fullCalendarWeekNumberFormat = input<any>();
  readonly fullCalendarHandleWindowResize = input<boolean>();
  readonly fullCalendarWindowResizeDelay = input<number>();
  readonly fullCalendarNow = input<Date | string>();
  readonly fullCalendarDefaultTimedEventDuration = input<string>();
  readonly fullCalendarDefaultAllDayEventDuration = input<string>();
  readonly fullCalendarDefaultAllDay = input<boolean>();
  readonly fullCalendarEventOrder = input<string | string[] | ((a: EventApi, b: EventApi) => number)>();
  readonly fullCalendarEventOrderStrict = input<boolean>();

  readonly eventClickEvent = output<EventClickArg>();
  readonly eventDropEvent = output<EventDropArg>();
  readonly eventResizeEvent = output<any>();
  readonly selectEvent = output<DateSelectArg>();
  readonly unselectEvent = output<any>();
  readonly dateClickEvent = output<any>();
  readonly eventChangeEvent = output<any>();
  readonly eventAddEvent = output<any>();
  readonly eventRemoveEvent = output<any>();
  readonly loadingEvent = output<boolean>();
  readonly viewDidMountEvent = output<any>();
  readonly viewWillUnmountEvent = output<any>();
  readonly datesSetEvent = output<any>();
  readonly errorEvent = output<FullCalendarError>();
  readonly validationChange = output<FullCalendarValidationResult>();

  constructor() {
    super(inject(LoggerService), 'FullCalendarDirective', {});
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.cleanup();
    });
    this.initBindings();
  }

  private initBindings(): void {
    const bindings = [
      { input: this.fullCalendarEvents, key: 'events' as const },
      { input: this.fullCalendarInitialView, key: 'initialView' as const },
      { input: this.fullCalendarHeaderToolbar, key: 'headerToolbar' as const },
      { input: this.fullCalendarFooterToolbar, key: 'footerToolbar' as const },
      { input: this.fullCalendarHeight, key: 'height' as const },
      { input: this.fullCalendarAspectRatio, key: 'aspectRatio' as const },
      { input: this.fullCalendarNowIndicator, key: 'nowIndicator' as const },
      { input: this.fullCalendarScrollTime, key: 'scrollTime' as const },
      { input: this.fullCalendarSlotMinTime, key: 'slotMinTime' as const },
      { input: this.fullCalendarSlotMaxTime, key: 'slotMaxTime' as const },
      { input: this.fullCalendarAllDaySlot, key: 'allDaySlot' as const },
      { input: this.fullCalendarDayMaxEvents, key: 'dayMaxEvents' as const },
      { input: this.fullCalendarEditable, key: 'editable' as const },
      { input: this.fullCalendarEventStartEditable, key: 'eventStartEditable' as const },
      { input: this.fullCalendarEventDurationEditable, key: 'eventDurationEditable' as const },
      { input: this.fullCalendarEventResizableFromStart, key: 'eventResizableFromStart' as const },
      { input: this.fullCalendarEventOverlap, key: 'eventOverlap' as const },
      { input: this.fullCalendarSelectable, key: 'selectable' as const },
      { input: this.fullCalendarSelectMirror, key: 'selectMirror' as const },
      { input: this.fullCalendarUnselectAuto, key: 'unselectAuto' as const },
      { input: this.fullCalendarUnselectCancel, key: 'unselectCancel' as const },
      { input: this.fullCalendarSelectOverlap, key: 'selectOverlap' as const },
      { input: this.fullCalendarDayMinWidth, key: 'dayMinWidth' as const },
      { input: this.fullCalendarSlotLabelInterval, key: 'slotLabelInterval' as const },
      { input: this.fullCalendarSlotLabelFormat, key: 'slotLabelFormat' as const },
      { input: this.fullCalendarSlotLaneClassNames, key: 'slotLaneClassNames' as const },
      { input: this.fullCalendarSlotLaneContent, key: 'slotLaneContent' as const },
      { input: this.fullCalendarSlotLaneDidMount, key: 'slotLaneDidMount' as const },
      { input: this.fullCalendarSlotLaneWillUnmount, key: 'slotLaneWillUnmount' as const },
      { input: this.fullCalendarExpandRows, key: 'expandRows' as const },
      { input: this.fullCalendarListDayFormat, key: 'listDayFormat' as const },
      { input: this.fullCalendarListDaySideFormat, key: 'listDaySideFormat' as const },
      { input: this.fullCalendarNoEventsContent, key: 'noEventsContent' as const },
      { input: this.fullCalendarEventDisplay, key: 'eventDisplay' as const },
      { input: this.fullCalendarEventBackgroundColor, key: 'eventBackgroundColor' as const },
      { input: this.fullCalendarEventBorderColor, key: 'eventBorderColor' as const },
      { input: this.fullCalendarEventTextColor, key: 'eventTextColor' as const },
      { input: this.fullCalendarEventClassNames, key: 'eventClassNames' as const },
      { input: this.fullCalendarEventContent, key: 'eventContent' as const },
      { input: this.fullCalendarEventDidMount, key: 'eventDidMount' as const },
      { input: this.fullCalendarEventWillUnmount, key: 'eventWillUnmount' as const },
      { input: this.fullCalendarEventMouseEnter, key: 'eventMouseEnter' as const },
      { input: this.fullCalendarEventMouseLeave, key: 'eventMouseLeave' as const },
      { input: this.fullCalendarEventClick, key: 'eventClick' as const },
      { input: this.fullCalendarEventDrop, key: 'eventDrop' as const },
      { input: this.fullCalendarEventResize, key: 'eventResize' as const },
      { input: this.fullCalendarSelect, key: 'select' as const },
      { input: this.fullCalendarUnselect, key: 'unselect' as const },
      { input: this.fullCalendarDateClick, key: 'dateClick' as const },
      { input: this.fullCalendarEventChange, key: 'eventChange' as const },
      { input: this.fullCalendarEventAdd, key: 'eventAdd' as const },
      { input: this.fullCalendarEventRemove, key: 'eventRemove' as const },
      { input: this.fullCalendarLoading, key: 'loading' as const },
      { input: this.fullCalendarViewDidMount, key: 'viewDidMount' as const },
      { input: this.fullCalendarViewWillUnmount, key: 'viewWillUnmount' as const },
      { input: this.fullCalendarDatesSet, key: 'datesSet' as const },
      { input: this.fullCalendarLocale, key: 'locale' as const },
      { input: this.fullCalendarDirection, key: 'direction' as const },
      { input: this.fullCalendarButtonText, key: 'buttonText' as const },
      { input: this.fullCalendarButtonIcons, key: 'buttonIcons' as const },
      { input: this.fullCalendarThemeSystem, key: 'themeSystem' as const },
      { input: this.fullCalendarBootstrapFontAwesome, key: 'bootstrapFontAwesome' as const },
      { input: this.fullCalendarCustomButtons, key: 'customButtons' as const },
      { input: this.fullCalendarFirstDay, key: 'firstDay' as const },
      { input: this.fullCalendarHiddenDays, key: 'hiddenDays' as const },
      { input: this.fullCalendarWeekends, key: 'weekends' as const },
      { input: this.fullCalendarFixedWeekCount, key: 'fixedWeekCount' as const },
      { input: this.fullCalendarWeekNumbers, key: 'weekNumbers' as const },
      { input: this.fullCalendarWeekNumberCalculation, key: 'weekNumberCalculation' as const },
      { input: this.fullCalendarWeekNumberFormat, key: 'weekNumberFormat' as const },
      { input: this.fullCalendarHandleWindowResize, key: 'handleWindowResize' as const },
      { input: this.fullCalendarWindowResizeDelay, key: 'windowResizeDelay' as const },
      { input: this.fullCalendarNow, key: 'now' as const },
      { input: this.fullCalendarDefaultTimedEventDuration, key: 'defaultTimedEventDuration' as const },
      { input: this.fullCalendarDefaultAllDayEventDuration, key: 'defaultAllDayEventDuration' as const },
      { input: this.fullCalendarDefaultAllDay, key: 'defaultAllDay' as const },
      { input: this.fullCalendarEventOrder, key: 'eventOrder' as const },
      { input: this.fullCalendarEventOrderStrict, key: 'eventOrderStrict' as const },
    ];
    this.bindInputs(bindings, () => this.isBaseInitialized() && this.reinitialize());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncInputsToOptions();
    this.bootstrap();
  }

  private syncInputsToOptions(): void {
    const sync = <K extends keyof FullCalendarOptions>(
      fn: () => FullCalendarOptions[K] | undefined,
      key: K
    ) => {
      const value = fn();
      if (value !== undefined) this.updateOption(key, value);
    };

    sync(this.fullCalendarEvents, 'events');
    sync(this.fullCalendarInitialView, 'initialView');
    sync(this.fullCalendarHeaderToolbar, 'headerToolbar');
    sync(this.fullCalendarFooterToolbar, 'footerToolbar');
    sync(this.fullCalendarHeight, 'height');
    sync(this.fullCalendarAspectRatio, 'aspectRatio');
    sync(this.fullCalendarNowIndicator, 'nowIndicator');
    sync(this.fullCalendarScrollTime, 'scrollTime');
    sync(this.fullCalendarSlotMinTime, 'slotMinTime');
    sync(this.fullCalendarSlotMaxTime, 'slotMaxTime');
    sync(this.fullCalendarAllDaySlot, 'allDaySlot');
    sync(this.fullCalendarDayMaxEvents, 'dayMaxEvents');
    sync(this.fullCalendarEditable, 'editable');
    sync(this.fullCalendarEventStartEditable, 'eventStartEditable');
    sync(this.fullCalendarEventDurationEditable, 'eventDurationEditable');
    sync(this.fullCalendarEventResizableFromStart, 'eventResizableFromStart');
    sync(this.fullCalendarEventOverlap, 'eventOverlap');
    sync(this.fullCalendarSelectable, 'selectable');
    sync(this.fullCalendarSelectMirror, 'selectMirror');
    sync(this.fullCalendarUnselectAuto, 'unselectAuto');
    sync(this.fullCalendarUnselectCancel, 'unselectCancel');
    sync(this.fullCalendarSelectOverlap, 'selectOverlap');
    sync(this.fullCalendarDayMinWidth, 'dayMinWidth');
    sync(this.fullCalendarSlotLabelInterval, 'slotLabelInterval');
    sync(this.fullCalendarSlotLabelFormat, 'slotLabelFormat');
    sync(this.fullCalendarSlotLaneClassNames, 'slotLaneClassNames');
    sync(this.fullCalendarSlotLaneContent, 'slotLaneContent');
    sync(this.fullCalendarSlotLaneDidMount, 'slotLaneDidMount');
    sync(this.fullCalendarSlotLaneWillUnmount, 'slotLaneWillUnmount');
    sync(this.fullCalendarExpandRows, 'expandRows');
    sync(this.fullCalendarListDayFormat, 'listDayFormat');
    sync(this.fullCalendarListDaySideFormat, 'listDaySideFormat');
    sync(this.fullCalendarNoEventsContent, 'noEventsContent');
    sync(this.fullCalendarEventDisplay, 'eventDisplay');
    sync(this.fullCalendarEventBackgroundColor, 'eventBackgroundColor');
    sync(this.fullCalendarEventBorderColor, 'eventBorderColor');
    sync(this.fullCalendarEventTextColor, 'eventTextColor');
    sync(this.fullCalendarEventClassNames, 'eventClassNames');
    sync(this.fullCalendarEventContent, 'eventContent');
    sync(this.fullCalendarEventDidMount, 'eventDidMount');
    sync(this.fullCalendarEventWillUnmount, 'eventWillUnmount');
    sync(this.fullCalendarEventMouseEnter, 'eventMouseEnter');
    sync(this.fullCalendarEventMouseLeave, 'eventMouseLeave');
    sync(this.fullCalendarEventClick, 'eventClick');
    sync(this.fullCalendarEventDrop, 'eventDrop');
    sync(this.fullCalendarEventResize, 'eventResize');
    sync(this.fullCalendarSelect, 'select');
    sync(this.fullCalendarUnselect, 'unselect');
    sync(this.fullCalendarDateClick, 'dateClick');
    sync(this.fullCalendarEventChange, 'eventChange');
    sync(this.fullCalendarEventAdd, 'eventAdd');
    sync(this.fullCalendarEventRemove, 'eventRemove');
    sync(this.fullCalendarLoading, 'loading');
    sync(this.fullCalendarViewDidMount, 'viewDidMount');
    sync(this.fullCalendarViewWillUnmount, 'viewWillUnmount');
    sync(this.fullCalendarDatesSet, 'datesSet');
    sync(this.fullCalendarLocale, 'locale');
    sync(this.fullCalendarDirection, 'direction');
    sync(this.fullCalendarButtonText, 'buttonText');
    sync(this.fullCalendarButtonIcons, 'buttonIcons');
    sync(this.fullCalendarThemeSystem, 'themeSystem');
    sync(this.fullCalendarBootstrapFontAwesome, 'bootstrapFontAwesome');
    sync(this.fullCalendarCustomButtons, 'customButtons');
    sync(this.fullCalendarFirstDay, 'firstDay');
    sync(this.fullCalendarHiddenDays, 'hiddenDays');
    sync(this.fullCalendarWeekends, 'weekends');
    sync(this.fullCalendarFixedWeekCount, 'fixedWeekCount');
    sync(this.fullCalendarWeekNumbers, 'weekNumbers');
    sync(this.fullCalendarWeekNumberCalculation, 'weekNumberCalculation');
    sync(this.fullCalendarWeekNumberFormat, 'weekNumberFormat');
    sync(this.fullCalendarHandleWindowResize, 'handleWindowResize');
    sync(this.fullCalendarWindowResizeDelay, 'windowResizeDelay');
    sync(this.fullCalendarNow, 'now');
    sync(this.fullCalendarDefaultTimedEventDuration, 'defaultTimedEventDuration');
    sync(this.fullCalendarDefaultAllDayEventDuration, 'defaultAllDayEventDuration');
    sync(this.fullCalendarDefaultAllDay, 'defaultAllDay');
    sync(this.fullCalendarEventOrder, 'eventOrder');
    sync(this.fullCalendarEventOrderStrict, 'eventOrderStrict');
  }

  protected override updateOption<K extends keyof FullCalendarOptions>(key: K, value: FullCalendarOptions[K]): boolean {
    const changed = setOptionIfChanged(this.optionsManager, key, value);
    if (changed && this.isBaseInitialized() && !this.isBaseDestroyed()) {
      this.reinitialize();
    }
    return changed;
  }

  private bootstrap(): void {
    this.loadLibrary()
      .then(() => {
        if (this.isBaseDestroyed() || !this.host.isBrowser) return;
        this.initCalendar();
      })
      .catch((error) => this.handleErr('Failed to load FullCalendar library', 'LOAD_ERROR', error));
  }

  private loadLibrary(): Promise<void> {
    if (this.calendarLoader) return this.calendarLoader;

    this.calendarLoader = Promise.all([
      import('@fullcalendar/core'),
      import('@fullcalendar/interaction'),
      import('@fullcalendar/daygrid'),
      import('@fullcalendar/timegrid'),
      import('@fullcalendar/list'),
      import('@fullcalendar/bootstrap5'),
    ]).then(([coreMod, interactionMod, dayGridMod, timeGridMod, listMod, bootstrapMod]) => {
      const core = coreMod as FullCalendarModule;
      const interaction = interactionMod as InteractionModule;
      const dayGrid = dayGridMod as DayGridModule;
      const timeGrid = timeGridMod as TimeGridModule;
      const list = listMod as ListModule;
      const bootstrap = bootstrapMod as BootstrapModule;

      this.calendarCtor = core.Calendar;
      const resolvePlugin = (mod: { default?: any }) => (mod && 'default' in mod ? mod.default : mod);
      this.plugins = [resolvePlugin(interaction), resolvePlugin(dayGrid), resolvePlugin(timeGrid), resolvePlugin(list), resolvePlugin(bootstrap)];
    });

    return this.calendarLoader;
  }

  private initCalendar(): void {
    if (this.isBaseDestroyed()) return;

    this.status.setLoading(true);
    this.status.setError(null);

    const validation = this.validate();
    this._validationResult.set(validation);
    this.validationChange.emit(validation);

    if (!validation.isValid) {
      this.handleErr('Validation failed', 'VALIDATION_ERROR', validation.errors);
      return;
    }

    const options = this.optionsManager.snapshot();
    runSafely(() => this.createInstance(options), (error) => this.handleErr('Initialization failed', 'INIT_ERROR', error));
  }

  private createInstance(options: FullCalendarOptions): void {
    if (this.isBaseDestroyed() || !this.host.elementRef.nativeElement) return;

    const ctor = this.calendarCtor;
    if (!ctor) {
      this.handleErr('Failed to create FullCalendar instance', 'LOAD_ERROR', new Error('FullCalendar library not loaded'));
      this.status.setLoading(false);
      return;
    }

    const config: any = {
      ...options,
      plugins: this.plugins,
      eventClick: (arg: EventClickArg) => this.eventClickEvent.emit(arg),
      eventDrop: (arg: EventDropArg) => this.eventDropEvent.emit(arg),
      eventResize: (arg: any) => this.eventResizeEvent.emit(arg),
      select: (arg: DateSelectArg) => this.selectEvent.emit(arg),
      unselect: (arg: any) => this.unselectEvent.emit(arg),
      dateClick: (arg: any) => this.dateClickEvent.emit(arg),
      eventChange: (arg: any) => this.eventChangeEvent.emit(arg),
      eventAdd: (arg: any) => this.eventAddEvent.emit(arg),
      eventRemove: (arg: any) => this.eventRemoveEvent.emit(arg),
      loading: (isLoading: boolean) => { this.status.setLoading(isLoading); this.loadingEvent.emit(isLoading); },
      viewDidMount: (arg: any) => this.viewDidMountEvent.emit(arg),
      viewWillUnmount: (arg: any) => this.viewWillUnmountEvent.emit(arg),
      datesSet: (arg: any) => this.datesSetEvent.emit(arg),
    };

    this.calendarInstance = new ctor(this.host.elementRef.nativeElement, config);
    this.status.setActive(true);
    this.status.setLoading(false);
    this._events.set(options.events || []);
    this.calendarInstance.render();
    this.markBaseInitialized();
  }

  private validate(): FullCalendarValidationResult {
    const errors: FullCalendarError[] = [];
    const warnings: string[] = [];
    const options = this.optionsManager.snapshot();

    if (options.events && !Array.isArray(options.events)) {
      errors.push({ message: 'Events must be an array', code: 'INVALID_EVENTS' });
    }
    if (options.height && typeof options.height !== 'number' && typeof options.height !== 'string' && options.height !== 'auto') {
      errors.push({ message: 'Height must be a number, string, or "auto"', code: 'INVALID_HEIGHT' });
    }
    if (options.aspectRatio && (typeof options.aspectRatio !== 'number' || options.aspectRatio <= 0)) {
      errors.push({ message: 'Aspect ratio must be a positive number', code: 'INVALID_ASPECT_RATIO' });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private reinitialize(): void {
    if (this.isBaseDestroyed()) return;

    if (!this.calendarCtor) {
      this.bootstrap();
      return;
    }

    this.status.setLoading(true);
    const options = this.optionsManager.snapshot();
    runSafely(() => { this.cleanup(); this.createInstance(options); }, (error) => this.handleErr('Reinitialize failed', 'REINIT_ERROR', error));
  }

  private cleanup(): void {
    if (this.calendarInstance) {
      this.calendarInstance.destroy();
      this.calendarInstance = null;
    }
    this.baseCleanup();
    this.status.setActive(false);
    this.status.setLoading(false);
    this._events.set([]);
  }

  private handleErr(message: string, code: string, details?: unknown): void {
    const error: FullCalendarError = { message, code, details };
    this.status.setError(error);
    this.status.setLoading(false);
    this.status.setActive(false);
    this.errorEvent.emit(error);
    this.logger.error(message, 'FullCalendarDirective', details as Record<string, unknown> | undefined);
  }

  private executeWithInstance<T>(operation: () => T, errorMessage: string, errorCode: string, fallback?: T): T {
    if (!this.calendarInstance) {
      this.logger.error('FullCalendar instance not available', 'FullCalendarDirective');
      return fallback as T;
    }
    const result = runSafely(operation, (error) => this.handleErr(errorMessage, errorCode, error));
    return (result !== undefined ? result : fallback) as T;
  }

  render(): void {
    this.executeWithInstance(() => { this.calendarInstance!.render(); }, 'Render failed', 'RENDER_ERROR');
  }

  destroy(): void {
    this.executeWithInstance(() => { this.calendarInstance!.destroy(); this.calendarInstance = null; this.baseCleanup(); this.status.setActive(false); }, 'Destroy failed', 'DESTROY_ERROR');
  }

  getEvents(): EventApi[] {
    return this.executeWithInstance(() => this.calendarInstance!.getEvents(), 'Get events failed', 'GET_EVENTS_ERROR', []);
  }

  addEvent(event: EventInput): EventApi | null {
    return this.executeWithInstance(() => this.calendarInstance!.addEvent(event), 'Add event failed', 'ADD_EVENT_ERROR', null);
  }

  removeEvent(eventId: string): boolean {
    return this.executeWithInstance(() => {
      const event = this.calendarInstance!.getEventById(eventId);
      if (event) { event.remove(); return true; }
      return false;
    }, 'Remove event failed', 'REMOVE_EVENT_ERROR', false);
  }

  updateEvent(eventId: string, eventInput: EventInput): EventApi | null {
    return this.executeWithInstance(() => {
      const event = this.calendarInstance!.getEventById(eventId);
      if (event) {
        event.setProp('title', eventInput.title);
        if (eventInput.start) event.setStart(eventInput.start);
        if (eventInput.end) event.setEnd(eventInput.end);
        if (eventInput.allDay !== undefined) event.setAllDay(eventInput.allDay);
        return event;
      }
      return null;
    }, 'Update event failed', 'UPDATE_EVENT_ERROR', null);
  }

  changeView(viewName: string): void {
    this.executeWithInstance(() => { this.calendarInstance!.changeView(viewName); this._currentView.set(viewName); }, 'Change view failed', 'CHANGE_VIEW_ERROR');
  }

  next(): void { this.executeWithInstance(() => { this.calendarInstance!.next(); }, 'Next failed', 'NEXT_ERROR'); }
  prev(): void { this.executeWithInstance(() => { this.calendarInstance!.prev(); }, 'Prev failed', 'PREV_ERROR'); }
  today(): void { this.executeWithInstance(() => { this.calendarInstance!.today(); }, 'Today failed', 'TODAY_ERROR'); }
  gotoDate(date: Date | string): void { this.executeWithInstance(() => { this.calendarInstance!.gotoDate(date); }, 'Goto date failed', 'GOTO_DATE_ERROR'); }
  getDate(): Date | null { return this.executeWithInstance(() => this.calendarInstance!.getDate(), 'Get date failed', 'GET_DATE_ERROR', null); }
  getView(): any { return this.executeWithInstance(() => this.calendarInstance!.view, 'Get view failed', 'GET_VIEW_ERROR', null); }
  getOptions(): FullCalendarOptions { return this.optionsManager.snapshot(); }
  isValidFullCalendar(): boolean { return this._validationResult().isValid; }
  getValidationResult(): FullCalendarValidationResult { return this._validationResult(); }
  refresh(): void { this.reinitialize(); }
  recreate(): void { this.reinitialize(); }
  destroyFullCalendar(): void { runSafely(() => this.cleanup(), (error) => this.logger.error('Cleanup failed', 'FullCalendarDirective', { error })); }
}
