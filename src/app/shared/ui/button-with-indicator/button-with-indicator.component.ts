import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { ConditionalCall } from '@core/decorators';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

const BUTTON_CONSTANTS = {
  DEFAULT_WAIT_DESC: 'common.states.wait',
  DEFAULT_DISABLED: false,
  DEFAULT_LOADING: false,
} as const;

@Component({
  selector: 'vl-button-with-indicator',
  templateUrl: './button-with-indicator.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslateModule, VeloraIconComponent],
})
export class ButtonWithIndicatorComponent implements OnInit, OnDestroy {
  private readonly _isLoading = signal<boolean>(
    BUTTON_CONSTANTS.DEFAULT_LOADING
  );
  private readonly destroyRef = inject(DestroyRef);

  readonly icon = input<string>('');
  readonly title = input<string>('');
  readonly shortcut = input<string>('');
  readonly waitDesc = input<string>(BUTTON_CONSTANTS.DEFAULT_WAIT_DESC);
  readonly classes = input<string>('');
  readonly disabled = input<boolean>(BUTTON_CONSTANTS.DEFAULT_DISABLED);
  readonly isLoading$$ = input<BehaviorSubject<boolean>>(
    new BehaviorSubject<boolean>(BUTTON_CONSTANTS.DEFAULT_LOADING)
  );

  readonly clicked = output<Event>();

  readonly isLoading = computed(() => this._isLoading());

  constructor() {
    effect(() => {
      const subject = this.isLoading$$();
      untracked(() => {
        if (subject) {
          subject
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => this._isLoading.set(value));
        }
      });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  @ConditionalCall((instance) => instance.isLoading$$().getValue() === false)
  handleClick(event: Event): void {
    this.clicked.emit(event);
  }
}
