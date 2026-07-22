import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { useDirectiveHost } from './directive-host';

@Component({
  template: '<span></span>',
  standalone: true,
})
class HostTestComponent {
  readonly host = useDirectiveHost();
}

describe('useDirectiveHost', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('returns elementRef, renderer, destroyRef, document and isBrowser=true in the browser', () => {
    const fixture = TestBed.createComponent(HostTestComponent);
    const host = fixture.componentInstance.host;

    expect(host.elementRef.nativeElement).toBeTruthy();
    expect(host.renderer).toBeDefined();
    expect(host.destroyRef).toBeDefined();
    expect(host.document).toBe(document);
    expect(host.isBrowser).toBeTrue();
    expect(host.window).not.toBeNull();
  });

  it('returns an injected Window (or the document defaultView) when in browser', () => {
    const fixture = TestBed.createComponent(HostTestComponent);
    const host = fixture.componentInstance.host;

    expect(host.window).toBeTruthy();
    expect(typeof host.window!.setTimeout).toBe('function');
  });
});
