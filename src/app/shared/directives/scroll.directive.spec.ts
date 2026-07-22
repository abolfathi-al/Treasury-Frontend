import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ScrollDirective } from './scroll.directive';

type ScrollDirectiveInternals = {
  isExplicitSize: (value: unknown) => boolean;
  parsePx: (value: unknown) => number;
};

@Component({
  imports: [ScrollDirective],
  standalone: true,
  template: '<div vlVeloraScroll></div>',
})
class HostComponent {
  readonly directive = viewChild.required(ScrollDirective);
}

function virtualAsync(testFn: () => void): () => void {
  return () => {
    jasmine.clock().install();
    try {
      testFn();
    } finally {
      jasmine.clock().uninstall();
    }
  };
}

describe('ScrollDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  function setup(): {
    fixture: ComponentFixture<HostComponent>;
    directive: ScrollDirective;
    internals: ScrollDirectiveInternals;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const directive = fixture.componentInstance.directive();
    return {
      fixture,
      directive,
      internals: directive as unknown as ScrollDirectiveInternals,
    };
  }

  it(
    'treats only concrete dimensions as explicit scroll sizes',
    virtualAsync(() => {
      const { fixture, internals } = setup();

      expect(internals.isExplicitSize(undefined)).toBeFalse();
      expect(internals.isExplicitSize(null)).toBeFalse();
      expect(internals.isExplicitSize('')).toBeFalse();
      expect(internals.isExplicitSize('auto')).toBeFalse();
      expect(internals.isExplicitSize('inherit')).toBeFalse();
      expect(internals.isExplicitSize(Number.NaN)).toBeFalse();
      expect(internals.isExplicitSize('240px')).toBeTrue();
      expect(internals.isExplicitSize(240)).toBeTrue();

      fixture.destroy();
    })
  );

  it(
    'parses numeric offsets from pixel-like scroll values',
    virtualAsync(() => {
      const { fixture, internals } = setup();

      expect(internals.parsePx(undefined)).toBe(0);
      expect(internals.parsePx(null)).toBe(0);
      expect(internals.parsePx('auto')).toBe(0);
      expect(internals.parsePx('18.5px')).toBe(18.5);
      expect(internals.parsePx('-12rem')).toBe(-12);
      expect(internals.parsePx(32)).toBe(32);

      fixture.destroy();
    })
  );
});
