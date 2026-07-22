import { Component, input } from '@angular/core';

import { SelectFormControl } from '../standard-control-base';
import { SELECT_IMPORTS } from '../standard-control-imports';
import {
  LOCKED_SCOPE_DIMENSIONS,
  SharedSelectOption,
} from '../standard-control.types';

@Component({
  selector: 'vl-scope-selector-control',
  standalone: true,
  imports: SELECT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <ng-select
          [labelForId]="controlName"
          [items]="lockedOptionsArray()"
          [bindLabel]="bindLabel()"
          [bindValue]="bindValue()"
          [clearable]="clearable()"
          [searchable]="true"
          [readonly]="readonly()"
          [loading]="loading()"
          [multiple]="multi()"
          [placeholder]="placeholder() | translate"
          [notFoundText]="emptyText() | translate"
          [formControlName]="controlName"
          (change)="emitCurrentValue()"
          (blur)="onBlur()"
        ></ng-select>
        <div class="form-text">Locked ScopeEnvelope dimensions only.</div>
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class ScopeSelectorControlComponent<TValue = string> extends SelectFormControl<TValue> {
  readonly multi = input(false);

  lockedOptionsArray(): SharedSelectOption<TValue>[] {
    return this.optionsArray().filter((option) =>
      LOCKED_SCOPE_DIMENSIONS.has(String(option.value)),
    );
  }
}
