import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToggleDirective } from './toggle.directive';

@Component({
  imports: [ToggleDirective],
  standalone: true,
  template: `
    <div
      vlVeloraToggle
      [toggleTargetSelector]="'.target'"
      [toggleToggleSelector]="'.toggle'"
      [toggleAnimation]="false"
    >
      <button class="toggle" type="button">toggle</button>
      <div class="target"></div>
    </div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(ToggleDirective);
}

describe('ToggleDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  function setup(): {
    fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>;
    directive: ToggleDirective;
    host: HTMLElement;
    toggle: HTMLElement;
    target: HTMLElement;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      directive: fixture.componentInstance.directive(),
      host,
      toggle: host.querySelector<HTMLElement>('.toggle')!,
      target: host.querySelector<HTMLElement>('.target')!,
    };
  }

  it('toggles the active class on the toggle element when clicked', () => {
    const { toggle, directive } = setup();
    expect(toggle.classList.contains('active')).toBeFalse();

    toggle.click();
    expect(toggle.classList.contains('active')).toBeTrue();
    expect(directive).toBeTruthy();

    toggle.click();
    expect(toggle.classList.contains('active')).toBeFalse();
  });

  it('shows and hides the target via show()/hide() API', () => {
    const { directive, target } = setup();

    directive.show();
    expect(target.classList.contains('show')).toBeTrue();
    expect(target.classList.contains('active')).toBeTrue();

    directive.hide();
    expect(target.classList.contains('show')).toBeFalse();
    expect(target.classList.contains('active')).toBeFalse();
  });

  it('sets the data-toggle attribute on the target', () => {
    const { directive, target } = setup();
    directive.show();
    expect(target.getAttribute('data-toggle')).toBe('on');
    directive.hide();
    expect(target.hasAttribute('data-toggle')).toBeFalse();
  });

  it('emits toggleChange when the active state flips', () => {
    const { directive } = setup();
    const changes: boolean[] = [];
    directive.toggleChange.subscribe((v) => changes.push(v));

    directive.show();
    directive.hide();
    directive.show();

    expect(changes).toEqual([true, false, true]);
  });

  it('disable() sets a disabled attribute on the toggle element', () => {
    const { directive, toggle } = setup();
    directive.disable();
    expect(toggle.getAttribute('disabled')).toBe('true');
    directive.enable();
    expect(toggle.hasAttribute('disabled')).toBeFalse();
  });
});
