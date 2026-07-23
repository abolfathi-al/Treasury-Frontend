export type MethodDirection = 'RECEIPT' | 'PAYMENT' | 'BOTH';

export type MethodBehaviorCategory =
  | 'CASH'
  | 'CHEQUE'
  | 'BANK_TRANSFER'
  | 'DIRECT_DEPOSIT'
  | 'POS'
  | 'GATEWAY'
  | 'CARD_TRANSFER'
  | 'WALLET'
  | 'OFFSET'
  | 'FOREIGN_REMITTANCE'
  | 'OTHER_CONTROLLED';

export type MethodReference =
  | 'CASHBOX'
  | 'BANK_ACCOUNT'
  | 'CHEQUE'
  | 'POS'
  | 'GATEWAY'
  | 'TRACKING_NUMBER'
  | 'DUE_DATE'
  | 'PARTY'
  | 'EVIDENCE';

export interface PositiveMoney {
  readonly amount: string;
  readonly currency: string;
}

export interface MethodCreate {
  readonly code: string;
  readonly name: string;
  readonly direction: MethodDirection;
  readonly behaviorCategory: MethodBehaviorCategory;
  readonly requiredReferences: readonly MethodReference[];
  readonly createsFundsInTransit: boolean;
  readonly requiresApproval: boolean;
  readonly allowedCurrencies: readonly string[];
  readonly amountLimits?: readonly PositiveMoney[];
  readonly debitMappingRef?: string;
  readonly creditMappingRef?: string;
  readonly feeMappingRef?: string;
  readonly discrepancyMappingRef?: string;
  readonly templateMappingRef?: string;
}

export interface MethodView extends MethodCreate {
  readonly id: string;
  readonly state: 'ACTIVE' | 'INACTIVE';
  readonly version: number;
}

export interface PageInfo {
  readonly limit: number;
  readonly hasMore: boolean;
  readonly nextCursor?: string;
  readonly asOf?: string;
}

export interface MethodPage {
  readonly items: readonly MethodView[];
  readonly page: PageInfo;
}

export interface CurrencyView {
  readonly code: string;
  readonly name: string;
  readonly englishName?: string;
  readonly symbol?: string;
  readonly decimalPlaces: number;
  readonly baseCurrency: boolean;
  readonly state: 'ACTIVE' | 'INACTIVE';
  readonly version: number;
}

export interface CurrencyPage {
  readonly items: readonly CurrencyView[];
  readonly page: PageInfo;
}
