import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { LoggerService } from '@core/services/logger.service';
import {
  catchError,
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Observable,
  OperatorFunction,
  startWith,
  switchMap,
  take
} from 'rxjs';

export interface FormFieldState {
  valid: boolean;
  value: Record<string, unknown>;
}

export interface FieldValueChange {
  field: string;
  value: unknown;
}

type FormValidationErrorMap = Record<string, Record<string, unknown>>;
type FormValueMap = Record<string, unknown>;

const MIN_PASSWORD_LENGTH = 8;
const MIN_PASSWORD_SCORE = 4;

export class FormUtil {
  static flattenFormControls(form: AbstractControl): AbstractControl[] {
    try {
      let extracted: AbstractControl[] = [form];
      if (form instanceof FormArray || form instanceof FormGroup) {
        const children = Object.values(form.controls).map(control =>
          this.flattenFormControls(control)
        );
        extracted = extracted.concat(...children);
      }
      return extracted;
    } catch (error) {
      LoggerService.Error('Failed to flatten form controls', 'FormUtil', {
        data: { form, error }
      });
      return [form];
    }
  }

  static getFormValidationErrors(form: FormGroup): FormValidationErrorMap {
    try {
      const errors: FormValidationErrorMap = {};

      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control && control.errors) {
          errors[key] = control.errors as Record<string, unknown>;
        }
      });

      return errors;
    } catch (error) {
      LoggerService.Error('Failed to get form validation errors', 'FormUtil', {
        data: { form, error }
      });
      return {};
    }
  }

  static markFormGroupTouched(form: FormGroup): void {
    try {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control) {
          control.markAsTouched();

          if (control instanceof FormGroup) {
            this.markFormGroupTouched(control);
          }
        }
      });
    } catch (error) {
      LoggerService.Error('Failed to mark form group as touched', 'FormUtil', {
        data: { form, error }
      });
    }
  }

  static resetForm(form: FormGroup): void {
    try {
      form.reset();
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control) {
          control.setErrors(null);
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
    } catch (error) {
      LoggerService.Error('Failed to reset form', 'FormUtil', {
        data: { form, error }
      });
    }
  }

  static isFormValid(form: FormGroup): boolean {
    try {
      return form.valid;
    } catch (error) {
      LoggerService.Error('Failed to check form validity', 'FormUtil', {
        data: { form, error }
      });
      return false;
    }
  }

  static getFormValues(form: FormGroup): FormValueMap {
    try {
      return form.value as FormValueMap;
    } catch (error) {
      LoggerService.Error('Failed to get form values', 'FormUtil', {
        data: { form, error }
      });
      return {};
    }
  }

  static setFormValues(form: FormGroup, values: FormValueMap): void {
    try {
      form.patchValue(values);
    } catch (error) {
      LoggerService.Error('Failed to set form values', 'FormUtil', {
        data: { form, values, error }
      });
    }
  }

  static focusFirstInvalidControl(form: FormGroup): void {
    try {
      const firstInvalidControl = this.getFirstInvalidControl(form);
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    } catch (error) {
      LoggerService.Error('Failed to focus first invalid control', 'FormUtil', {
        data: { form, error }
      });
    }
  }

  static getFirstInvalidControl(form: FormGroup): HTMLElement | null {
    try {
      const controls = this.flattenFormControls(form);
      const invalidControl = controls.find(control => control.invalid);

      if (invalidControl) {
        const element = document.querySelector(`[formControlName="${invalidControl}"]`) as HTMLElement;
        return element;
      }

      return null;
    } catch (error) {
      LoggerService.Error('Failed to get first invalid control', 'FormUtil', {
        data: { form, error }
      });
      return null;
    }
  }

  static isValidEmail(email: string): boolean {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    } catch (error) {
      LoggerService.Error('Failed to validate email', 'FormUtil', {
        data: { email, error }
      });
      return false;
    }
  }

  static isValidPhone(phone: string): boolean {
    try {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    } catch (error) {
      LoggerService.Error('Failed to validate phone', 'FormUtil', {
        data: { phone, error }
      });
      return false;
    }
  }

  static isValidUrl(url: string): boolean {
    try {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlRegex.test(url);
    } catch (error) {
      LoggerService.Error('Failed to validate URL', 'FormUtil', {
        data: { url, error }
      });
      return false;
    }
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    try {
      const feedback: string[] = [];
      let score = 0;

      if (password.length < MIN_PASSWORD_LENGTH) {
        feedback.push('Password must be at least 8 characters long');
      } else {
        score += 1;
      }

      if (!/[a-z]/.test(password)) {
        feedback.push('Password must contain at least one lowercase letter');
      } else {
        score += 1;
      }

      if (!/[A-Z]/.test(password)) {
        feedback.push('Password must contain at least one uppercase letter');
      } else {
        score += 1;
      }

      if (!/\d/.test(password)) {
        feedback.push('Password must contain at least one number');
      } else {
        score += 1;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        feedback.push('Password must contain at least one special character');
      } else {
        score += 1;
      }

      return {
        isValid: score >= MIN_PASSWORD_SCORE,
        score,
        feedback
      };
    } catch (error) {
      LoggerService.Error('Failed to validate password strength', 'FormUtil', {
        data: { password, error }
      });
      return {
        isValid: false,
        score: 0,
        feedback: ['Password validation failed'],
      };
    }
  }

  static isEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;

    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key =>
      this.isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }

  static distinctUntilChangedEfficient<T>(selector: (value: T) => unknown): OperatorFunction<T, T> {
    return distinctUntilChanged((prev, curr) => {
      const prevValue = selector(prev);
      const currentValue = selector(curr);
      return this.isEqual(prevValue, currentValue);
    });
  }

  static selectedFieldsInitialized(form: FormGroup, fields: string[]): Observable<void> {
    const allFieldsInitialized = fields.every(field => form.get(field));

    if (allFieldsInitialized) {
      return new Observable<void>(subscriber => {
        subscriber.next();
        subscriber.complete();
      });
    }

    return form.valueChanges.pipe(
      filter(() => fields.every(field => form.get(field))),
      take(1),
      map(() => void 0)
    );
  }

  static selectedFieldsValueChanges(
    form: FormGroup,
    fields: string[],
    debounce = 100
  ): Observable<FormFieldState> {
    const formControls = new Map<string, AbstractControl>();

    const createFieldObservable = (field: string): Observable<FieldValueChange> | undefined => {
      const control = formControls.get(field) || form.get(field);
      if (!control) return undefined;

      formControls.set(field, control);

      return defer(() =>
        control.valueChanges.pipe(
          startWith(control.getRawValue()),
          map((value: unknown) => ({ field, value }))
        )
      ) as Observable<FieldValueChange>;
    };

    const createFormFieldState = (values: FieldValueChange[]): FormFieldState => {
      return values.reduce<FormFieldState>((acc, { field }) => {
        const control = formControls.get(field);
        if (acc.valid && control?.invalid) {
          acc.valid = false;
        }
        acc.value[field] = control?.getRawValue();
        return acc;
      }, { valid: true, value: {} as Record<string, unknown> });
    };

    return this.selectedFieldsInitialized(form, fields).pipe(
      switchMap(() => {
        const fieldObservables = fields
          .map(createFieldObservable)
          .filter((obs): obs is Observable<FieldValueChange> => obs !== undefined);

        return combineLatest(fieldObservables);
      }),
      debounceTime(debounce),
      this.distinctUntilChangedEfficient<FieldValueChange[]>(values => values),
      map(createFormFieldState),
      this.distinctUntilChangedEfficient<FormFieldState>(({ value }) => value),
      catchError((error) => {
        LoggerService.Error('Error in selectedFieldsValueChanges', 'FormUtil', {
          data: { fields, error }
        });
        return EMPTY;
      })
    );
  }
}
