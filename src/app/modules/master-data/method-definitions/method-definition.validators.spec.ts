import { FormArray, FormControl, FormGroup } from '@angular/forms';

import {
  createMethodDefinitionCrossFieldValidator,
  positiveDecimalValidator,
} from './method-definition.validators';

const currencyDecimalPlaces = new Map([
  ['IRR', 0],
  ['USD', 2],
]);

const buildForm = () =>
  new FormGroup(
    {
      behaviorCategory: new FormControl('BANK_TRANSFER'),
      requiredReferences: new FormControl([
        'BANK_ACCOUNT',
        'TRACKING_NUMBER',
      ]),
      allowedCurrencies: new FormControl(['IRR', 'USD']),
      amountLimits: new FormArray([
        new FormGroup({
          currency: new FormControl('IRR'),
          amount: new FormControl('1000'),
        }),
      ]),
      debitMappingRef: new FormControl(''),
      creditMappingRef: new FormControl(''),
      feeMappingRef: new FormControl(''),
      discrepancyMappingRef: new FormControl(''),
      templateMappingRef: new FormControl(''),
    },
    {
      validators: createMethodDefinitionCrossFieldValidator(
        () => currencyDecimalPlaces,
      ),
    },
  );

describe('methodDefinitionCrossFieldValidator', () => {
  it('accepts a Canon-valid bank transfer configuration', () => {
    expect(buildForm().errors).toBeNull();
  });

  it('rejects duplicate amount-limit currencies', () => {
    const form = buildForm();
    const limits = form.get('amountLimits') as FormArray;
    limits.push(
      new FormGroup({
        currency: new FormControl('IRR'),
        amount: new FormControl('2000'),
      }),
    );
    form.updateValueAndValidity();

    expect(form.hasError('duplicateAmountLimitCurrency')).toBeTrue();
  });

  it('rejects limit currencies outside allowedCurrencies', () => {
    const form = buildForm();
    form.get('amountLimits.0.currency')?.setValue('EUR');

    expect(form.hasError('amountLimitCurrencyNotAllowed')).toBeTrue();
  });

  it('rejects a behavior category without its exclusive resource anchor', () => {
    const form = buildForm();
    form.get('requiredReferences')?.setValue(['CASHBOX', 'TRACKING_NUMBER']);

    expect(form.hasError('invalidResourceAnchor')).toBeTrue();
  });

  it('enforces the selected currency decimal scale', () => {
    const form = buildForm();
    form.get('amountLimits.0.amount')?.setValue('1000.1');

    expect(form.hasError('amountScaleExceeded')).toBeTrue();

    form.get('amountLimits.0.currency')?.setValue('USD');
    form.get('amountLimits.0.amount')?.setValue('1000.12');
    expect(form.hasError('amountScaleExceeded')).toBeFalse();

    form.get('amountLimits.0.amount')?.setValue('1000.123');
    expect(form.hasError('amountScaleExceeded')).toBeTrue();
  });

  it('enforces the exact Canon PositiveDecimal syntax', () => {
    const control = new FormControl('', [positiveDecimalValidator]);

    for (const valid of ['0.01', '1', '1.123456789012']) {
      control.setValue(valid);
      expect(control.errors).withContext(valid).toBeNull();
    }

    for (const invalid of ['0', '-1', '01', '1.', '1.1234567890123']) {
      control.setValue(invalid);
      expect(control.hasError('positiveDecimal'))
        .withContext(invalid)
        .toBeTrue();
    }
  });
});
