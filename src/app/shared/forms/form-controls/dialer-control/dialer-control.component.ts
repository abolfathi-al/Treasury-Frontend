import { Component, computed } from '@angular/core';

import { DIALER_INPUT_IMPORTS } from '../standard-control-imports';
import { NumericFormControl } from '../standard-control-base';

@Component({
  selector: 'vl-dialer-control',
  standalone: true,
  imports: DIALER_INPUT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <div
          class="input-group"
          vlVeloraDialer
          [dialerValue]="dialerValue()"
          [dialerActivate]="!readonly() && !disabled()"
          [dialerStep]="step()"
          [dialerMin]="min() ?? undefined"
          [dialerMax]="max() ?? undefined"
          [dialerDecimals]="decimals()"
          [dialerPrefix]="prefix()"
          [dialerSuffix]="suffix()"
          (valueChange)="setValue($event)"
        >
          <button
            class="btn btn-icon btn-outline btn-active-color-primary"
            type="button"
            data-velora-dialer-action="decrease"
            [disabled]="readonly() || disabled()"
            [attr.aria-label]="'common.actions.decrease' | translate"
          >
            -
          </button>
          <input
            [id]="controlName"
            class="form-control text-center"
            type="text"
            inputmode="decimal"
            [readonly]="readonly()"
            [placeholder]="placeholder() | translate"
            [formControlName]="controlName"
            (blur)="onBlur()"
          />
          <button
            class="btn btn-icon btn-outline btn-active-color-primary"
            type="button"
            data-velora-dialer-action="increase"
            [disabled]="readonly() || disabled()"
            [attr.aria-label]="'common.actions.increase' | translate"
          >
            +
          </button>
        </div>
        @if (helpText()) {
        <div class="form-text">{{ helpText() | translate }}</div>
        }
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class DialerControlComponent extends NumericFormControl {
  readonly dialerValue = computed(() => this.value() ?? 0);
}
