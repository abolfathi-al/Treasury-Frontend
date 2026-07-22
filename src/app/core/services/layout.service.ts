import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  APP_DEFAULT_LAYOUT_TYPE,
  CSSClassesType,
  HTMLAttributesType,
  ILayout,
  LayoutType,
} from '@core/config/config';
import { DarkHeaderConfig } from '@core/config/dark-header.config';
import { DarkSidebarConfig } from '@core/config/dark-sidebar.config';
import { LightHeaderConfig } from '@core/config/light-header.config';
import { LightSidebarConfig } from '@core/config/light-sidebar.config';
import { APP_RUNTIME_CONFIG } from '@core/config/runtime.config';
import { LOCAL_STORAGE, LOCATION } from '@core/tokens';
import { CoreUtil } from '@utils/core.util';
import { runSafely } from '@shared/directives/shared/directive-helpers';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

const LAYOUT_CONFIGS: Record<LayoutType, ILayout> = {
  'dark-sidebar': DarkSidebarConfig,
  'light-sidebar': LightSidebarConfig,
  'dark-header': DarkHeaderConfig,
  'light-header': LightHeaderConfig,
};

function createEmptyHTMLAttributes(): HTMLAttributesType {
  return {
    asideMenu: {},
    headerMobile: {},
    headerMenu: {},
    headerContainer: {},
    pageTitle: {},
  };
}

function createEmptyCssClasses(): CSSClassesType {
  return {
    header: [],
    headerContainer: [],
    headerMobile: [],
    headerMenu: [],
    aside: [],
    asideMenu: [],
    asideToggle: [],
    toolbar: [],
    toolbarContainer: [],
    content: [],
    contentContainer: [],
    footerContainer: [],
    sidebar: [],
    pageTitle: [],
    wrapper: [],
  };
}

