import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InvalidFeedbackComponent } from '../../invalid-feedback/invalid-feedback.component';
import { NamedFormControl } from '../standard-control-base';

@Component({
  selector: 'vl-boolean-control',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, InvalidFeedbackComponent],
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        <label class="form-check form-switch form-check-custom form-check-solid">
          <input
            class="form-check-input"
            type="checkbox"
            [id]="controlName"
            [formControlName]="controlName"
            (blur)="onBlur()"
          />
          <span class="form-check-label" [class.required]="required()">{{ label() | translate }}</span>
        </label>
        @if (helpText()) {
        <div class="form-text">{{ helpText() | translate }}</div>
        }
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class BooleanControlComponent extends NamedFormControl<boolean> {
  protected override getInitialValue(): boolean {
    return false;
  }

  protected override shouldDisableControl(): boolean {
    return this.disabled() || this.readonly();
  }
}
