import {
  Component,
  provideZonelessChangeDetection,
  signal,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { API, Options } from 'nouislider';

import { CssLoaderService } from '@core/services/css-loader.service';

import { NoUiSliderDirective } from './no-ui-slider.directive';

@Component({
  imports: [NoUiSliderDirective],
  standalone: true,
  template: `
    <div
      vlVeloraNoUiSlider
      [noUiSliderStart]="start()"
      [noUiSliderStep]="step()"
    ></div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(NoUiSliderDirective);
  readonly start = signal(20);
  readonly step = signal(1);
}

describe('NoUiSliderDirective input updates', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: CssLoaderService,
          useValue: { loadCss: () => new Promise<void>(() => undefined) },
        },
      ],
    });
  });

  it('batches native option updates without recreating the slider', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const directive = component.directive();
    const updateOptions = jasmine.createSpy('updateOptions');
    const fakeInstance = {
      destroy: jasmine.createSpy('destroy'),
      get: () => '35',
      updateOptions,
    } as unknown as API;
    const internals = directive as unknown as {
      instance: API | null;
      markBaseInitialized(): void;
      reinitialize(): void;
    };
    internals.instance = fakeInstance;
    internals.markBaseInitialized();
    const reinitialize = spyOn(internals, 'reinitialize').and.stub();

    component.start.set(35);
    component.step.set(5);
    fixture.detectChanges();

    expect(reinitialize).not.toHaveBeenCalled();
    expect(updateOptions).toHaveBeenCalledOnceWith(
      jasmine.objectContaining<Options>({ start: 35, step: 5 }),
      false
    );
    fixture.destroy();
  });
});
