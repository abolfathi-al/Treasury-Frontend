import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormUtil } from './form.util';

describe('FormUtil typed value helpers', () => {
  it('returns validation errors keyed by form control name', () => {
    const form = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      city: new FormControl('Tehran'),
    });

    form.get('name')?.markAsTouched();
    form.updateValueAndValidity();

    expect(FormUtil.getFormValidationErrors(form)).toEqual({
      name: { required: true },
    });
  });

  it('patches and reads form values without changing the form shape', () => {
    const form = new FormGroup({
      name: new FormControl('Initial'),
      enabled: new FormControl(false),
    });

    FormUtil.setFormValues(form, { name: 'Updated', enabled: true });

    expect(FormUtil.getFormValues(form)).toEqual({
      name: 'Updated',
      enabled: true,
    });
  });
});
