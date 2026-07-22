import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ScrollTopDirective } from './scroll-top.directive';

@Component({
  imports: [ScrollTopDirective],
  standalone: true,
  template: '<button vlVeloraScrollTop [scrollTopRevealOffset]="10"></button>',
})
class HostComponent {
  readonly directive = viewChild.required(ScrollTopDirective);
}

@Component({
  standalone: true,
  template: '',
})
class BlankRouteComponent {}

describe('ScrollTopDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([{ path: 'next', component: BlankRouteComponent }]),
      ],
    });
  });

  afterEach(() => {
    document.body.removeAttribute('data-velora-scrolltop');
    document.documentElement.scrollTop = 0;
  });

  function setup(): {
    fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>;
    directive: ScrollTopDirective;
    button: HTMLElement;
    router: Router;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    return {
      fixture,
      directive: fixture.componentInstance.directive(),
      button,
      router: TestBed.inject(Router),
    };
  }

  function virtualAsync(test: () => void | Promise<void>): () => Promise<void> {
    return async () => {
      jasmine.clock().install();
      try {
        await test();
      } finally {
        jasmine.clock().uninstall();
      }
    };
  }

  it('initializes without throwing', () => {
    const { directive } = setup();
    expect(directive).toBeTruthy();
    expect(directive.isVisible()).toBeFalse();
    expect(directive.isScrolling()).toBeFalse();
  });

  it('does not set the body attribute initially when at top of page', () => {
    setup();
    expect(document.body.hasAttribute('data-velora-scrolltop')).toBeFalse();
  });

  it('exposes scrollToTop() that flips isScrolling and emits scrolledToTop after the timeout', virtualAsync(() => {
    const { directive } = setup();
    let scrolledEmitted = false;
    directive.scrolledToTop.subscribe(() => {
      scrolledEmitted = true;
    });

    directive.scrollToTop();
    expect(directive.isScrolling()).toBeTrue();

    jasmine.clock().tick(300);
    expect(directive.isScrolling()).toBeFalse();
    expect(scrolledEmitted).toBeTrue();
  }));

  it('clears the scroll completion timeout when destroyed', virtualAsync(() => {
    const { directive, fixture } = setup();
    let scrolledEmitted = false;
    directive.scrolledToTop.subscribe(() => {
      scrolledEmitted = true;
    });

    directive.scrollToTop();
    fixture.destroy();
    jasmine.clock().tick(300);

    expect(scrolledEmitted).toBeFalse();
  }));

  it('clears the route visibility timeout when destroyed', virtualAsync(async () => {
    const { directive, fixture, router } = setup();
    const shownSpy = jasmine.createSpy('scrollTopShown');
    const hiddenSpy = jasmine.createSpy('scrollTopHidden');
    const consoleWarnSpy = spyOn(console, 'warn');
    const consoleErrorSpy = spyOn(console, 'error');
    directive.scrollTopShown.subscribe(shownSpy);
    directive.scrollTopHidden.subscribe(hiddenSpy);
    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(20);
    document.documentElement.scrollTop = 20;

    await router.navigateByUrl('/next');
    fixture.destroy();
    jasmine.clock().tick(100);

    expect(shownSpy).not.toHaveBeenCalled();
    expect(hiddenSpy).not.toHaveBeenCalled();
    expect(document.body.hasAttribute('data-velora-scrolltop')).toBeFalse();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }));

  it('cleans up the data-velora-scrolltop body attribute when destroyed', () => {
    const { fixture } = setup();
    document.body.setAttribute('data-velora-scrolltop', 'on');
    fixture.destroy();

    expect(document.body.hasAttribute('data-velora-scrolltop')).toBeFalse();
  });
});
