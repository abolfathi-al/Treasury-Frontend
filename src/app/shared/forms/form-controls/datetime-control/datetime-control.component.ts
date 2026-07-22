import { Component, input } from '@angular/core';

import { DateLikeControl } from '../standard-control-base';
import { DATE_INPUT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-datetime-control',
  standalone: true,
  imports: DATE_INPUT_IMPORTS,
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
          vlVeloraFlatpickr
          [readonly]="readonly()"
          [flatpickrEnableTime]="true"
          [flatpickrDateFormat]="dateFormat() || 'Y-m-d H:i'"
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
export class DateTimeControlComponent extends DateLikeControl {
  override readonly dateFormat = input('Y-m-d H:i');
}
