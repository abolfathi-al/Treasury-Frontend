import { Component } from '@angular/core';

import { NumericFormControl } from '../standard-control-base';
import { MASKED_TEXT_INPUT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-number-control',
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
          [inputmaskOptions]="numericInputmaskOptions('numeric')"
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
export class NumberControlComponent extends NumericFormControl {}
