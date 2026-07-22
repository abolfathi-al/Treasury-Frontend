import { Component } from '@angular/core';

import { SelectFormControl } from '../standard-control-base';
import { SELECT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-multi-select-control',
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
          [items]="optionsArray()"
          [bindLabel]="bindLabel()"
          [bindValue]="bindValue()"
          [clearable]="clearable()"
          [searchable]="searchable()"
          [readonly]="readonly()"
          [multiple]="true"
          [loading]="loading()"
          [placeholder]="placeholder() | translate"
          [notFoundText]="emptyText() | translate"
          [formControlName]="controlName"
          (change)="emitCurrentValue([])"
          (blur)="onBlur()"
        ></ng-select>
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class MultiSelectControlComponent<TValue = string> extends SelectFormControl<TValue, readonly TValue[]> {
  protected override getInitialValue(): readonly TValue[] {
    return [];
  }
}