export {
  createEmptyCssClasses as getEmptyCssClasses,
  createEmptyHTMLAttributes as getEmptyHTMLAttributes,
};

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly defaultLayoutType = inject(APP_DEFAULT_LAYOUT_TYPE);

  private readonly runtimeConfig = inject(APP_RUNTIME_CONFIG);
  private readonly storageKeys = {
    LAYOUT_CONFIG: `${this.runtimeConfig.appVersion}-layoutConfig`,
    BASE_LAYOUT_TYPE: `${this.runtimeConfig.appVersion}-baseLayoutType`,
  } as const;

  private readonly localStorage = inject<Storage>(LOCAL_STORAGE, {
    optional: true,
  });
  private readonly location = inject<Location>(LOCATION, { optional: true });
  private readonly activatedRoute = inject(ActivatedRoute, { optional: true });
  private readonly logger = inject(LoggerService);

  private readonly _currentLayoutType = signal<LayoutType | null>(null);
  private readonly _layoutConfig = signal<ILayout>(this.resolveInitialConfig());
  private readonly _cssClasses = signal<CSSClassesType>(
    createEmptyCssClasses()
  );
  private readonly _htmlAttributes = signal<HTMLAttributesType>(
    createEmptyHTMLAttributes()
  );

  private isInitializing = true;

  readonly currentLayoutType = computed(() => this._currentLayoutType());
  readonly layoutConfig = computed(() => this._layoutConfig());
  readonly cssClasses = computed(() => this._cssClasses());
  readonly htmlAttributes = computed(() => this._htmlAttributes());

  readonly currentLayoutTypeSubject = new BehaviorSubject<LayoutType | null>(
    null
  );
  readonly layoutConfigSubject = new BehaviorSubject<ILayout>(
    this.resolveInitialConfig()
  );

  private resolveInitialConfig(): ILayout {
    try {
      this.isInitializing = true;
      const layoutType = this.getBaseLayoutTypeFromRouteOrLocalStorage();
      const config = this.getLayoutConfig(layoutType);
      this.seedLayoutStorage(layoutType, config);
      queueMicrotask(() => (this.isInitializing = false));
      return config;
    } catch {
      queueMicrotask(() => (this.isInitializing = false));
      return LAYOUT_CONFIGS[this.defaultLayoutType];
    }
  }

  private readFromStorage(key: string): string | null | undefined {
    return runSafely(
      () => this.localStorage?.getItem(key) ?? undefined,
      (error) =>
        this.logger.error('Storage read failed', 'LayoutService', { error })
    );
  }

  private writeToStorage(key: string, value: string): void {
    this.localStorage?.setItem(key, value);
  }

  private removeFromStorage(key: string): void {
    this.localStorage?.removeItem(key);
  }

  private getLayoutConfigStorageKey(layoutType: LayoutType): string {
    return `${layoutType}-${this.storageKeys.LAYOUT_CONFIG}`;
  }

  private seedLayoutStorage(layoutType: LayoutType, config: ILayout): void {
    const storedLayoutType = this.readFromStorage(
      this.storageKeys.BASE_LAYOUT_TYPE,
    );
    if (!storedLayoutType || !(storedLayoutType in LAYOUT_CONFIGS)) {
      this.writeToStorage(this.storageKeys.BASE_LAYOUT_TYPE, layoutType);
    }

    const configKey = this.getLayoutConfigStorageKey(layoutType);
    if (!this.readFromStorage(configKey)) {
      this.writeToStorage(configKey, JSON.stringify(config));
    }
  }

  private emitState(layoutType: LayoutType, config: ILayout): void {
    if (!this.isInitializing) {
      this._currentLayoutType.set(layoutType);
      this._layoutConfig.set(config);
    }
    this.currentLayoutTypeSubject.next(layoutType);
    this.layoutConfigSubject.next(config);
  }

  updateLayoutConfig(config: ILayout): void {
    this._layoutConfig.set(config);
    this.layoutConfigSubject.next(config);
  }

  getProp(
    path: string,
    config?: ILayout
  ): string | boolean | undefined | object {
    return CoreUtil.getNestedProperty(config ?? this._layoutConfig(), path);
  }

  setCSSClass(path: string, classesInStr: string): void {
    const updated = { ...this._cssClasses() };
    if (!updated[path]) {
      updated[path] = [];
    }
    const classes = classesInStr.split(' ').filter((c) => c.trim());
    updated[path].push(...classes);
    this._cssClasses.set(updated);
  }

  getCSSClasses(path: string): string[] {
    return this._cssClasses()[path] ?? [];
  }

  getStringCSSClasses(path: string): string {
    return this.getCSSClasses(path).join(' ');
  }

  getHTMLAttributes(path: string): Record<string, string | boolean> {
    return this._htmlAttributes()[path] ?? {};
  }

  setHTMLAttribute(
    path: string,
    attrKey: string,
    attrValue: string | boolean
  ): void {
    const updated = { ...this._htmlAttributes() };
    if (!updated[path]) {
      updated[path] = {};
    }
    updated[path][attrKey] = attrValue;
    this._htmlAttributes.set(updated);
  }

  getBaseLayoutTypeFromRouteOrLocalStorage(): LayoutType {
    const routeLayout = this.activatedRoute?.firstChild?.snapshot?.data?.layout;
    if (routeLayout) {
      return routeLayout as LayoutType;
    }
    return this.getBaseLayoutTypeFromLocalStorage();
  }

  getBaseLayoutTypeFromLocalStorage(): LayoutType {
    const stored = this.readFromStorage(this.storageKeys.BASE_LAYOUT_TYPE);
    if (stored && stored in LAYOUT_CONFIGS) {
      return stored as LayoutType;
    }
    if (!this.isInitializing) {
      this.setBaseLayoutType(this.defaultLayoutType);
    }
    return this.defaultLayoutType;
  }

  getLayoutByType(layoutType: LayoutType | undefined): ILayout {
    return (
      LAYOUT_CONFIGS[layoutType ?? this.defaultLayoutType] ??
      LAYOUT_CONFIGS[this.defaultLayoutType]
    );
  }

  getLayoutConfig(layoutType: LayoutType): ILayout {
    const configKey = this.getLayoutConfigStorageKey(layoutType);
    const stored = this.readFromStorage(configKey);

    if (stored) {
      try {
        return JSON.parse(stored) as ILayout;
      } catch (error) {
        this.logger.error('Config parse failed', 'LayoutService', { error });
      }
    }
    return this.getLayoutByType(layoutType);
  }

  setBaseLayoutType(layoutType: LayoutType): void {
    const config = this.getLayoutByType(layoutType);
    this.writeToStorage(this.storageKeys.BASE_LAYOUT_TYPE, layoutType);
    this.writeToStorage(
      this.getLayoutConfigStorageKey(layoutType),
      JSON.stringify(config)
    );
    this.emitState(layoutType, config);
  }

  saveBaseConfig(config: ILayout): void {
    const layoutType = this.getBaseLayoutTypeFromLocalStorage();
    const configKey = this.getLayoutConfigStorageKey(layoutType);
    this.writeToStorage(configKey, JSON.stringify(config));
    this.location?.reload();
  }

  resetBaseConfig(): void {
    const layoutType = this.getBaseLayoutTypeFromLocalStorage();
    const configKey = this.getLayoutConfigStorageKey(layoutType);
    this.removeFromStorage(configKey);
    this.location?.reload();
  }

  reInitProps(): void {
    this._cssClasses.set(createEmptyCssClasses());
    this._htmlAttributes.set(createEmptyHTMLAttributes());
  }
}
