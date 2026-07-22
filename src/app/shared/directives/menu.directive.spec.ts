import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDirective } from './menu.directive';

@Component({
  imports: [MenuDirective],
  standalone: true,
  template: `
    <button type="button" data-velora-menu-trigger="click">Open menu</button>
    <div class="menu" vlVeloraMenu>Menu content</div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(MenuDirective);
}

describe('MenuDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('opens from its external trigger and closes on an outside click', () => {
    const fixture: ComponentFixture<HostComponent> =
      TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const host = fixture.nativeElement as HTMLElement;
    const trigger = host.querySelector<HTMLButtonElement>('button')!;
    const menu = host.querySelector<HTMLElement>('[vlVeloraMenu]')!;
    const directive = fixture.componentInstance.directive();
    const shown = spyOn(directive.menuShown, 'emit').and.callThrough();
    const hidden = spyOn(directive.menuHidden, 'emit').and.callThrough();

    trigger.click();

    expect(menu.classList.contains('show')).toBeTrue();
    expect(shown).toHaveBeenCalledTimes(1);

    document.body.click();

    expect(menu.classList.contains('show')).toBeFalse();
    expect(hidden).toHaveBeenCalledTimes(1);

    fixture.destroy();
  });
});
