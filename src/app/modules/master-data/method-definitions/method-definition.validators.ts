import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import {
  MethodBehaviorCategory,
  MethodReference,
  PositiveMoney,
} from './method-definition.models';

const RESOURCE_ANCHORS = new Set<MethodReference>([
  'CASHBOX',
  'BANK_ACCOUNT',
  'CHEQUE',
  'POS',
  'GATEWAY',
]);

const EXPECTED_ANCHOR = new Map<
  MethodBehaviorCategory,
  MethodReference | null
>([
  ['CASH', 'CASHBOX'],
  ['CHEQUE', 'CHEQUE'],
  ['BANK_TRANSFER', 'BANK_ACCOUNT'],
  ['DIRECT_DEPOSIT', 'BANK_ACCOUNT'],
  ['POS', 'POS'],
  ['GATEWAY', 'GATEWAY'],
  ['CARD_TRANSFER', 'BANK_ACCOUNT'],
  ['WALLET', null],
  ['OFFSET', null],
  ['FOREIGN_REMITTANCE', 'BANK_ACCOUNT'],
  ['OTHER_CONTROLLED', null],
]);

const TRACKING_REQUIRED = new Set<MethodBehaviorCategory>([
  'BANK_TRANSFER',
  'DIRECT_DEPOSIT',
  'CARD_TRANSFER',
  'WALLET',
  'FOREIGN_REMITTANCE',
]);

const OTHER_CONTROLLED_MAPPINGS = [
  'debitMappingRef',
  'creditMappingRef',
  'feeMappingRef',
  'discrepancyMappingRef',
  'templateMappingRef',
] as const;

export const POSITIVE_DECIMAL_PATTERN =
  /^(0\.0*[1-9][0-9]*|[1-9][0-9]*(\.[0-9]{1,12})?)$/;

export const positiveDecimalValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return POSITIVE_DECIMAL_PATTERN.test(String(value))
    ? null
    : { positiveDecimal: true };
};

export function createMethodDefinitionCrossFieldValidator(
  currencyDecimalPlaces: () => ReadonlyMap<string, number>,
): ValidatorFn {
  return (control) =>
    methodDefinitionCrossFieldValidator(control, currencyDecimalPlaces());
}

export function methodDefinitionCrossFieldValidator(
  control: AbstractControl,
  currencyDecimalPlaces: ReadonlyMap<string, number> = new Map(),
): ValidationErrors | null {
  const behavior = control.get('behaviorCategory')
    ?.value as MethodBehaviorCategory | null;
  const references = new Set<MethodReference>(
    (control.get('requiredReferences')?.value ?? []) as MethodReference[],
  );
  const allowedCurrencies = new Set<string>(
    (control.get('allowedCurrencies')?.value ?? []) as string[],
  );
  const amountLimits =
    (control.get('amountLimits')?.value as PositiveMoney[] | null) ?? [];

  const errors: ValidationErrors = {};
  const limitCurrencies = amountLimits
    .map((limit) => limit.currency)
    .filter(Boolean);

  if (new Set(limitCurrencies).size !== limitCurrencies.length) {
    errors['duplicateAmountLimitCurrency'] = true;
  }
  if (
    limitCurrencies.some((currency) => !allowedCurrencies.has(currency))
  ) {
    errors['amountLimitCurrencyNotAllowed'] = true;
  }
  if (
    amountLimits.some((limit) => {
      const amount = String(limit.amount ?? '');
      const decimalPlaces = currencyDecimalPlaces.get(limit.currency);
      if (
        decimalPlaces === undefined ||
        !POSITIVE_DECIMAL_PATTERN.test(amount)
      ) {
        return false;
      }

      const fractionLength = amount.includes('.')
        ? (amount.split('.')[1]?.length ?? 0)
        : 0;
      return fractionLength > decimalPlaces;
    })
  ) {
    errors['amountScaleExceeded'] = true;
  }

  if (behavior) {
    const expectedAnchor = EXPECTED_ANCHOR.get(behavior);
    const selectedAnchors = [...references].filter((reference) =>
      RESOURCE_ANCHORS.has(reference),
    );
    if (
      (expectedAnchor && (
        selectedAnchors.length !== 1 ||
        selectedAnchors[0] !== expectedAnchor
      )) ||
      (expectedAnchor === null && selectedAnchors.length > 0)
    ) {
      errors['invalidResourceAnchor'] = true;
    }

    if (
      TRACKING_REQUIRED.has(behavior) &&
      !references.has('TRACKING_NUMBER')
    ) {
      errors['trackingNumberRequired'] = true;
    }

    if (
      behavior === 'OTHER_CONTROLLED' &&
      OTHER_CONTROLLED_MAPPINGS.some(
        (field) => !String(control.get(field)?.value ?? '').trim(),
      )
    ) {
      errors['otherControlledMappingsRequired'] = true;
    }
  }

  return Object.keys(errors).length ? errors : null;
}
