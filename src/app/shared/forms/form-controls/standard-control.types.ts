export interface SharedSelectOption<TValue = string> {
  readonly label: string;
  readonly value: TValue;
  readonly disabled?: boolean;
  readonly group?: string;
  readonly detail?: string;
}

export const LOCKED_SCOPE_DIMENSIONS = new Set([
  'tenantId',
  'organizationId',
  'orgUnitId',
  'relationshipContextId',
  'countryId',
  'cityId',
  'currencyCode',
  'productType',
  'supplierId',
  'consumerId',
  'agencyId',
  'resourceType',
  'channel',
  'bookingFlow',
]);
