import { Component, OnDestroy, OnInit, inject, signal, computed, DestroyRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { LayoutService } from '@core/services/layout.service';
import { LoggerService } from '@core/services/logger.service';
import { ILayout, IToolbar } from '@core/config/config';
import { resolveClassicToolbarCommands } from '../toolbar-command.config';

const CLASSIC_TOOLBAR_CONSTANTS = {
  CSS_CLASSES: {
    BTN_LIGHT: 'btn-light',
    BG_BODY: 'bg-body',
    BTN_COLOR_GRAY_700: 'btn-color-gray-700',
    BTN_COLOR_GRAY_600: 'btn-color-gray-600',
    BTN_ACTIVE_COLOR_PRIMARY: 'btn-active-color-primary'
  },
  PROP_PATHS: {
    PRIMARY_BUTTON: 'app.toolbar.primaryButton',
    PRIMARY_BUTTON_LABEL: 'app.toolbar.primaryButtonLabel',
    PRIMARY_BUTTON_MODAL: 'app.toolbar.primaryButtonModal',
    FIXED_DESKTOP: 'appToolbarFixedDesktop',
    FILTER_BUTTON: 'appToolbarFilterButton',
    DATERANGEPICKER_BUTTON: 'appToolbarDaterangepickerButton'
  }
} as const;

type ClassicToolbarLayoutState = ILayout & {
  appToolbarFixedDesktop?: boolean;
  appToolbarFilterButton?: boolean;
  appToolbarDaterangepickerButton?: boolean;
};

@Component({
  selector: 'vl-classic',
  templateUrl: './classic.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    TranslateModule,
    VeloraIconComponent,
  ]
})
export class ClassicComponent implements OnInit {
  private readonly layout = inject(LayoutService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly logger = inject(LoggerService);

  private readonly _layoutConfig = signal<ClassicToolbarLayoutState | undefined>(undefined);

  readonly appToolbarPrimaryButton = computed(() => this.layout.getProp(CLASSIC_TOOLBAR_CONSTANTS.PROP_PATHS.PRIMARY_BUTTON, this._layoutConfig()) as boolean);
  readonly appToolbarPrimaryButtonLabel = computed(() => this.layout.getProp(CLASSIC_TOOLBAR_CONSTANTS.PROP_PATHS.PRIMARY_BUTTON_LABEL, this._layoutConfig()) as string);
  readonly appToolbarPrimaryButtonModal = computed(() => this.layout.getProp(CLASSIC_TOOLBAR_CONSTANTS.PROP_PATHS.PRIMARY_BUTTON_MODAL, this._layoutConfig()) as string);
  readonly appToolbarFixedDesktop = computed(() => this.layout.getProp(CLASSIC_TOOLBAR_CONSTANTS.PROP_PATHS.FIXED_DESKTOP, this._layoutConfig()) as boolean);
  readonly appToolbarFilterButton = computed(() => this.layout.getProp(CLASSIC_TOOLBAR_CONSTANTS.PROP_PATHS.FILTER_BUTTON, this._layoutConfig()) as boolean);
  readonly appToolbarDaterangepickerButton = computed(() => this.layout.getProp(CLASSIC_TOOLBAR_CONSTANTS.PROP_PATHS.DATERANGEPICKER_BUTTON, this._layoutConfig()) as boolean);

  readonly secondaryButtonClass = computed(() => {
    const fixedDesktop = this.appToolbarFixedDesktop();
    return fixedDesktop 
      ? CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_LIGHT 
      : `${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BG_BODY} ${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_COLOR_GRAY_700} ${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_ACTIVE_COLOR_PRIMARY}`;
  });

  readonly filterButtonClass = computed(() => {
    const fixedDesktop = this.appToolbarFixedDesktop();
    return fixedDesktop 
      ? CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_LIGHT 
      : `${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BG_BODY} ${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_COLOR_GRAY_600} ${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_ACTIVE_COLOR_PRIMARY}`;
  });

  readonly daterangepickerButtonClass = computed(() => {
    const fixedDesktop = this.appToolbarFixedDesktop();
    return fixedDesktop 
      ? CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_LIGHT 
      : `${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BG_BODY} ${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_COLOR_GRAY_700} ${CLASSIC_TOOLBAR_CONSTANTS.CSS_CLASSES.BTN_ACTIVE_COLOR_PRIMARY}`;
  });

  readonly toolbarConfig = computed((): Partial<IToolbar> => ({
    primaryButton: this.appToolbarPrimaryButton(),
    primaryButtonLabel: this.appToolbarPrimaryButtonLabel(),
    primaryButtonModal: this.appToolbarPrimaryButtonModal(),
    filterButton: this.appToolbarFilterButton(),
    daterangepickerButton: this.appToolbarDaterangepickerButton(),
    fixed: {
      desktop: this.appToolbarFixedDesktop()
    }
  }));
  readonly toolbarCommands = computed(() =>
    resolveClassicToolbarCommands(this.toolbarConfig())
  );
  readonly primaryCreateCommand = computed(() =>
    this.toolbarCommands().find((command) => command.id === 'primary-create')
  );

  constructor() {
    this.initializeSubscriptions();
  }

  ngOnInit(): void {
    try {
      const initialConfig = this.layout.layoutConfigSubject.value;
      if (initialConfig) {
        this._layoutConfig.set(initialConfig);
      }
    } catch (error) {
      this.logger.error('Classic toolbar initialization failed', 'ClassicComponent', { error });
    }
  }

  private initializeSubscriptions(): void {
    this.layout.layoutConfigSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config) => {
          try {
            this._layoutConfig.set(config);
          } catch (error) {
            this.logger.error('Classic toolbar config subscription failed', 'ClassicComponent', { error });
          }
        },
        error: (error) => {
          this.logger.error('Classic toolbar config subscription error', 'ClassicComponent', { error });
        }
      });
  }

  onPrimaryButtonClick(): void {
    try {
      const config = this.toolbarConfig();
      if (config.primaryButtonModal) {
        this.primaryCreateCommand();
      }
    } catch (error) {
      this.logger.error('Primary button click failed', 'ClassicComponent', { error });
    }
  }

  onSecondaryButtonClick(): void {
    try {
      // Secondary button functionality
    } catch (error) {
      this.logger.error('Secondary button click failed', 'ClassicComponent', { error });
    }
  }

  onFilterButtonClick(): void {
    try {
      // Handle filter functionality
    } catch (error) {
      this.logger.error('Filter button click failed', 'ClassicComponent', { error });
    }
  }

  onDaterangepickerButtonClick(): void {
    try {
      // Handle date range picker functionality
    } catch (error) {
      this.logger.error('Date range picker button click failed', 'ClassicComponent', { error });
    }
  }
}
