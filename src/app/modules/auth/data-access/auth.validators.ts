import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const PASSWORD_MIN_CODE_POINTS = 15;
const PASSWORD_MAX_CODE_POINTS = 128;

export const passwordCodePointLengthValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const actual = Array.from(String(value)).length;
  if (actual < PASSWORD_MIN_CODE_POINTS) {
    return {
      minlength: {
        requiredLength: PASSWORD_MIN_CODE_POINTS,
        actualLength: actual,
      },
    };
  }

  if (actual > PASSWORD_MAX_CODE_POINTS) {
    return {
      maxlength: {
        requiredLength: PASSWORD_MAX_CODE_POINTS,
        actualLength: actual,
      },
    };
  }

  return null;
};
