import {
  AfterViewInit,
  Directive,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import type { createPopper as CreatePopperFn, Placement } from '@popperjs/core';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { CoreUtil } from '@utils/core.util';
import { DataUtil } from '@utils/data.util';
import { DomUtil } from '@utils/dom.util';
import { EventUtil } from '@utils/event.util';
import { ResponsiveUtil } from '@utils/responsive.util';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export type MenuTrigger = 'click' | 'hover' | 'auto';
export type MenuPlacement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';
export type MenuSubType = 'dropdown' | 'accordion';

type MenuResponsiveDimension = {
  default: string | number;
  [key: string]: string | number;
};

export interface MenuOptions {
  activate?: boolean;
  trigger?: MenuTrigger | { default: MenuTrigger; [key: string]: MenuTrigger };
  placement?: MenuPlacement;
  offset?: string | number | { default: string | number; [key: string]: string | number };
  overflow?: boolean;
  flip?: boolean | string;
  closeOnClick?: boolean;
  hoverTimeout?: number;
  zindex?: number;
  width?: string | number;
  height?: string | number;
  attach?: string;
  expand?: boolean;
  slideSpeed?: number;
  permanent?: boolean;
}

export interface MenuItemConfig {
  trigger: MenuTrigger;
  placement: MenuPlacement;
  offset: [number, number];
  width?: string;
  height?: string;
  overflow?: boolean;
}

interface PopperInstance {
  destroy(): void;
  update(): void;
  setOptions(options: unknown): void;
}

interface MenuDirectiveWindow extends Window {
  veloraMenuHandlersInitialized?: boolean;
  veloraMenuDirectiveHandlersInitialized?: boolean;
}

type PopperFactory = typeof CreatePopperFn;

const DEFAULT_OPTIONS: MenuOptions = {
  activate: true,
  trigger: 'click',
  placement: 'bottom-start',
  offset: '0px, 5px',
  overflow: true,
  flip: true,
  closeOnClick: true,
  hoverTimeout: 250,
  zindex: 1050,
  width: undefined,
  height: undefined,
  attach: undefined,
  expand: false,
  slideSpeed: 250,
  permanent: false,
};

const CSS = {
  SHOW: 'show',
  HOVER: 'hover',
  ACTIVE: 'active',
  HERE: 'here',
  SHOWING: 'showing',
  HIDING: 'hiding',
  DROPDOWN: 'menu-dropdown',
  ACCORDION: 'menu-sub-accordion',
  MENU: 'menu',
  MENU_ITEM: 'menu-item',
  MENU_LINK: 'menu-link',
  MENU_TOGGLE: 'menu-toggle',
  MENU_SUB: 'menu-sub',
  MENU_SUB_DROPDOWN: 'menu-sub-dropdown',
  MENU_SUB_ACCORDION: 'menu-sub-accordion',
} as const;

const SEL = {
  DIRECTIVE: '[vlVeloraMenu]',
  MENU: '.menu',
  MENU_ITEM: '.menu-item',
  MENU_LINK: '.menu-link',
  MENU_TOGGLE: '.menu-toggle',
  MENU_SUB: '.menu-sub',
  MENU_SUB_DROPDOWN: '.menu-sub-dropdown',
  MENU_SUB_ACCORDION: '.menu-sub-accordion',
  DATA_MENU_TRIGGER: '[data-velora-menu-trigger]',
  DATA_MENU_TARGET: '[data-velora-menu-target]',
  DATA_POPPER_PLACEMENT: '[data-popper-placement]',
  DATA_MENU: '[data-velora-menu]',
  MENU_ITEM_WITH_TRIGGER: '.menu-item[data-velora-menu-trigger]',
  SHOW_MENU_DROPDOWN: '.show.menu-dropdown[data-velora-menu-trigger]',
  SHOW_MENU_DROPDOWN_WITH_TRIGGER: '.show[data-velora-menu-trigger]',
  MENU_SHOW_DIRECTIVE: '.menu.show[vlVeloraMenu]',
  MENU_SUB_WITH_TRIGGER: '[data-velora-menu-trigger], .menu-sub',
  DATA_MENU_TRIGGER_TARGET: '[data-velora-menu-target="#${menuId}"]',
} as const;

@Directive({
  selector: '[vlVeloraMenu]',
  exportAs: 'vlVeloraMenu',
  standalone: true,
})
export class MenuDirective
  extends BaseDirective<MenuOptions, string>
  implements OnInit, AfterViewInit
{
  private readonly host = useDirectiveHost();
  private readonly window = this.host.isBrowser ? (inject(WINDOW) as MenuDirectiveWindow) : null;

  private popper: PopperInstance | null = null;
  private triggerEl: HTMLElement | null = null;
  private subEl: HTMLElement | null = null;
  private triggerElement: HTMLElement | null = null;
  private hoverTimeouts = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  private eventHandlers = new Map<string, string>();
  private animationTimeout: number | null = null;
  private popperFactory: PopperFactory | null = null;
  private popperLoader: Promise<PopperFactory | null> | null = null;
  private popperLoadLoggedError = false;

  readonly isResponsive = computed(() =>
    this.resolveResponsive(this.optionsManager.snapshot().activate)
  );

  readonly menuOptions = input<MenuOptions>();
  readonly menuActivate = input<boolean>();
  readonly menuTrigger = input<
    'click' | 'hover' | { default: 'click' | 'hover'; [key: string]: 'click' | 'hover' }
  >();
  readonly menuPlacement = input<string>();
  readonly menuOffset = input<
    string | number | { default: string | number; [key: string]: string | number }
  >();
  readonly menuOverflow = input<boolean>();
  readonly menuFlip = input<boolean | string>();
  readonly menuCloseOnClick = input<boolean>();
  readonly menuHoverTimeout = input<number>();
  readonly menuZindex = input<number>();
  readonly menuWidth = input<string | number | MenuResponsiveDimension>();
  readonly menuHeight = input<string | number | MenuResponsiveDimension>();
  readonly menuAttach = input<string>();
  readonly menuExpand = input<boolean>();
  readonly menuSlideSpeed = input<number>();
  readonly menuPermanent = input<boolean>();

  readonly menuShow = output<void>();
  readonly menuShown = output<void>();
  readonly menuHide = output<void>();
  readonly menuHidden = output<void>();
  readonly menuAccordionShow = output<{ item: HTMLElement }>();
  readonly menuAccordionShown = output<{ item: HTMLElement }>();
  readonly menuAccordionHide = output<{ item: HTMLElement }>();
  readonly menuAccordionHidden = output<{ item: HTMLElement }>();
  readonly menuLinkClick = output<{ link: HTMLElement }>();
  readonly menuLinkClicked = output<{ link: HTMLElement }>();

  get isOpen(): boolean {
    return this.isOpenInternal();
  }

  constructor() {
    super(inject(LoggerService), 'MenuDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.cleanup();
    });
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.initInputBindings();
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncMenuInputs();
    this.validateInputs();
    this.setTriggerElement();
  }

  ngAfterViewInit(): void {
    if (!this.shouldInit()) return;

    runSafely(
      () => {
        DataUtil.set(this.host.elementRef.nativeElement, 'menuDirective', this);
        this.initWithDelay();
        this.initGlobalHandlers();
        this.markBaseInitialized();
      },
      (error) => this.logger.error('Init failed', 'MenuDirective', { error })
    );
  }

  show(): void {
    if (this.isBaseDestroyed()) return;
    this.showInternal();
  }

  hide(): void {
    if (this.isBaseDestroyed()) return;
    this.hideInternal();
  }

  toggle(): void {
    if (this.isBaseDestroyed()) return;
    this.toggleInternal();
  }

  hideAccordions(): void {
    if (this.isBaseDestroyed()) return;
    this.hideAllAccordions();
  }

  reset(): void {
    if (this.isBaseDestroyed()) return;
    this.resetStates();
  }

  setOption<K extends keyof MenuOptions>(key: K, value: MenuOptions[K]): void {
    this.executeSafely(() => {
      if (key === 'width' || key === 'height') {
        this.updateOption(key, this.normalizeDim(value as string | number | MenuResponsiveDimension) as MenuOptions[K]);
      } else {
        this.updateOption(key, value);
      }
    }, `Set ${key} failed`);
  }

  getItemLinkElement(item: HTMLElement): HTMLElement | null {
    return this.findItemLink(item);
  }

  getItemToggleElement(item: HTMLElement): HTMLElement | null {
    return this.findItemToggle(item);
  }

  getItemSubElement(item: HTMLElement): HTMLElement | null {
    return this.findItemSub(item);
  }

  getItemParentElements(item: HTMLElement): HTMLElement[] {
    return this.findItemParents(item);
  }

  getItemSubType(item: HTMLElement): 'dropdown' | 'accordion' {
    return this.getItemSubTypeInternal(item);
  }

  hasItemSub(item: HTMLElement): boolean {
    return this.hasClass(item, CSS.MENU_ITEM) && item.hasAttribute('data-velora-menu-trigger');
  }

  isItemSubElement(item: HTMLElement): boolean {
    return this.hasClass(item, CSS.MENU_SUB);
  }

  isItemSubShown(item: HTMLElement): boolean {
    const sub = this.findItemSub(item);
    if (!sub) return false;

    const subType = this.getItemSubTypeInternal(item);
    if (subType === 'dropdown') {
      return this.hasClass(sub, CSS.SHOW) && sub.hasAttribute('data-popper-placement');
    }
    return this.hasClass(item, CSS.SHOW);
  }

  isItemParentShown(item: HTMLElement): boolean {
    return this.findItemParents(item).some((p) => this.hasClass(p, CSS.SHOW));
  }

  isItemDropdownPermanent(item: HTMLElement): boolean {
    const opt = this.getItemOpt(item, 'permanent');
    return this.parseBool(opt) || this.optionsManager.snapshot().permanent || false;
  }

  getTriggerElement(): HTMLElement | null {
    return this.triggerEl;
  }

  getLinkByAttribute(attr: string, value: string): HTMLElement | null {
    return this.host.elementRef.nativeElement.querySelector(`[${attr}="${value}"]`) as HTMLElement | null;
  }

  setActiveLink(link: HTMLElement): void {
    this.host.elementRef.nativeElement
      .querySelectorAll(SEL.MENU_LINK)
      .forEach((l: Element) => this.removeClass(l as HTMLElement, CSS.ACTIVE));
    this.addClass(link, CSS.ACTIVE);
  }

  on(event: string, handler: Function): void {
    if (!this.host.isBrowser) return;
    const id = EventUtil.addEventListener(this.host.elementRef.nativeElement, event, handler);
    this.eventHandlers.set(event, id);
  }

  one(event: string, handler: Function): void {
    if (!this.host.isBrowser) return;
    const onceHandler = (e: Event) => {
      handler(e);
      const id = this.eventHandlers.get(event);
      if (id) {
        EventUtil.removeEventListener(this.host.elementRef.nativeElement, event, id);
        this.eventHandlers.delete(event);
      }
    };
    const id = EventUtil.addEventListener(this.host.elementRef.nativeElement, event, onceHandler);
    this.eventHandlers.set(event, id);
  }

  off(event: string): void {
    if (!this.host.isBrowser) return;
    const id = this.eventHandlers.get(event);
    if (id) {
      EventUtil.removeEventListener(this.host.elementRef.nativeElement, event, id);
      this.eventHandlers.delete(event);
    }
  }

  private initInputBindings(): void {
    effect(() => {
      const opts = this.menuOptions();
      untracked(() => {
        if (opts) mergeOptionsIfChanged(this.optionsManager, opts, () => this.refresh());
      });
    });

    const bindings = [
      { input: this.menuActivate, key: 'activate' as const },
      { input: this.menuTrigger, key: 'trigger' as const },
      { input: this.menuPlacement, key: 'placement' as const },
      { input: this.menuOffset, key: 'offset' as const },
      { input: this.menuOverflow, key: 'overflow' as const },
      { input: this.menuFlip, key: 'flip' as const },
      { input: this.menuCloseOnClick, key: 'closeOnClick' as const },
      { input: this.menuHoverTimeout, key: 'hoverTimeout' as const },
      { input: this.menuZindex, key: 'zindex' as const },
      { input: this.menuAttach, key: 'attach' as const },
      { input: this.menuExpand, key: 'expand' as const },
      { input: this.menuSlideSpeed, key: 'slideSpeed' as const },
      { input: this.menuPermanent, key: 'permanent' as const },
    ];
    this.bindInputs(bindings);
  }

  private syncMenuInputs(): void {
    const opts = this.menuOptions();
    if (opts !== undefined) mergeOptionsIfChanged(this.optionsManager, opts, () => this.refresh());

    const sync = <T>(val: T | undefined, key: keyof MenuOptions, transform?: (v: T) => unknown) => {
      if (val !== undefined) this.updateOption(key, (transform ? transform(val) : val) as MenuOptions[typeof key]);
    };

    sync(this.menuActivate(), 'activate');
    sync(this.menuTrigger(), 'trigger');
    sync(this.menuPlacement(), 'placement');
    sync(this.menuOffset(), 'offset');
    sync(this.menuOverflow(), 'overflow');
    sync(this.menuFlip(), 'flip');
    sync(this.menuCloseOnClick(), 'closeOnClick');
    sync(this.menuHoverTimeout(), 'hoverTimeout');
    sync(this.menuZindex(), 'zindex');
    sync(this.menuWidth(), 'width', (v) => this.normalizeDim(v));
    sync(this.menuHeight(), 'height', (v) => this.normalizeDim(v));
    sync(this.menuAttach(), 'attach');
    sync(this.menuExpand(), 'expand');
    sync(this.menuSlideSpeed(), 'slideSpeed');
    sync(this.menuPermanent(), 'permanent');
  }

  protected override updateOption<K extends keyof MenuOptions>(
    key: K,
    value: MenuOptions[K] | undefined
  ): boolean {
    if (value === undefined) return false;
    return setOptionIfChanged(this.optionsManager, key, value, () => {
      if (key !== 'activate') this.refresh();
    });
  }

  private shouldInit(): boolean {
    return !!(this.host.elementRef.nativeElement && (this.optionsManager.snapshot().activate ?? true));
  }

  private initWithDelay(): void {
    setTimeout(() => {
      this.initElements();
      this.setupEventListeners();
      DataUtil.set(this.host.elementRef.nativeElement, 'menuDirective', this);
    }, 0);
  }

  private initElements(): void {
    this.queryElements();
  }

  private validateInputs(): void {
    const opts = this.optionsManager.snapshot();

    if (opts.hoverTimeout && opts.hoverTimeout < 0) {
      this.logger.error('hoverTimeout should be positive', 'MenuDirective');
      this.updateOption('hoverTimeout', DEFAULT_OPTIONS.hoverTimeout!);
    }

    if (opts.zindex && opts.zindex < 0) {
      this.logger.error('zindex should be positive', 'MenuDirective');
      this.updateOption('zindex', DEFAULT_OPTIONS.zindex!);
    }
  }

  private setTriggerElement(): void {
    const menuId = this.host.elementRef.nativeElement.getAttribute('id');
    const hasInternal = this.host.elementRef.nativeElement.querySelectorAll(SEL.MENU_ITEM_WITH_TRIGGER).length > 0;

    let hasExternal = false;
    if (this.host.elementRef.nativeElement.parentNode) {
      const parent = this.host.elementRef.nativeElement.parentNode as HTMLElement;
      const triggers = parent.querySelectorAll(SEL.DATA_MENU_TRIGGER);
      for (const t of triggers) {
        if (!this.host.elementRef.nativeElement.contains(t)) {
          hasExternal = true;
          break;
        }
      }
    }

    if (hasInternal && !hasExternal) return;

    const target = this.host.document?.querySelector(
      SEL.DATA_MENU_TRIGGER_TARGET.replace('${menuId}', menuId || '')
    ) || null;

    if (target) {
      this.triggerElement = target as HTMLElement;
    } else if (this.host.elementRef.nativeElement.closest(SEL.DATA_MENU_TRIGGER)) {
      this.triggerElement = this.host.elementRef.nativeElement.closest(SEL.DATA_MENU_TRIGGER) as HTMLElement;
    } else if (
      this.host.elementRef.nativeElement.parentNode &&
      this.findBySel(SEL.DATA_MENU_TRIGGER, this.host.elementRef.nativeElement.parentNode as HTMLElement)
    ) {
      const child = this.findBySel(SEL.DATA_MENU_TRIGGER, this.host.elementRef.nativeElement.parentNode as HTMLElement);
      if (child) this.triggerElement = child;
    }

    if (this.triggerElement) {
      DataUtil.set(this.triggerElement, 'menuDirective', this);
    }
  }

  private isTriggerElement(item: HTMLElement): boolean {
    return this.triggerElement === item;
  }

  private setupEventListeners(): void {
    this.clearBaseDomListeners();
    this.bindDelegatedHandlers();
    this.bindOutsideClick();
    this.bindEscapeKey();
  }

  private bindOutsideClick(): void {
    if (!this.optionsManager.snapshot().closeOnClick) return;
    this.addBaseDomListener('document', 'click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!this.host.elementRef.nativeElement.contains(target)) this.hideInternal();
    });
  }

  private bindEscapeKey(): void {
    this.addBaseDomListener('document', 'keydown', (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Escape' && this.isOpenInternal()) this.hideInternal();
    });
  }

  private bindDelegatedHandlers(): void {
    this.addBaseDomListener(this.host.elementRef.nativeElement, 'click', (e: Event) => {
      const target = e.target as HTMLElement;
      const item = target.closest(SEL.MENU_ITEM_WITH_TRIGGER) as HTMLElement;
      if (item && this.getItemTriggerValue(item) === 'click') {
        this.handleItemClick(item, e);
      }
    });

    this.addBaseDomListener(this.host.elementRef.nativeElement, 'mouseover', (e: Event) => {
      const target = e.target as HTMLElement;
      const item = target.closest(SEL.MENU_ITEM_WITH_TRIGGER) as HTMLElement;
      if (item && this.getItemTriggerValue(item) === 'hover') {
        this.handleMouseOver(item, e);
      }
    });

    this.addBaseDomListener(this.host.elementRef.nativeElement, 'mouseout', (e: Event) => {
      const target = e.target as HTMLElement;
      const item = target.closest(SEL.MENU_ITEM_WITH_TRIGGER) as HTMLElement;
      if (item && this.getItemTriggerValue(item) === 'hover') {
        this.handleMouseOut(item, e);
      }
    });
  }

  private handleItemClick(item: HTMLElement, event: Event): void {
    const link = this.findItemLink(item);
    const sub = this.findItemSub(item);

    if (link) {
      this.menuLinkClick.emit({ link });
      this.dispatch('ds.menu.link.click', { link });
    }

    if (sub) {
      event.preventDefault();
      const subType = this.getItemSubTypeInternal(item);
      if (subType === 'dropdown') {
        this.toggleDropdown(item);
      } else {
        this.toggleAccordion(item);
      }
    }

    if (link) {
      this.menuLinkClicked.emit({ link });
      this.dispatch('ds.menu.link.clicked', { link });
    }
  }

  private handleMouseOver(element: HTMLElement, _e: Event): void {
    const item = this.getItemElement(element);
    if (!item || this.getItemTriggerValue(item) !== 'hover') return;

    if (DataUtil.get(item, 'hover') === '1') {
      const timeout = DataUtil.get(item, 'timeout');
      if (timeout) clearTimeout(timeout as number);
      DataUtil.remove(item, 'hover');
      DataUtil.remove(item, 'timeout');
    }

    this.showInternal(item);
  }

  private handleMouseOut(element: HTMLElement, _e: Event): void {
    const item = this.getItemElement(element);
    if (!item || this.getItemTriggerValue(item) !== 'hover') return;

    const timeout = setTimeout(() => {
      if (DataUtil.get(item, 'hover') === '1') this.hideInternal(item);
    }, this.optionsManager.snapshot().hoverTimeout || 250);

    DataUtil.set(item, 'hover', '1');
    DataUtil.set(item, 'timeout', timeout);
  }

  private showInternal(item?: HTMLElement): void {
    if (this.isBaseDestroyed() || !this.isBaseInitialized()) return;

    this.executeSafely(() => {
      const target = item || this.host.elementRef.nativeElement;
      if (this.isItemSubShown(target)) return;

      const subType = this.getItemSubTypeInternal(target);
      if (subType === 'dropdown') {
        this.showDropdown(target);
      } else {
        this.showAccordion(target);
      }
    }, 'Show failed');
  }

  private hideInternal(item?: HTMLElement): void {
    if (this.isBaseDestroyed()) return;

    this.executeSafely(() => {
      const target = item || this.host.elementRef.nativeElement;
      if (!this.isItemSubShown(target)) return;

      const subType = this.getItemSubTypeInternal(target);
      if (subType === 'dropdown') {
        this.hideDropdown(target);
      } else {
        this.hideAccordion(target);
      }
    }, 'Hide failed');
  }

  private toggleInternal(): void {
    if (this.isOpenInternal()) {
      this.hideInternal();
    } else {
      this.showInternal();
    }
  }

  private isOpenInternal(): boolean {
    if (!this.host.isBrowser || !this.subEl) return false;
    if (this.subEl.classList.contains(CSS.SHOW)) return true;
    if (!this.host.window) return false;

    const style = this.host.window.getComputedStyle(this.subEl);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  private showDropdown(item: HTMLElement): void {
    if (this.dispatch('ds.menu.dropdown.show') === false) return;

    this.hideAllDropdowns(item);
    const sub = this.findItemSub(item);
    if (!this.isValidEl(sub)) return;

    this.hideDropdown(item);
    const opts = this.optionsManager.snapshot();
    const width = this.getItemOpt(item, 'width') || opts.width;
    const height = this.getItemOpt(item, 'height') || opts.height;
    const zindex = this.calcZIndex(opts.zindex || 1050);

    if (zindex) this.setStyle(sub, 'z-index', zindex.toString());
    if (width) this.setStyle(sub, 'width', width.toString());
    if (height) this.setStyle(sub, 'height', height.toString());

    this.initDropdownPopper(item, sub);

    this.addClass(item, CSS.SHOW);
    this.addClass(item, CSS.DROPDOWN);
    this.addClass(sub, CSS.SHOW);

    if (this.parseBool(this.getItemOpt(item, 'overflow')) || opts.overflow) {
      if (this.host.isBrowser && this.host.document?.body) {
        this.host.renderer.appendChild(this.host.document.body, sub);
      }
      DataUtil.set(item, 'sub', sub);
      DataUtil.set(sub, 'item', item);
      DataUtil.set(sub, 'menu', this);
    } else {
      DataUtil.set(sub, 'item', item);
    }

    this.dispatch('ds.menu.dropdown.shown');
    this.menuShown.emit();
  }

  private hideDropdown(item: HTMLElement): void {
    if (!this.host.isBrowser) return;
    if (this.dispatch('ds.menu.dropdown.hide') === false) return;

    const sub = this.findItemSub(item);
    if (this.isValidEl(sub)) {
      this.setStyle(sub, 'z-index', '');
      this.setStyle(sub, 'width', '');
      this.setStyle(sub, 'height', '');
    }

    this.removeClass(item, CSS.SHOW);
    this.removeClass(item, CSS.DROPDOWN);

    if (this.isValidEl(sub)) {
      if (this.hasClass(sub, CSS.MENU_SUB)) {
        this.removeClass(sub, CSS.SHOW);
      } else {
        this.setStyle(sub, 'display', 'none');
        this.setStyle(sub, 'visibility', 'hidden');
        this.setStyle(sub, 'opacity', '0');
      }
    }

    if (this.parseBool(this.getItemOpt(item, 'overflow')) || this.optionsManager.snapshot().overflow) {
      if (item.classList.contains(CSS.MENU_ITEM)) {
        if (sub) this.host.renderer.appendChild(item, sub);
      } else {
        if (sub && this.host.elementRef.nativeElement.parentNode) {
          this.host.renderer.insertBefore(
            this.host.elementRef.nativeElement.parentNode,
            sub,
            this.host.elementRef.nativeElement.nextSibling
          );
        }
      }

      if (sub) {
        DataUtil.remove(item, 'sub');
        DataUtil.remove(sub, 'item');
        DataUtil.remove(sub, 'menu');
      }
    }

    this.destroyDropdownPopper(item);
    this.dispatch('ds.menu.dropdown.hidden');
    this.menuHidden.emit();
  }

  private toggleDropdown(item: HTMLElement): void {
    if (!this.host.isBrowser) return;
    const sub = this.findItemSub(item);
    if (!sub) return;

    if (sub.classList.contains('show')) {
      this.hideDropdown(item);
    } else {
      this.showDropdown(item);
    }
  }

  private hideAllDropdowns(skipItem?: HTMLElement): void {
    const items = this.findAllBySel(SEL.SHOW_MENU_DROPDOWN_WITH_TRIGGER);
    items.forEach((el) => {
      if (this.getItemSubTypeInternal(el) === 'dropdown' && (!skipItem || el !== skipItem)) {
        this.hideDropdown(el);
      }
    });
  }

  private showAccordion(item: HTMLElement): void {
    if (this.hasClass(item, CSS.SHOWING) || this.hasClass(item, CSS.HIDING)) return;
    if (this.dispatch('ds.menu.accordion.show') === false) return;

    const opts = this.optionsManager.snapshot();
    if (opts.expand === false) this.hideAllAccordions(item);
    if (DataUtil.has(item, 'popper') === true) this.hideDropdown(item);

    this.addClass(item, CSS.HOVER);
    this.addClass(item, 'showing');

    const sub = this.findItemSub(item);
    if (this.isValidEl(sub)) {
      const speed = DomUtil.parseNumber(this.getItemOpt(item, 'slideSpeed') || '') || opts.slideSpeed || 250;
      DomUtil.slideDown(sub, speed).then(() => {
        this.removeClass(item, 'showing');
        this.addClass(item, CSS.SHOW);
        this.addClass(sub, CSS.SHOW);
        this.dispatch('ds.menu.accordion.shown');
        this.menuAccordionShown.emit({ item });
      });
    }
  }

  private hideAccordion(item: HTMLElement): void {
    if (this.hasClass(item, CSS.SHOWING) || this.hasClass(item, CSS.HIDING)) return;
    if (this.dispatch('ds.menu.accordion.hide') === false) return;

    const sub = this.findItemSub(item);
    this.addClass(item, 'hiding');

    if (this.isValidEl(sub)) {
      const opts = this.optionsManager.snapshot();
      const speed = DomUtil.parseNumber(this.getItemOpt(item, 'slideSpeed') || '') || opts.slideSpeed || 250;
      DomUtil.slideUp(sub, speed).then(() => {
        this.removeClass(item, 'hiding');
        this.removeClass(item, CSS.SHOW);
        this.removeClass(sub, CSS.SHOW);
        this.removeClass(item, CSS.HOVER);
        this.dispatch('ds.menu.accordion.hidden');
        this.menuAccordionHidden.emit({ item });
      });
    }
  }

  private toggleAccordion(item: HTMLElement): void {
    const sub = this.findItemSub(item);
    if (!sub) return;

    if (sub.classList.contains('show')) {
      this.hideAccordion(item);
    } else {
      this.showAccordion(item);
    }
  }

  private hideAllAccordions(skipItem?: HTMLElement): void {
    const items = this.findAllBySel(SEL.SHOW_MENU_DROPDOWN_WITH_TRIGGER);
    items.forEach((el) => {
      if (
        this.getItemSubTypeInternal(el) === 'accordion' &&
        el !== skipItem &&
        (!skipItem || (!el.contains(skipItem) && !skipItem.contains(el)))
      ) {
        if (!this.hasClass(el, 'showing') && !this.hasClass(el, 'hiding')) {
          this.hideAccordion(el);
        }
      }
    });
  }

  private toggleStandaloneMenu(): void {
    if (!this.host.isBrowser) return;
    const isShown = this.host.elementRef.nativeElement.classList.contains(CSS.SHOW);
    if (isShown) {
      this.hideStandaloneMenu();
    } else {
      this.showStandaloneMenu();
    }
  }

  private showStandaloneMenu(): void {
    if (!this.host.isBrowser) return;
    if (this.dispatch('ds.menu.show') === false) return;

    this.hideAllStandaloneMenus();
    this.destroyStandaloneMenuPopper();

    const opts = this.optionsManager.snapshot();
    let zindex = opts.zindex || 1050;
    const parentZindex = DomUtil.getHighestZIndex();
    if (parentZindex !== null && parentZindex >= zindex) zindex = parentZindex + 1;

    this.clearPositioningStyles();
    if (zindex) this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'z-index', zindex.toString());

    this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'opacity', '0');
    this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'visibility', 'hidden');
    this.host.renderer.addClass(this.host.elementRef.nativeElement, 'show');

    this.initStandaloneMenuPopper();

    if (this.host.window) {
      this.host.window.setTimeout(() => {
        this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'opacity', '1');
        this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'visibility', 'visible');
      }, 50);
    }

    this.dispatch('ds.menu.shown');
    this.menuShown.emit();
  }

  private hideStandaloneMenu(): void {
    if (!this.host.isBrowser) return;
    if (this.dispatch('ds.menu.hide') === false) return;

    this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'opacity', '0');
    this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'visibility', 'hidden');
    this.host.renderer.removeStyle(this.host.elementRef.nativeElement, 'z-index');
    this.destroyStandaloneMenuPopper();
    this.host.renderer.removeClass(this.host.elementRef.nativeElement, 'show');

    this.dispatch('ds.menu.hidden');
    this.menuHidden.emit();
  }

  private hideAllStandaloneMenus(): void {
    if (!this.host.document) return;
    const menus = this.host.document.querySelectorAll(SEL.MENU_SHOW_DIRECTIVE);
    menus.forEach((menu: Element) => {
      const el = menu as HTMLElement;
      if (el !== this.host.elementRef.nativeElement) {
        const dir = DataUtil.get(el, 'menuDirective') as MenuDirective;
        if (dir) dir.hideStandaloneMenu();
      }
    });
  }

  private loadPopper(): Promise<PopperFactory | null> {
    if (!this.host.isBrowser) return Promise.resolve(null);
    if (this.popperFactory) return Promise.resolve(this.popperFactory);

    if (!this.popperLoader) {
      this.popperLoader = import('@popperjs/core')
        .then((module) => {
          const def = (module as unknown as { default?: { createPopper?: PopperFactory } }).default;
          const factory = module.createPopper ?? def?.createPopper ?? (def as unknown as PopperFactory | undefined) ?? null;
          if (factory) {
            this.popperFactory = factory;
            return factory;
          }
          return null;
        })
        .catch((error) => {
          if (!this.popperLoadLoggedError) {
            this.popperLoadLoggedError = true;
            this.logger.error('Failed to load Popper.js', 'MenuDirective', { error });
          }
          return null;
        });
    }

    return this.popperLoader;
  }

  private withPopper(callback: (factory: PopperFactory) => void): void {
    void this.loadPopper().then((factory) => {
      if (factory && !this.isBaseDestroyed()) callback(factory);
    });
  }

  private initDropdownPopper(item: HTMLElement, sub: HTMLElement): void {
    let ref: Element | null = null;
    const attach = this.getItemOpt(item, 'attach') as string;

    if (attach) {
      ref = attach === 'parent' ? (item.parentNode as Element) : this.host.document?.querySelector(attach) || null;
    } else {
      ref = item;
    }

    if (ref) {
      this.withPopper((factory) => {
        const popper = factory(ref as Element, sub, this.getDropdownPopperConfig(item));
        DataUtil.set(item, 'popper', popper);
      });
    }
  }

  private getDropdownPopperConfig(item: HTMLElement): object {
    const placementOpt = this.getItemOpt(item, 'placement');
    let placement: string = placementOpt || 'right';

    const offsetVal = this.getItemOpt(item, 'offset');
    let offset: [number, number] = [0, 0];
    if (offsetVal) {
      const arr = offsetVal.toString().split(',');
      offset = [
        CoreUtil.parseNumber(arr[0]?.trim() || '0'),
        CoreUtil.parseNumber(arr[1]?.trim() || '0'),
      ];
    }

    const strategy: 'absolute' | 'fixed' = this.parseBool(this.getItemOpt(item, 'overflow')) ? 'absolute' : 'fixed';

    return {
      placement,
      strategy,
      modifiers: [{ name: 'offset', options: { offset } }, { name: 'preventOverflow' }],
    };
  }

  private initStandaloneMenuPopper(): void {
    const trigger = this.findStandaloneMenuTrigger();
    if (!trigger) return;

    const placement = (trigger.getAttribute('data-velora-menu-placement') || 'bottom-start') as Placement;
    const offset = trigger.getAttribute('data-velora-menu-offset') || '0px, 0px';
    const arr = offset.split(',').map((s) => s.trim());
    const offsetVals: [number, number] = [
      CoreUtil.parseNumber(arr[0]?.replace('px', '') || '0'),
      CoreUtil.parseNumber(arr[1]?.replace('px', '') || '0'),
    ];

    const config = {
      placement,
      strategy: 'absolute' as const,
      modifiers: [
        { name: 'offset', options: { offset: offsetVals } },
        { name: 'preventOverflow', options: { boundary: 'viewport', padding: 8 } },
        { name: 'flip', options: { flipVariations: false, boundary: 'viewport' } },
        { name: 'computeStyles', options: { adaptive: true, roundOffsets: true } },
      ],
    };

    this.withPopper((factory) => {
      const popper = factory(trigger, this.host.elementRef.nativeElement, config as Parameters<typeof factory>[2]);
      DataUtil.set(this.host.elementRef.nativeElement, 'popper', popper);
    });
  }

  private findStandaloneMenuTrigger(): HTMLElement | null {
    const internal = this.host.elementRef.nativeElement.querySelectorAll(SEL.DATA_MENU_TRIGGER);
    for (const t of internal) {
      if (this.getItemTriggerValue(t as HTMLElement) === 'click') return t as HTMLElement;
    }

    if (this.host.elementRef.nativeElement.parentElement) {
      const siblings = Array.from(this.host.elementRef.nativeElement.parentElement.children);
      const idx = siblings.indexOf(this.host.elementRef.nativeElement);

      for (let i = idx - 1; i >= 0; i--) {
        const s = siblings[i] as HTMLElement;
        if (s.hasAttribute('data-velora-menu-trigger') && this.getItemTriggerValue(s) === 'click') return s;
        const nested = s.querySelectorAll(SEL.DATA_MENU_TRIGGER);
        for (const n of nested) {
          if (this.getItemTriggerValue(n as HTMLElement) === 'click') return n as HTMLElement;
        }
      }

      for (let i = idx + 1; i < siblings.length; i++) {
        const s = siblings[i] as HTMLElement;
        if (s.hasAttribute('data-velora-menu-trigger') && this.getItemTriggerValue(s) === 'click') return s;
        const nested = s.querySelectorAll(SEL.DATA_MENU_TRIGGER);
        for (const n of nested) {
          if (this.getItemTriggerValue(n as HTMLElement) === 'click') return n as HTMLElement;
        }
      }
    }

    if (this.host.elementRef.nativeElement.parentElement) {
      let parent: HTMLElement | null = this.host.elementRef.nativeElement.parentElement;
      for (let level = 0; level < 3 && parent; level++) {
        const siblings = Array.from(parent.children);
        for (const s of siblings) {
          const el = s as HTMLElement;
          if (el.hasAttribute('data-velora-menu-trigger') && this.getItemTriggerValue(el) === 'click') return el;
          const nested = el.querySelectorAll(SEL.DATA_MENU_TRIGGER);
          for (const n of nested) {
            if (this.getItemTriggerValue(n as HTMLElement) === 'click') return n as HTMLElement;
          }
        }
        parent = parent.parentElement;
      }
    }

    return null;
  }

  private destroyDropdownPopper(item: HTMLElement): void {
    this.destroyPopperInst(item);
  }

  private destroyStandaloneMenuPopper(): void {
    this.destroyPopperInst(this.host.elementRef.nativeElement);
  }

  private destroyPopperInst(el: HTMLElement): void {
    if (DataUtil.has(el, 'popper')) {
      const popper = DataUtil.get(el, 'popper') as PopperInstance;
      if (popper?.destroy) popper.destroy();
      DataUtil.remove(el, 'popper');
    }
  }

  private clearPositioningStyles(): void {
    if (!this.host.isBrowser) return;
    ['position', 'top', 'left', 'transform', 'inset', 'margin'].forEach((p) =>
      this.host.renderer.removeStyle(this.host.elementRef.nativeElement, p)
    );
    this.host.renderer.removeAttribute(this.host.elementRef.nativeElement, 'data-popper-placement');
  }

  private queryElements(): void {
    this.triggerEl = this.findTrigger();
    this.subEl = this.findSubmenu();
  }

  private refresh(): void {
    this.queryElements();
  }

  private findTrigger(): HTMLElement | null {
    let trigger = this.findBySel(SEL.DATA_MENU_TRIGGER);
    if (!trigger && this.host.elementRef.nativeElement.hasAttribute('data-velora-menu-trigger')) {
      trigger = this.host.elementRef.nativeElement;
    }
    if (!trigger) {
      const parent = this.host.elementRef.nativeElement.closest(SEL.DATA_MENU_TRIGGER) as HTMLElement | null;
      if (parent) trigger = parent;
    }
    return trigger;
  }

  private findSubmenu(): HTMLElement | null {
    let sub = this.findBySel(SEL.MENU_SUB);
    if (!sub) {
      const children = Array.from(this.host.elementRef.nativeElement.children) as HTMLElement[];
      sub = children.find((c) => !c.hasAttribute('data-velora-menu-trigger') && !c.closest(SEL.DATA_MENU_TRIGGER)) || null;
    }
    return sub;
  }

  private findItemLink(item: HTMLElement): HTMLElement | null {
    return this.findBySel(SEL.MENU_LINK, item);
  }

  private findItemToggle(item: HTMLElement): HTMLElement | null {
    return this.findBySel(SEL.MENU_TOGGLE, item);
  }

  private findItemSub(item: HTMLElement): HTMLElement | null {
    let sub = this.findBySel(SEL.MENU_SUB, item);
    if (!sub) {
      const children = Array.from(item.children) as HTMLElement[];
      sub = children.find((c) => !c.hasAttribute('data-velora-menu-trigger') && !c.closest(SEL.DATA_MENU_TRIGGER)) || null;
    }
    if (!sub && DataUtil.has(item, 'sub')) {
      sub = DataUtil.get(item, 'sub') as HTMLElement;
    }
    return sub;
  }

  private findItemParents(item: HTMLElement): HTMLElement[] {
    if (!this.host.isBrowser) return [];
    const parents: HTMLElement[] = [];
    let parent = item.parentElement;
    while (parent && parent !== this.host.elementRef.nativeElement) {
      if (parent.classList.contains(CSS.MENU_ITEM)) parents.push(parent);
      parent = parent.parentElement;
    }
    return parents;
  }

  private getItemElement(el: HTMLElement): HTMLElement | undefined {
    if (this.isTriggerElement(el)) return el;
    if (el.hasAttribute('data-velora-menu-trigger')) return el;
    const item = el.closest(SEL.DATA_MENU_TRIGGER) as HTMLElement;
    return item || undefined;
  }

  private findBySel(sel: string, ctx: HTMLElement = this.host.elementRef.nativeElement): HTMLElement | null {
    return ctx.querySelector(sel) as HTMLElement | null;
  }

  private findAllBySel(sel: string, ctx: HTMLElement = this.host.elementRef.nativeElement): HTMLElement[] {
    return Array.from(ctx.querySelectorAll(sel)) as HTMLElement[];
  }

  private hasClass(el: HTMLElement, cls: string): boolean {
    if (!this.host.isBrowser) return false;
    return el.classList.contains(cls);
  }

  private addClass(el: HTMLElement, cls: string): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.addClass(el, cls);
  }

  private removeClass(el: HTMLElement, cls: string): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.removeClass(el, cls);
  }

  private setStyle(el: HTMLElement, prop: string, val: string): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.setStyle(el, prop, val);
  }

  private isValidEl(el: HTMLElement | null): el is HTMLElement {
    return el !== null && el instanceof HTMLElement;
  }

  private normalizeDim(val: string | number | MenuResponsiveDimension | undefined): string | number | undefined {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'string' || typeof val === 'number') return val;

    const resolved = ResponsiveUtil.getBreakpointValue(val as { default: string | number; [key: string]: string | number });
    if (typeof resolved === 'object' && resolved !== null) {
      const def = (resolved as MenuResponsiveDimension).default;
      return typeof def === 'string' || typeof def === 'number' ? def : undefined;
    }
    return typeof resolved === 'string' || typeof resolved === 'number' ? resolved : undefined;
  }

  private getItemOpt(item: HTMLElement, opt: string): string | null {
    return item.getAttribute(`data-velora-menu-${opt}`);
  }

  private getItemSubTypeInternal(item: HTMLElement): 'dropdown' | 'accordion' {
    if (!this.host.isBrowser) return 'dropdown';
    const sub = this.findItemSub(item);
    if (!sub) return 'dropdown';

    if (sub.classList.contains(CSS.MENU_SUB_DROPDOWN)) return 'dropdown';
    if (sub.classList.contains(CSS.MENU_SUB_ACCORDION)) return 'accordion';
    return parseInt(this.getCss(sub, 'z-index')) > 0 ? 'dropdown' : 'accordion';
  }

  private getCss(el: HTMLElement, prop: string): string {
    const view = (el.ownerDocument || this.host.document).defaultView;
    if (!view) return '';
    prop = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    return view.getComputedStyle(el, null).getPropertyValue(prop);
  }

  private resolveTriggerValue(): 'click' | 'hover' {
    const trigger = this.optionsManager.snapshot().trigger || 'click';
    if (typeof trigger === 'string') return trigger === 'auto' ? 'click' : trigger;
    if (typeof trigger === 'object' && trigger !== null) {
      const resolved = ResponsiveUtil.getBreakpointValue(trigger as { default: string; [key: string]: string });
      return resolved === 'auto' ? 'click' : (resolved as 'click' | 'hover');
    }
    return 'click';
  }

  private getItemTriggerValue(item: HTMLElement): 'click' | 'hover' {
    const cached = DataUtil.get(item, 'menuTriggerValue') as 'click' | 'hover' | undefined;
    if (cached) return cached;

    const itemTrigger = this.getItemOpt(item, 'trigger');
    if (itemTrigger) {
      const simple = ['click', 'hover', 'auto'];
      if (simple.includes(itemTrigger.toLowerCase())) {
        const val = itemTrigger.toLowerCase() === 'auto' ? 'click' : (itemTrigger.toLowerCase() as 'click' | 'hover');
        return this.cacheTrigger(item, val);
      }

      if (itemTrigger.trim().startsWith('{') && itemTrigger.trim().endsWith('}')) {
        const resolved = runSafely(
          () => {
            let json = itemTrigger.trim().replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
            const parsed = JSON.parse(json) as Record<string, string>;
            if (typeof parsed === 'object' && parsed !== null) {
              if (this.triggerElement === item) return this.cacheTrigger(item, 'click');
              const res = ResponsiveUtil.getBreakpointValue(parsed as { default: string; [key: string]: string });
              if (typeof res === 'object' && res !== null) {
                const def = (res as { default?: string }).default;
                return this.cacheTrigger(item, def === 'auto' ? 'click' : (def as 'click' | 'hover'));
              }
              return this.cacheTrigger(item, res === 'auto' ? 'click' : (res as 'click' | 'hover'));
            }
            return undefined;
          },
          (error) => this.logger.error('Parse trigger failed', 'MenuDirective', { error, item, trigger: itemTrigger })
        );
        if (resolved) return resolved;
      }

      const fallback = itemTrigger.toLowerCase() === 'auto' ? 'click' : (itemTrigger.toLowerCase() as 'click' | 'hover');
      return this.cacheTrigger(item, fallback);
    }

    return this.cacheTrigger(item, this.resolveTriggerValue());
  }

  private cacheTrigger(item: HTMLElement, val: 'click' | 'hover'): 'click' | 'hover' {
    DataUtil.set(item, 'menuTriggerValue', val);
    return val;
  }

  private calcZIndex(base: number = 1050): number {
    const parent = DomUtil.getHighestZIndex();
    return parent !== null && parent >= base ? parent + 1 : base;
  }

  private parseBool(val: unknown): boolean {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return false;
  }

  private dispatch(name: string, detail?: unknown): boolean {
    const event = new CustomEvent(name, { detail, bubbles: true });
    return this.host.elementRef.nativeElement.dispatchEvent(event);
  }

  private resetStates(): void {
    const items = this.findAllBySel('.menu-item');
    items.forEach((item) => {
      this.removeClass(item, CSS.SHOW);
      this.removeClass(item, CSS.HERE);
      this.removeClass(item, CSS.ACTIVE);
    });
  }

  private destroyPopper(): void {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
    if (this.host.isBrowser && this.subEl) this.host.renderer.removeClass(this.subEl, 'show');
  }

  private initGlobalHandlers(): void {
    MenuDirective.initGlobalHandlers();
  }

  handleTriggerClick(trigger: HTMLElement, e: Event): void {
    e.preventDefault();
    const type = this.getItemTriggerValue(trigger);
    if (type === 'click') {
      if (this.isTriggerElement(trigger)) {
        this.toggleStandaloneMenu();
      } else {
        this.handleItemClick(trigger, e);
      }
    }
  }

  private resolveResponsive(val: unknown): boolean {
    const resolved = runSafely(
      () => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'object') return CoreUtil.coerceBooleanProperty(ResponsiveUtil.getBreakpointValue(val as { default: string | number; [key: string]: string | number }));
        return true;
      },
      (error) => this.handleError('Responsive resolution failed', error)
    );
    return resolved ?? true;
  }

  private handleError(msg: string, error: unknown): void {
    this.status.setError(msg);
    this.logger.error(msg, 'MenuDirective', { element: this.host.elementRef.nativeElement, error });
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.clearBaseDomListeners();
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.animationTimeout = null;
      }

      this.eventHandlers.forEach((id, name) => {
        EventUtil.removeEventListener(this.host.elementRef.nativeElement, name, id);
      });
      this.eventHandlers.clear();

      this.hoverTimeouts.forEach((t) => clearTimeout(t));
      this.hoverTimeouts.clear();

      this.destroyStandaloneMenuPopper();
      this.baseCleanup();
    }, 'Cleanup failed');
  }

  public static getInstance(el: HTMLElement): MenuDirective | null {
    if (typeof window === 'undefined') return null;

    const elMenu = DataUtil.get(el, 'menuDirective');
    if (elMenu) return elMenu as MenuDirective;

    const menu = el.closest(SEL.MENU);
    if (menu) {
      const data = DataUtil.get(menu as HTMLElement, 'menuDirective');
      if (data) return data as MenuDirective;
    }

    if (el.classList.contains(CSS.MENU_LINK)) {
      const sub = el.closest(SEL.MENU_SUB);
      if (sub) {
        const data = DataUtil.get(sub as HTMLElement, 'menuDirective');
        if (data) return data as MenuDirective;
      }
    }

    if (el.hasAttribute('data-velora-menu-trigger')) {
      let next = el.nextElementSibling;
      while (next && !next.hasAttribute('vlVeloraMenu') && next.getAttribute('data-velora-menu') !== 'true') {
        next = next.nextElementSibling;
      }
      if (next && (next.hasAttribute('vlVeloraMenu') || next.getAttribute('data-velora-menu') === 'true')) {
        const data = DataUtil.get(next as HTMLElement, 'menuDirective');
        if (data) return data as MenuDirective;
      }

      if (el.parentElement) {
        const siblings = Array.from(el.parentElement.children);
        for (const s of siblings) {
          if (s.hasAttribute('vlVeloraMenu') || s.getAttribute('data-velora-menu') === 'true') {
            const data = DataUtil.get(s as HTMLElement, 'menuDirective');
            if (data) return data as MenuDirective;
          }
        }
      }
    }

    return null;
  }

  public static hideDropdowns(skip?: HTMLElement): void {
    if (typeof document === 'undefined') return;
    const items = document.querySelectorAll<HTMLElement>(SEL.SHOW_MENU_DROPDOWN);
    items.forEach((item) => {
      const menu = MenuDirective.getInstance(item);
      if (menu && menu.getItemSubType(item) === 'dropdown') {
        if (skip) {
          const sub = menu.getItemSubElement(item);
          if (sub && !sub.contains(skip) && !item.contains(skip) && item !== skip) menu.hide();
        } else {
          menu.hide();
        }
      }
    });
  }

  public static updateDropdowns(): void {
    if (typeof document === 'undefined') return;
    const items = document.querySelectorAll(SEL.SHOW_MENU_DROPDOWN);
    items.forEach((item: Element) => {
      const el = item as HTMLElement;
      if (DataUtil.has(el, 'popper')) {
        const popper = DataUtil.get(el, 'popper') as PopperInstance;
        if (popper?.update) popper.update();
      }
    });
  }

  public static createInstances(_selector: string): void {}

  public static initGlobalHandlers(): void {
    const win = globalThis as unknown as MenuDirectiveWindow;
    if (win.veloraMenuDirectiveHandlersInitialized) return;
    MenuDirective.initGlobalHandlersInternal();
  }

  private static initGlobalHandlersInternal(): void {
    if (typeof document === 'undefined') return;
    const win = globalThis as unknown as MenuDirectiveWindow;
    if (win.veloraMenuDirectiveHandlersInitialized) return;
    win.veloraMenuDirectiveHandlersInitialized = true;

    document.addEventListener(
      'click',
      (e: Event) => {
        const target = e.target as HTMLElement;
        let triggerEl = target;
        while (triggerEl && typeof document !== 'undefined' && triggerEl !== document.body) {
          if (triggerEl.hasAttribute('data-velora-menu-trigger')) {
            const dir = MenuDirective.getInstance(triggerEl) as MenuDirective;
            if (dir) {
              e.preventDefault();
              e.stopPropagation();
              return dir.handleTriggerClick(triggerEl, e);
            }
            break;
          }
          triggerEl = triggerEl.parentElement as HTMLElement;
        }
      },
      true
    );

    if (!document.body) return;
    DomUtil.addEventDelegate(
      document.body,
      SEL.MENU_SUB_WITH_TRIGGER,
      'mouseover',
      (e: Event, target: HTMLElement) => {
        const menuEl = target.closest(SEL.DIRECTIVE) as HTMLElement;
        if (menuEl) {
          const dir = DataUtil.get(menuEl, 'menuDirective') as MenuDirective;
          if (dir) dir.handleMouseOver(target, e);
        }
      }
    );

    DomUtil.addEventDelegate(
      document.body,
      SEL.MENU_SUB_WITH_TRIGGER,
      'mouseout',
      (e: Event, target: HTMLElement) => {
        const menuEl = target.closest(SEL.DIRECTIVE) as HTMLElement;
        if (menuEl) {
          const dir = DataUtil.get(menuEl, 'menuDirective') as MenuDirective;
          if (dir) dir.handleMouseOut(target, e);
        }
      }
    );

    document.addEventListener('click', (e) => {
      const items = document.querySelectorAll(SEL.SHOW_MENU_DROPDOWN);
      items.forEach((item) => {
        const el = item as HTMLElement;
        const menuEl = el.closest(SEL.DIRECTIVE) as HTMLElement;
        if (menuEl) {
          const dir = DataUtil.get(menuEl, 'menuDirective') as MenuDirective;
          if (dir && dir.getItemSubTypeInternal(el) === 'dropdown') {
            const sub = dir.findItemSub(el);
            if (el === e.target || el.contains(e.target as HTMLElement)) return;
            if (sub && (sub === e.target || sub.contains(e.target as HTMLElement))) return;
            dir.hideDropdown(el);
          }
        }
      });

      const menus = document.querySelectorAll(SEL.MENU_SHOW_DIRECTIVE);
      menus.forEach((menu) => {
        const el = menu as HTMLElement;
        const dir = DataUtil.get(el, 'menuDirective') as MenuDirective;
        if (dir) {
          const trigger = MenuDirective.findStandaloneMenuTrigger(el);
          if (trigger && (trigger === e.target || trigger.contains(e.target as HTMLElement))) return;
          if (el === e.target || el.contains(e.target as HTMLElement)) return;
          dir.hideStandaloneMenu();
        }
      });
    });
  }

  private static findStandaloneMenuTrigger(menu: HTMLElement): HTMLElement | null {
    if (menu.parentElement) {
      const siblings = Array.from(menu.parentElement.children);
      const idx = siblings.indexOf(menu);

      for (let i = idx - 1; i >= 0; i--) {
        const s = siblings[i] as HTMLElement;
        if (s.hasAttribute('data-velora-menu-trigger') && MenuDirective.parseTriggerValue(s) === 'click') return s;
      }

      for (let i = idx + 1; i < siblings.length; i++) {
        const s = siblings[i] as HTMLElement;
        if (s.hasAttribute('data-velora-menu-trigger') && MenuDirective.parseTriggerValue(s) === 'click') return s;
      }
    }
    return null;
  }

  private static parseTriggerValue(item: HTMLElement): 'click' | 'hover' {
    const trigger = item.getAttribute('data-velora-menu-trigger');
    if (!trigger) return 'click';

    const fallback = trigger === 'auto' ? 'click' : (trigger as 'click' | 'hover');

    const resolved = runSafely(
      () => {
        if (trigger.startsWith('{') && trigger.endsWith('}')) {
          const json = trigger.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
          const parsed = JSON.parse(json) as Record<string, string | undefined>;
          if (parsed && typeof parsed === 'object') {
            const res = ResponsiveUtil.getBreakpointValue(parsed as { default: string; [key: string]: string });
            if (typeof res === 'object' && res !== null) {
              const def = (res as { default?: string }).default;
              return typeof def === 'string' ? (def === 'auto' ? 'click' : (def as 'click' | 'hover')) : fallback;
            }
            return typeof res === 'string' ? (res === 'auto' ? 'click' : (res as 'click' | 'hover')) : fallback;
          }
        }
        return fallback;
      },
      () => fallback
    );

    return resolved ?? fallback;
  }
}
