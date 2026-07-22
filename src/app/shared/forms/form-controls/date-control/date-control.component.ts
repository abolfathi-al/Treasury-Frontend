import { Component } from '@angular/core';

import { DateLikeControl } from '../standard-control-base';
import { DATE_INPUT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-date-control',
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
          [flatpickrEnableTime]="enableTime()"
          [flatpickrDateFormat]="dateFormat()"
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
export class DateControlComponent extends DateLikeControl {}
