import { Component } from '@angular/core';

import { SelectFormControl } from '../standard-control-base';
import { SINGLE_SELECT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-single-select-control',
  standalone: true,
  imports: SINGLE_SELECT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <ng-select
          vlSingleOption
          [labelForId]="controlName"
          [items]="optionsArray()"
          [bindLabel]="bindLabel()"
          [bindValue]="bindValue()"
          [clearable]="clearable()"
          [searchable]="searchable()"
          [readonly]="readonly()"
          [loading]="loading()"
          [placeholder]="placeholder() | translate"
          [notFoundText]="emptyText() | translate"
          [formControlName]="controlName"
          (change)="emitCurrentValue()"
          (blur)="onBlur()"
        ></ng-select>
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class SingleSelectControlComponent<TValue = string> extends SelectFormControl<TValue> {}
