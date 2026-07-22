import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperDirective } from './stepper.directive';

@Component({
  imports: [StepperDirective],
  standalone: true,
  template: `
    <section data-velora-stepper="true">
      <div data-velora-stepper-element="nav">Account</div>
      <div data-velora-stepper-element="nav">Confirmation</div>
      <div data-velora-stepper-element="content">Account form</div>
      <div data-velora-stepper-element="content">Confirmation form</div>
      <button type="button" data-velora-stepper-action="previous">Back</button>
      <button type="button" data-velora-stepper-action="next">Next</button>
      <button type="submit" data-velora-stepper-action="submit">Submit</button>
    </section>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(StepperDirective);
}

describe('StepperDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('moves next and previous through the active login contract', () => {
    const fixture: ComponentFixture<HostComponent> =
      TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(100);

    const host = fixture.nativeElement as HTMLElement;
    const directive = fixture.componentInstance.directive();
    const navItems = Array.from(
      host.querySelectorAll<HTMLElement>('[data-velora-stepper-element="nav"]')
    );
    const next = host.querySelector<HTMLButtonElement>(
      '[data-velora-stepper-action="next"]'
    )!;
    const previous = host.querySelector<HTMLButtonElement>(
      '[data-velora-stepper-action="previous"]'
    )!;
    const nextEvents: Array<{ from: number; to: number }> = [];
    const previousEvents: Array<{ from: number; to: number }> = [];
    directive.stepperNext.subscribe((event) => nextEvents.push(event));
    directive.stepperPrevious.subscribe((event) => previousEvents.push(event));

    expect(directive.getCurrentStepIndex()).toBe(0);
    expect(navItems[0].classList.contains('current')).toBeTrue();
    expect(previous.style.display).toBe('none');

    next.click();

    expect(directive.getCurrentStepIndex()).toBe(1);
    expect(navItems[0].classList.contains('completed')).toBeTrue();
    expect(navItems[1].classList.contains('current')).toBeTrue();
    expect(nextEvents).toEqual([{ from: 0, to: 1 }]);

    previous.click();

    expect(directive.getCurrentStepIndex()).toBe(0);
    expect(navItems[0].classList.contains('current')).toBeTrue();
    expect(previousEvents).toEqual([{ from: 1, to: 0 }]);

    fixture.destroy();
  });
});
