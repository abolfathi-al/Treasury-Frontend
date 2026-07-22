import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';
import icons from './icons.json';

const VELORA_ICON_CONSTANTS = {
  VALID_TYPES: ['duotone', 'outline', 'solid'] as const,
  DEFAULT_TYPE: 'duotone',
  CSS_FILES: {
    DUOTONE: 'assets/plugins/velora-icons/duotone/style.css',
    OUTLINE: 'assets/plugins/velora-icons/outline/style.css',
    SOLID: 'assets/plugins/velora-icons/solid/style.css',
  },
  CSS_CLASS_PREFIX: 'vl-',
  ERROR_CLASS: 'vl-error',
  INVALID_PATH_COUNT: -1,
} as const;

type VeloraIconType = (typeof VELORA_ICON_CONSTANTS.VALID_TYPES)[number];

@Component({
  selector: 'vl-velora-icon',
  template: `
    @for(i of iconPaths(); track $index) {
    <span class="path{{ i }}"> </span>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.role]': '"img"',
    class: 'velora-icon',
  },
})
export class VeloraIconComponent implements OnInit {
  private readonly logger = inject(LoggerService);
  private readonly cssLoader = inject(CssLoaderService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly name = input<string>('');
  readonly customClass = input<string>('', { alias: 'class' });
  readonly type = input<string>(VELORA_ICON_CONSTANTS.DEFAULT_TYPE);

  private readonly _pathsNumber = signal<number>(
    VELORA_ICON_CONSTANTS.INVALID_PATH_COUNT
  );
  readonly iconPaths = computed(() => {
    const count = this._pathsNumber();
    return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [];
  });
  readonly isValid = computed(() => this._pathsNumber() >= 0);

  readonly classes = computed(() => {
    const baseClasses = `${VELORA_ICON_CONSTANTS.CSS_CLASS_PREFIX}${this.type()} ${
      VELORA_ICON_CONSTANTS.CSS_CLASS_PREFIX
    }${this.name()}`;
    const customClassValue = this.customClass() ? ` ${this.customClass()}` : '';
    const errorClass = !this.isValid()
      ? ` ${VELORA_ICON_CONSTANTS.ERROR_CLASS}`
      : '';
    return `velora-icon ${baseClasses}${customClassValue}${errorClass}`;
  });

  readonly ariaLabel = computed(() => `Icon: ${this.name()}`);

  ngOnInit(): void {
    const name = this.name();
    const type = this.type();

    if (!name || !isVeloraIconType(type)) {
      this.logger.error('Invalid icon name or type', 'VeloraIconComponent', {
        name,
        type,
      });
      return;
    }

    if (this.isBrowser) {
      const cssFile = this.getCssFileForType(type);
      this.cssLoader.loadCss(cssFile).catch((error) => {
        this.logger.error(`Failed to load ${cssFile}`, 'VeloraIconComponent', {
          error,
        });
      });
    }

    try {
      const pathCount =
        type === VELORA_ICON_CONSTANTS.VALID_TYPES[0]
          ? (icons['duotone-paths'] as Record<string, number>)?.[name] ??
            VELORA_ICON_CONSTANTS.INVALID_PATH_COUNT
          : 1;

      if (pathCount === VELORA_ICON_CONSTANTS.INVALID_PATH_COUNT) {
        this.logger.warn(
          `Icon '${name}' not found for type '${type}'`,
          'VeloraIconComponent'
        );
      }
      this._pathsNumber.set(pathCount);
    } catch (error) {
      this.logger.error('Error loading icon paths', 'VeloraIconComponent', {
        error,
      });
    }
  }

  private getCssFileForType(type: VeloraIconType): string {
    switch (type) {
      case VELORA_ICON_CONSTANTS.VALID_TYPES[0]:
        return VELORA_ICON_CONSTANTS.CSS_FILES.DUOTONE;
      case VELORA_ICON_CONSTANTS.VALID_TYPES[1]:
        return VELORA_ICON_CONSTANTS.CSS_FILES.OUTLINE;
      case VELORA_ICON_CONSTANTS.VALID_TYPES[2]:
        return VELORA_ICON_CONSTANTS.CSS_FILES.SOLID;
    }
  }
}

function isVeloraIconType(value: string): value is VeloraIconType {
  return VELORA_ICON_CONSTANTS.VALID_TYPES.some((type) => type === value);
}
