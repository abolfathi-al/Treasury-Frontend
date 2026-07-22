import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  input,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  ILayout,
  IPageTitle,
  IToolbar,
  LayoutType,
  ToolbarLayout,
} from '@core/config/config';
import { LayoutService } from '@core/services/layout.service';
import { StyleUtil } from '@utils/style.util';
import { PageTitleComponent } from '../header/page-title/page-title.component';
import { AccountingComponent } from './accounting/accounting.component';
import { ClassicComponent } from './classic/classic.component';
import { ExtendedComponent } from './extended/extended.component';
import { ReportsComponent } from './reports/reports.component';
import { SaasComponent } from './saas/saas.component';

const TOOLBAR_CONSTANTS = {
  DEFAULT_LAYOUT: 'classic' as ToolbarLayout,
  CSS_CLASSES: {
    TOOLBAR_FIXED_DESKTOP: 'toolbar-fixed-desktop',
    TOOLBAR_FIXED_MOBILE: 'toolbar-fixed-mobile',
  },
  DATA_ATTRIBUTES: {
    TOOLBAR: 'data-velora-app-toolbar',
    TOOLBAR_ENABLED: 'data-velora-app-toolbar-enabled',
  },
  ATTRIBUTE_VALUES: {
    TRUE: 'true',
  },
  CONTAINER_CLASSES: {
    FIXED: 'container-fluid',
    FLUID: 'container',
  },
} as const;

