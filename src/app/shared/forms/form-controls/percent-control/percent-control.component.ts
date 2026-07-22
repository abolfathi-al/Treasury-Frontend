import { Component } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { NumericFormControl } from '../standard-control-base';
import { MASKED_TEXT_INPUT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-percent-control',
  standalone: true,
  imports: MASKED_TEXT_INPUT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <input
          [id]="controlName"
          class="form-control"
          type="text"
          inputmode="decimal"
          vlVeloraInputmask
          [readonly]="readonly()"
          [inputmaskOptions]="numericInputmaskOptions()"
          [placeholder]="placeholder() | translate"
          [formControlName]="controlName"
          (blur)="onBlur()"
        />
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class PercentControlComponent extends NumericFormControl {
  protected override readonly defaultValidators: ValidatorFn[] = [
    Validators.min(0),
    Validators.max(100),
  ];

  override numericInputmaskOptions() {
    return {
      ...super.numericInputmaskOptions('percentage'),
      min: 0,
      max: 100,
      suffix: ' %',
    };
  }
}
