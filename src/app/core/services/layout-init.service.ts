import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { DomUtil } from '@utils/dom.util';
import { ILayout, LayoutType } from '../config/config';
import { LayoutService } from './layout.service';

const BODY_CONSTANTS = {
  ID: 'velora_app_body',
  BASE_CLASS: 'app-default',
} as const;

const DATA_ATTRIBUTES = {
  APP_LAYOUT: 'data-velora-app-layout',
  NAME: 'data-velora-name',
  HEADER_FIXED: 'data-velora-app-header-fixed',
  HEADER_FIXED_MOBILE: 'data-velora-app-header-fixed-mobile',
  SIDEBAR_FIXED: 'data-velora-app-sidebar-fixed',
  SIDEBAR_PUSH_HEADER: 'data-velora-app-sidebar-push-header',
  SIDEBAR_PUSH_TOOLBAR: 'data-velora-app-sidebar-push-toolbar',
  SIDEBAR_PUSH_FOOTER: 'data-velora-app-sidebar-push-footer',
  TOOLBAR_FIXED: 'data-velora-app-toolbar-fixed',
  TOOLBAR_FIXED_MOBILE: 'data-velora-app-toolbar-fixed-mobile',
  FOOTER_FIXED: 'data-velora-app-footer-fixed',
  FOOTER_FIXED_MOBILE: 'data-velora-app-footer-fixed-mobile',
  SIDEBAR_PANEL_ENABLED: 'data-velora-app-sidebar-panel-enabled',
  TOOLBAR_ENABLED: 'data-velora-app-toolbar-enabled',
} as const;

type ContainerType = 'fluid' | 'fixed';

@Injectable({
  providedIn: 'root',
})
export class LayoutInitService {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly layout = inject(LayoutService);

  private readonly _config = signal<ILayout | undefined>(undefined);
  private readonly _isInitialized = signal(false);

  readonly config = computed(() => this._config());
  readonly isInitialized = computed(() => this._isInitialized());

  reInitProps(layoutType?: LayoutType): void {
    this.layout.reInitProps();

    const currentLayoutType =
      layoutType ?? this.layout.getBaseLayoutTypeFromRouteOrLocalStorage();
    const config = this.layout.getLayoutConfig(currentLayoutType);

    this.updateConfig(config);
    this.layout.currentLayoutTypeSubject.next(currentLayoutType);

    this.applyLayoutSettings(currentLayoutType, config);
    this.applyToolbarSettings(config);
    this.applyWidthSettings(config);

    const finalConfig = this._config() ?? config;
    this.layout.updateLayoutConfig({ ...finalConfig });
  }

  setBaseLayoutType(layoutType: LayoutType): void {
    this.layout.setBaseLayoutType(layoutType);
    this.reInitProps(layoutType);
  }

  private updateConfig(config: ILayout): void {
    this._config.set({ ...config });
    this._isInitialized.set(true);
  }

  private applyLayoutSettings(layoutType: LayoutType, config: ILayout): void {
    this.resetBodyState();
    this.initializeBody(layoutType);
    this.setBodyAttributes(config);
    this.handleHeaderLayoutContainers(layoutType, config);
  }

  private resetBodyState(): void {
    DomUtil.clearClassList(this.document.body);
    DomUtil.removeDataAttributes(this.document.body);
    this.document.body.setAttribute('style', '');
    this.document.body.removeAttribute('id');
  }

  private initializeBody(layoutType: LayoutType): void {
    const body = this.document.body;
    body.setAttribute('id', BODY_CONSTANTS.ID);
    body.setAttribute(DATA_ATTRIBUTES.APP_LAYOUT, layoutType);
    body.setAttribute(DATA_ATTRIBUTES.NAME, 'velora');
    body.classList.add(BODY_CONSTANTS.BASE_CLASS);
  }

  private setBodyAttribute(condition: unknown, attrName: string): void {
    if (condition) {
      this.document.body.setAttribute(attrName, 'true');
    }
  }

  private setBodyAttributes(config: ILayout): void {
    this.setHeaderBodyAttributes(config);
    this.setSidebarBodyAttributes(config);
    this.setToolbarBodyAttributes(config);
    this.setFooterBodyAttributes(config);
    this.setSidebarPanelBodyAttributes(config);
  }

  private setHeaderBodyAttributes(config: ILayout): void {
    if (!config.app?.header?.display) return;

    const fixed = config.app.header.default?.fixed;
    this.setBodyAttribute(fixed?.desktop, DATA_ATTRIBUTES.HEADER_FIXED);
    this.setBodyAttribute(fixed?.mobile, DATA_ATTRIBUTES.HEADER_FIXED_MOBILE);
  }

