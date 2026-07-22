import { Component, output } from '@angular/core';

import { SelectFormControl } from '../standard-control-base';
import { SELECT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-async-select-control',
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
          [searchable]="true"
          [readonly]="readonly()"
          [loading]="loading()"
          [placeholder]="placeholder() | translate"
          [notFoundText]="emptyText() | translate"
          [formControlName]="controlName"
          (search)="emitSearchTerm($event)"
          (change)="emitCurrentValue()"
          (blur)="onBlur()"
        ></ng-select>
        @if (loading()) {
        <div class="form-text">Loading options...</div>
        } @else if (options().length === 0) {
        <div class="form-text">{{ emptyText() | translate }}</div>
        }
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class AsyncSelectControlComponent<TValue = string> extends SelectFormControl<TValue> {
  readonly searchChange = output<string>();

  emitSearchTerm(event: string | { readonly term?: string | null }): void {
    const term = typeof event === 'string' ? event : event.term ?? '';
    this.searchChange.emit(term);
  }
}
