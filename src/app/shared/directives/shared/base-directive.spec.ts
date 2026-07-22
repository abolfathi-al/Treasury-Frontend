import {
  Component,
  Directive,
  Renderer2,
  inject,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './base-directive';

interface TestOptions {
  activate?: boolean;
  label?: string;
  count?: number;
}

@Directive({
  selector: '[vlTestBase]',
  exportAs: 'testBase',
  standalone: true,
})
class TestBaseDirective extends BaseDirective<TestOptions, string> {
  constructor() {
    super(inject(LoggerService), 'TestBaseDirective', {
      activate: true,
      label: 'default',
      count: 0,
    });
  }

  callSetClass(renderer: Renderer2, el: HTMLElement, cls: string, add: boolean): void {
    this.setClass(renderer, el, cls, add);
  }

  callSetDataAttr(
    renderer: Renderer2,
    el: HTMLElement,
    name: string,
    value: string | null
  ): void {
    this.setDataAttr(renderer, el, name, value);
  }

  callIsActivateOn(): boolean {
    return this.isActivateOn();
  }

  callGetHostWindow(): Window | null {
    return this.getHostWindow();
  }

  setActivate(v: boolean): void {
    this.updateOption('activate', v);
  }
}

@Component({
  imports: [TestBaseDirective],
  template: '<div vlTestBase></div>',
  standalone: true,
})
class HostComponent {
  readonly directive = viewChild.required(TestBaseDirective);
}

describe('BaseDirective added helpers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  function setup(): { instance: TestBaseDirective; renderer: Renderer2; el: HTMLElement } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const instance = fixture.componentInstance.directive();
    const renderer = (instance as unknown as { __renderer?: Renderer2 }).__renderer
      ?? makeRenderer();
    return { instance, renderer, el: document.createElement('div') };
  }

  function makeRenderer(): Renderer2 {
    return {
      addClass: (el: HTMLElement, c: string) => el.classList.add(c),
      removeClass: (el: HTMLElement, c: string) => el.classList.remove(c),
      setAttribute: (el: HTMLElement, n: string, v: string) => el.setAttribute(n, v),
      removeAttribute: (el: HTMLElement, n: string) => el.removeAttribute(n),
    } as unknown as Renderer2;
  }

  describe('setClass', () => {
    it('adds a class when add=true', () => {
      const { instance, renderer, el } = setup();
      instance.callSetClass(renderer, el, 'on', true);
      expect(el.classList.contains('on')).toBeTrue();
    });

    it('removes a class when add=false', () => {
      const { instance, renderer, el } = setup();
      el.classList.add('on');
      instance.callSetClass(renderer, el, 'on', false);
      expect(el.classList.contains('on')).toBeFalse();
    });

    it('is a no-op when className is empty or element is null', () => {
      const { instance, renderer, el } = setup();
      expect(() => instance.callSetClass(renderer, el, '', true)).not.toThrow();
      expect(() =>
        instance.callSetClass(renderer, null as unknown as HTMLElement, 'x', true)
      ).not.toThrow();
    });
  });

  describe('setDataAttr', () => {
    it('sets the attribute when value is a string', () => {
      const { instance, renderer, el } = setup();
      instance.callSetDataAttr(renderer, el, 'data-x', 'on');
      expect(el.getAttribute('data-x')).toBe('on');
    });

    it('removes the attribute when value is null', () => {
      const { instance, renderer, el } = setup();
      el.setAttribute('data-x', 'on');
      instance.callSetDataAttr(renderer, el, 'data-x', null);
      expect(el.hasAttribute('data-x')).toBeFalse();
    });

    it('is a no-op when element is null', () => {
      const { instance, renderer } = setup();
      expect(() =>
        instance.callSetDataAttr(renderer, null as unknown as HTMLElement, 'data-x', 'on')
      ).not.toThrow();
    });
  });

  describe('isActivateOn', () => {
    it('returns true when the activate option is true', () => {
      const { instance } = setup();
      expect(instance.callIsActivateOn()).toBeTrue();
    });

    it('returns false when the activate option is set to false', () => {
      const { instance } = setup();
      instance.setActivate(false);
      expect(instance.callIsActivateOn()).toBeFalse();
    });
  });

  describe('getHostWindow', () => {
    it('returns the global window in the browser test environment', () => {
      const { instance } = setup();
      expect(instance.callGetHostWindow()).toBe(window);
    });
  });
});
