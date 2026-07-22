import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import {
  ThemeModeService,
  ThemeModeValue,
} from '@core/services/theme-mode.service';
import { MenuDirective } from '@shared/directives/menu.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

const THEME_MODE_SWITCHER_CONSTANTS = {
  DEFAULT_TOGGLE_BTN_ICON_CLASS: 'svg-icon-2',
  DEFAULT_MENU_PLACEMENT: 'bottom-end',
  DEFAULT_MENU_TRIGGER: "{default: 'click', lg: 'hover'}",
  VALID_PLACEMENTS: [
    'top',
    'bottom',
    'left',
    'right',
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
  ] as const,
  VALID_MODES: ['light', 'dark', 'system'] as ThemeModeValue[],
} as const;

type ThemeMenuPlacement =
  (typeof THEME_MODE_SWITCHER_CONSTANTS.VALID_PLACEMENTS)[number];

@Component({
  selector: 'vl-theme-mode-switcher',
  templateUrl: './theme-mode-switcher.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    AsyncPipe,
    TranslateModule,
    MenuDirective,
    VeloraIconComponent,
  ],
})
export class ThemeModeSwitcherComponent implements OnInit {
  private readonly modeService = inject(ThemeModeService);
  private readonly logger = inject(LoggerService);

  readonly toggleBtnClass = input<string>('');
  readonly toggleBtnIconClass = input<string>(
    THEME_MODE_SWITCHER_CONSTANTS.DEFAULT_TOGGLE_BTN_ICON_CLASS
  );
  readonly menuPlacement = input<string>(
    THEME_MODE_SWITCHER_CONSTANTS.DEFAULT_MENU_PLACEMENT
  );
  readonly menuTrigger = input<string>(
    THEME_MODE_SWITCHER_CONSTANTS.DEFAULT_MENU_TRIGGER
  );

  // Signals for reactive state management
  private readonly _isInitialized = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Computed values
  readonly isInitialized = computed(() => this._isInitialized());
  readonly error = computed(() => this._error());

  readonly mode$: Observable<ThemeModeValue>;
  readonly menuMode$: Observable<ThemeModeValue>;

  constructor() {
    this.mode$ = this.modeService.mode.asObservable();
    this.menuMode$ = this.modeService.menuMode.asObservable();
  }

  ngOnInit(): void {
    try {
      this.validateInputs();
      this.modeService.init();
      this._isInitialized.set(true);
      this._error.set(null);
    } catch (error) {
      this.logger.error(
        'ThemeModeSwitcher initialization error',
        'ThemeModeSwitcherComponent',
        { error }
      );
      this._error.set('Failed to initialize theme mode switcher');
      this._isInitialized.set(false);
    }
  }

  private validateInputs(): void {
    const placement = this.menuPlacement();
    const trigger = this.menuTrigger();

    if (placement && typeof placement !== 'string') {
      throw new Error('Menu placement must be a string');
    }

    if (trigger && typeof trigger !== 'string') {
      throw new Error('Menu trigger must be a string');
    }

    if (
      placement &&
      !isThemeMenuPlacement(placement)
    ) {
      this.logger.warn(
        `Invalid menu placement: ${placement}. Using default.`,
        'ThemeModeSwitcherComponent'
      );
    }
  }

  switchMode(mode: ThemeModeValue): void {
    try {
      this.validateMode(mode);
      this.modeService.switchMode(mode);
    } catch (error) {
      this.logger.error(
        'Theme mode switch error',
        'ThemeModeSwitcherComponent',
        { error }
      );
      this._error.set('Failed to switch theme mode');
    }
  }

  private validateMode(mode: ThemeModeValue): void {
    if (!THEME_MODE_SWITCHER_CONSTANTS.VALID_MODES.includes(mode)) {
      throw new Error(
        `Invalid theme mode: ${mode}. Must be one of: ${THEME_MODE_SWITCHER_CONSTANTS.VALID_MODES.join(
          ', '
        )}`
      );
    }
  }
}

function isThemeMenuPlacement(value: string): value is ThemeMenuPlacement {
  return THEME_MODE_SWITCHER_CONSTANTS.VALID_PLACEMENTS.some(
    (placement) => placement === value,
  );
}