@Component({
  selector: 'vl-toolbar',
  templateUrl: './toolbar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    PageTitleComponent,
    ClassicComponent,
    AccountingComponent,
    ExtendedComponent,
    ReportsComponent,
    SaasComponent,
  ],
})
export class ToolbarComponent implements OnInit {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly layout = inject(LayoutService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentLayoutType = input<LayoutType | null>(null);
  readonly appToolbarLayout = input<ToolbarLayout>(
    TOOLBAR_CONSTANTS.DEFAULT_LAYOUT
  );

  private readonly _layoutConfig = signal<ILayout | undefined>(undefined);
  private readonly _isInitialized = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly isInitialized = computed(() => this._isInitialized());
  readonly error = computed(() => this._error());

  readonly appToolbarDisplay = computed(
    () =>
      this.layout.getProp(
        'app.toolbar.display',
        this._layoutConfig()
      ) as boolean
  );
  readonly appToolbarContainer = computed(
    () =>
      this.layout.getProp('app.toolbar.container', this._layoutConfig()) as
        | 'fixed'
        | 'fluid'
  );
  readonly appToolbarContainerCSSClass = computed(() => {
    const container = this.appToolbarContainer();
    const containerClass = this.layout.getProp(
      'app.toolbar.containerClass',
      this._layoutConfig()
    ) as string;

    if (container === 'fixed') {
      return containerClass || TOOLBAR_CONSTANTS.CONTAINER_CLASSES.FIXED;
    } else {
      return containerClass || TOOLBAR_CONSTANTS.CONTAINER_CLASSES.FLUID;
    }
  });
  readonly appToolbarFixedDesktop = computed(
    () =>
      this.layout.getProp(
        'app.toolbar.fixed.desktop',
        this._layoutConfig()
      ) as boolean
  );
  readonly appToolbarFixedMobile = computed(
    () =>
      this.layout.getProp(
        'app.toolbar.fixed.mobile',
        this._layoutConfig()
      ) as boolean
  );
  readonly appPageTitleDisplay = computed(
    () =>
      this.layout.getProp(
        'app.pageTitle.display',
        this._layoutConfig()
      ) as boolean
  );

  // Page title computed values using proper IPageTitle interface
  readonly appPageTitleDirection = computed(
    () =>
      this.layout.getProp('app.pageTitle.direction', this._layoutConfig()) as
        | 'row'
        | 'column'
  );
  readonly appPageTitleCSSClass = computed(
    () =>
      this.layout.getProp('app.pageTitle.class', this._layoutConfig()) as string
  );
  readonly appPageTitleBreadcrumb = computed(
    () =>
      this.layout.getProp(
        'app.pageTitle.breadCrumb',
        this._layoutConfig()
      ) as boolean
  );
  readonly appPageTitleDescription = computed(
    () =>
      this.layout.getProp(
        'app.pageTitle.description',
        this._layoutConfig()
      ) as boolean
  );

  readonly showPageTitle = computed(() => {
    const viewsWithPageTitles: ToolbarLayout[] = ['classic', 'reports', 'saas'];
    return (
      this.appPageTitleDisplay() &&
      viewsWithPageTitles.includes(this.appToolbarLayout())
    );
  });
  readonly pageTitleLayoutClasses = computed(() => ({
    'flex-column justify-content-center':
      this.appPageTitleDirection() === 'column',
    'align-items-center': this.appPageTitleDirection() !== 'column',
  }));

  readonly toolbarConfig = computed(
    (): Partial<IToolbar & { pageTitle: Partial<IPageTitle> }> => ({
      layout: this.appToolbarLayout(),
      display: this.appToolbarDisplay(),
      container: this.appToolbarContainer(),
      fixed: {
        desktop: this.appToolbarFixedDesktop(),
        mobile: this.appToolbarFixedMobile(),
      },
      pageTitle: {
        display: this.appPageTitleDisplay(),
        direction: this.appPageTitleDirection(),
        class: this.appPageTitleCSSClass(),
        breadCrumb: this.appPageTitleBreadcrumb(),
        description: this.appPageTitleDescription(),
      },
    })
  );

  constructor() {
    this.initializeSubscriptions();
  }

  ngOnInit(): void {
    try {
      const initialConfig = this.layout.layoutConfigSubject.value;
      if (initialConfig) {
        this._layoutConfig.set(initialConfig);
        this.updateToolbarAttributes();
        this._isInitialized.set(true);
        this._error.set(null);
      }
    } catch (error) {
      this._error.set(`Toolbar initialization failed: ${error}`);
    }
  }

  private initializeSubscriptions(): void {
    this.layout.layoutConfigSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config: ILayout) => {
          try {
            this._layoutConfig.set(config);
            this.updateToolbarAttributes();
          } catch (error) {
            this._error.set(`Toolbar config subscription failed: ${error}`);
          }
        },
        error: (error) => {
          this._error.set(`Toolbar config subscription error: ${error}`);
        },
      });
  }

  private updateToolbarAttributes(): void {
    try {
      const config = this._layoutConfig();
      if (!config) return;

      this.updateFixedAttributes();
      this.updateEnabledAttribute();
    } catch (error) {
      this._error.set(`Update toolbar attributes failed: ${error}`);
    }
  }

  private updateFixedAttributes(): void {
    try {
      const fixedDesktop = this.appToolbarFixedDesktop();
      const fixedMobile = this.appToolbarFixedMobile();

      if (fixedDesktop) {
        StyleUtil.addClass(
          this.document.body,
          TOOLBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_FIXED_DESKTOP
        );
      } else {
        StyleUtil.removeClass(
          this.document.body,
          TOOLBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_FIXED_DESKTOP
        );
      }

      if (fixedMobile) {
        StyleUtil.addClass(
          this.document.body,
          TOOLBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_FIXED_MOBILE
        );
      } else {
        StyleUtil.removeClass(
          this.document.body,
          TOOLBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_FIXED_MOBILE
        );
      }

      StyleUtil.setAttribute(
        this.document.body,
        TOOLBAR_CONSTANTS.DATA_ATTRIBUTES.TOOLBAR,
        TOOLBAR_CONSTANTS.ATTRIBUTE_VALUES.TRUE
      );
    } catch (error) {
      this._error.set(`Update fixed attributes failed: ${error}`);
    }
  }

  private updateEnabledAttribute(): void {
    try {
      StyleUtil.setAttribute(
        this.document.body,
        TOOLBAR_CONSTANTS.DATA_ATTRIBUTES.TOOLBAR_ENABLED,
        TOOLBAR_CONSTANTS.ATTRIBUTE_VALUES.TRUE
      );
    } catch (error) {
      this._error.set(`Update enabled attribute failed: ${error}`);
    }
  }
}