  private setSidebarBodyAttributes(config: ILayout): void {
    if (!config.app?.sidebar?.display) return;

    const sidebar = config.app.sidebar.default;
    this.setBodyAttribute(
      sidebar?.fixed?.desktop,
      DATA_ATTRIBUTES.SIDEBAR_FIXED
    );
    this.setBodyAttribute(
      sidebar?.push?.header,
      DATA_ATTRIBUTES.SIDEBAR_PUSH_HEADER
    );
    this.setBodyAttribute(
      sidebar?.push?.toolbar,
      DATA_ATTRIBUTES.SIDEBAR_PUSH_TOOLBAR
    );
    this.setBodyAttribute(
      sidebar?.push?.footer,
      DATA_ATTRIBUTES.SIDEBAR_PUSH_FOOTER
    );
  }

  private setToolbarBodyAttributes(config: ILayout): void {
    if (!config.app?.toolbar?.display) return;

    const toolbar = config.app.toolbar;
    this.setBodyAttribute(
      toolbar.fixed?.desktop,
      DATA_ATTRIBUTES.TOOLBAR_FIXED
    );
    this.setBodyAttribute(
      toolbar.fixed?.mobile,
      DATA_ATTRIBUTES.TOOLBAR_FIXED_MOBILE
    );
    this.setBodyAttribute(toolbar.display, DATA_ATTRIBUTES.TOOLBAR_ENABLED);
  }

  private setFooterBodyAttributes(config: ILayout): void {
    if (!config.app?.footer?.display) return;

    const footer = config.app.footer;
    this.setBodyAttribute(footer.fixed?.desktop, DATA_ATTRIBUTES.FOOTER_FIXED);
    this.setBodyAttribute(
      footer.fixed?.mobile,
      DATA_ATTRIBUTES.FOOTER_FIXED_MOBILE
    );
  }

  private setSidebarPanelBodyAttributes(config: ILayout): void {
    this.setBodyAttribute(
      config.app?.sidebarPanel?.display,
      DATA_ATTRIBUTES.SIDEBAR_PANEL_ENABLED
    );
  }

  private handleHeaderLayoutContainers(
    layoutType: LayoutType,
    config: ILayout
  ): void {
    const isHeaderLayout =
      layoutType === 'light-header' || layoutType === 'dark-header';

    if (!isHeaderLayout || config.app?.general?.pageWidth !== 'default') {
      return;
    }

    const updatedConfig = this.setContainersToFixed(config);
    this.updateConfig(updatedConfig);
  }

  private setContainersToFixed(config: ILayout): ILayout {
    const app = { ...config.app };

    if (app.header?.default) {
      app.header = {
        ...app.header,
        default: { ...app.header.default, container: 'fixed' },
      };
    }
    if (app.toolbar) {
      app.toolbar = { ...app.toolbar, container: 'fixed' };
    }
    if (app.content) {
      app.content = { ...app.content, container: 'fixed' };
    }
    if (app.footer) {
      app.footer = { ...app.footer, container: 'fixed' };
    }

    return { ...config, app };
  }

  private applyToolbarSettings(config: ILayout): void {
    const headerContent = config.app?.header?.default?.content;

    if (headerContent === 'page-title') {
      this.hideToolbar(config);
      return;
    }

    this.configurePageTitle(config);
  }

  private hideToolbar(config: ILayout): void {
    if (!config.app?.toolbar) return;

    const updatedApp = {
      ...config.app,
      toolbar: { ...config.app.toolbar, display: false },
    };
    this.updateConfig({ ...config, app: updatedApp });
  }

  private configurePageTitle(config: ILayout): void {
    const currentConfig = this._config();
    if (!currentConfig?.app?.pageTitle) return;

    const updatedApp = {
      ...config.app,
      pageTitle: {
        ...currentConfig.app.pageTitle,
        description: false,
        breadCrumb: true,
      },
    };
    this.updateConfig({ ...config, app: updatedApp });
  }

  private applyWidthSettings(config: ILayout): void {
    const pageWidth = config.app?.general?.pageWidth;
    if (!pageWidth || pageWidth === 'default') return;

    const currentConfig = this._config() ?? config;
    const updatedApp = this.setContainerWidth(currentConfig, pageWidth);
    this.updateConfig({ ...currentConfig, app: updatedApp });
  }

  private setContainerWidth(
    config: ILayout,
    container: ContainerType
  ): typeof config.app {
    const app = { ...config.app };

    if (app.header?.default) {
      app.header.default.container = container;
    }
    if (app.toolbar) {
      app.toolbar.container = container;
    }
    if (app.content) {
      app.content.container = container;
    }
    if (app.footer) {
      app.footer.container = container;
    }

    return app;
  }
}
