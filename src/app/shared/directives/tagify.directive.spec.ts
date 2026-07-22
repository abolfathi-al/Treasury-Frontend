import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type Tagify from '@yaireo/tagify';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';

import { TagifyDirective, type TagifyOptions } from './tagify.directive';

class FakeTagify {
  static instances: FakeTagify[] = [];

  readonly value = [];
  readonly DOM: { originalInput: HTMLInputElement };
  readonly settings: TagifyOptions = {};
  readonly dropdown = { show: () => undefined };
  destroyed = false;

  constructor(element: HTMLInputElement) {
    this.DOM = { originalInput: element };
    FakeTagify.instances.push(this);
  }

  destroy(): void {
    this.destroyed = true;
  }
}

@Component({
  imports: [TagifyDirective],
  standalone: true,
  template: '<input vlVeloraTagify />',
})
class HostComponent {
  readonly directive = viewChild.required(TagifyDirective);
}

interface TagifyDirectiveInternals {
  tagifyCtor: typeof Tagify | null;
  tagifyLoader: Promise<typeof Tagify> | null;
  bootstrap(): Promise<void>;
}

describe('Tagify directive lifecycle', () => {
  let cssPromise: Promise<void>;
  let resolveCss!: () => void;
  let windowRef: Window;

  beforeEach(() => {
    FakeTagify.instances = [];
    cssPromise = new Promise<void>((resolve) => {
      resolveCss = resolve;
    });
    windowRef = {
      requestAnimationFrame: jasmine.createSpy('requestAnimationFrame').and.returnValue(17),
      cancelAnimationFrame: jasmine.createSpy('cancelAnimationFrame'),
    } as unknown as Window;
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: CssLoaderService,
          useValue: { loadCss: () => cssPromise },
        },
        {
          provide: LoggerService,
          useValue: { error: jasmine.createSpy('logger.error') },
        },
        { provide: WINDOW, useValue: windowRef },
      ],
    });
  });

  it('creates one instance when bootstrap runs concurrently', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as TagifyDirectiveInternals;
    let resolveLibrary!: (ctor: typeof Tagify) => void;
    internals.tagifyLoader = new Promise<typeof Tagify>((resolve) => {
      resolveLibrary = resolve;
    });

    const bootstraps = [internals.bootstrap(), internals.bootstrap()];
    internals.tagifyCtor = FakeTagify as unknown as typeof Tagify;
    resolveLibrary(internals.tagifyCtor);
    await Promise.all(bootstraps);

    expect(FakeTagify.instances.length).toBe(1);
    expect(directive.isTagifyActive()).toBeTrue();

    fixture.destroy();
    expect(FakeTagify.instances[0].destroyed).toBeTrue();
  });

  it('cancels scheduled bootstrap work on destroy', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    resolveCss();
    await Promise.resolve();

    expect(windowRef.requestAnimationFrame).toHaveBeenCalledTimes(1);
    fixture.destroy();
    expect(windowRef.cancelAnimationFrame).toHaveBeenCalledOnceWith(17);
  });
});
