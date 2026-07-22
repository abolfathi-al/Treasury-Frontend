import { Component } from '@angular/core';

import { PASSWORD_INPUT_IMPORTS } from '../standard-control-imports';
import { PasswordFormControl } from '../standard-control-base';

@Component({
  selector: 'vl-password-control',
  standalone: true,
  imports: PASSWORD_INPUT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <div
          vlVeloraPasswordMeter
          [passwordMeterActivate]="true"
          [passwordMeterMinLength]="minPasswordLength()"
          [passwordMeterInputSelector]="'input[type=&quot;password&quot;], input[type=&quot;text&quot;]'"
          [passwordMeterVisibilitySelector]="'[data-velora-password-meter-control=&quot;visibility&quot;]'"
          [passwordMeterHighlightSelector]="'[data-velora-password-meter-control=&quot;highlight&quot;]'"
          [passwordMeterScoreHighlightClass]="'bg-success'"
          (passwordMeterScoreChange)="onPasswordScoreChange($event)"
        >
          <div class="position-relative">
            <input
              [id]="controlName"
              class="form-control"
              type="password"
              vlAntiAutocomplete
              autocomplete="new-password"
              [readonly]="readonly()"
              [placeholder]="placeholder() | translate"
              [formControlName]="controlName"
              (blur)="onBlur()"
            />
            <button
              type="button"
              class="btn btn-sm btn-icon position-absolute translate-middle-y top-50 end-0 me-1"
              data-velora-password-meter-control="visibility"
              [attr.aria-label]="'common.actions.togglePasswordVisibility' | translate"
            >
              <i class="ki-duotone ki-eye-slash fs-2 d-none" aria-hidden="true"></i>
              <i class="ki-duotone ki-eye fs-2" aria-hidden="true"></i>
            </button>
          </div>
          <div class="d-flex align-items-center mt-2" aria-hidden="true">
            <div class="flex-grow-1 bg-secondary rounded h-5px me-2" data-velora-password-meter-control="highlight"></div>
            <div class="flex-grow-1 bg-secondary rounded h-5px me-2" data-velora-password-meter-control="highlight"></div>
            <div class="flex-grow-1 bg-secondary rounded h-5px me-2" data-velora-password-meter-control="highlight"></div>
            <div class="flex-grow-1 bg-secondary rounded h-5px" data-velora-password-meter-control="highlight"></div>
          </div>
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
export class PasswordControlComponent extends PasswordFormControl {}
