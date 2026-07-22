import { Component, computed, inject, input } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

type ValidationError =
  | 'required'
  | 'requiredTrue'
  | 'email'
  | 'minlength'
  | 'maxlength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'nullValidator'
  | 'ConfirmPassword'
  | 'PasswordMeter'
  | 'matchRange'
  | 'nationalCode'
  | 'cardNumber'
  | 'atLeastOne'
  | 'onlyOne';

const VALIDATION_PRIORITY: ValidationError[] = [
  'required',
  'requiredTrue',
  'email',
  'minlength',
  'maxlength',
  'min',
  'max',
  'pattern',
  'nullValidator',
  'ConfirmPassword',
  'PasswordMeter',
  'matchRange',
  'nationalCode',
  'cardNumber',
  'atLeastOne',
  'onlyOne',
];

const VALIDATION_MESSAGES: Record<ValidationError, string> = {
  required: 'validation.required',
  requiredTrue: 'validation.agreementRequired',
  email: 'validation.email',
  minlength: 'validation.minLength',
  maxlength: 'validation.maxLength',
  min: 'validation.min',
  max: 'validation.max',
  pattern: 'validation.invalid',
  nullValidator: 'validation.notFound',
  ConfirmPassword: 'validation.invalid_CONFIRM_PASSWORD',
  PasswordMeter: 'validation.passwordMeter',
  matchRange: 'validation.invalid_RANGE',
  nationalCode: 'validation.nationalCode',
  cardNumber: 'validation.cardNumber',
  atLeastOne: 'validation.atLeastOne',
  onlyOne: 'validation.onlyOne',
} as const;

export interface ValidationErrorInfo {
  type: ValidationError;
  message: string;
  params: Record<string, unknown>;
}

@Component({
  selector: 'vl-invalid-feedback',
  templateUrl: './invalid-feedback.component.html',
  standalone: true,
  imports: [TranslateModule],
})
export class InvalidFeedbackComponent {
  private readonly rootFormGroup = inject(FormGroupDirective);

  readonly controlName = input.required<string>({ alias: 'control' });
  readonly ctrl = input<AbstractControl | null>();
  readonly name = input('');

  readonly formControl = computed<AbstractControl | null>(
    () => this.ctrl() ?? this.rootFormGroup.control.get(this.controlName())
  );

  showError(): boolean {
    const ctrl = this.formControl();
    return !!ctrl && (ctrl.dirty || ctrl.touched) && ctrl.invalid;
  }

  getErrorInfo(): ValidationErrorInfo | null {
    const ctrl = this.formControl();
    if (!ctrl?.errors) return null;

    const errorType = VALIDATION_PRIORITY.find((type) => ctrl.hasError(type));
    if (!errorType) return null;

    return {
      type: errorType,
      message: VALIDATION_MESSAGES[errorType],
      params: this.buildErrorParams(errorType, ctrl),
    };
  }

  getParamText(error: ValidationErrorInfo, key: string): string {
    const value = error.params[key];
    return typeof value === 'string' ? value : '';
  }

  private buildErrorParams(
    errorType: ValidationError,
    ctrl: AbstractControl
  ): Record<string, unknown> {
    const translatedName = this.name();
    const errors = ctrl.errors;

    switch (errorType) {
      case 'minlength':
        return {
          name: translatedName,
          min: errors?.['minlength']?.requiredLength,
        };
      case 'maxlength':
        return {
          name: translatedName,
          max: errors?.['maxlength']?.requiredLength,
        };
      case 'min':
        return { name: translatedName, min: errors?.['min']?.min };
      case 'max':
        return { name: translatedName, max: errors?.['max']?.max };
      case 'required':
      case 'requiredTrue':
      case 'pattern':
      case 'nullValidator':
        return { name: translatedName };
      default:
        return {};
    }
  }
}
