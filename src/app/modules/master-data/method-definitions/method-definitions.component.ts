import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { AuthService } from '@modules/auth/data-access/auth.service';
import {
  BooleanControlComponent,
  MultiSelectControlComponent,
  SingleSelectControlComponent,
  TextControlComponent,
} from '@shared/forms/form-controls';
import { SharedSelectOption } from '@shared/forms/form-controls/standard-control.types';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import {
  MethodBehaviorCategory,
  MethodCreate,
  MethodDirection,
  MethodReference,
  MethodView,
  PageInfo,
} from './method-definition.models';
import { MethodDefinitionService } from './method-definition.service';
import {
  createMethodDefinitionCrossFieldValidator,
  positiveDecimalValidator,
} from './method-definition.validators';

const DIRECTIONS: readonly MethodDirection[] = ['RECEIPT', 'PAYMENT', 'BOTH'];
const BEHAVIOR_CATEGORIES: readonly MethodBehaviorCategory[] = [
  'CASH',
  'CHEQUE',
  'BANK_TRANSFER',
  'DIRECT_DEPOSIT',
  'POS',
  'GATEWAY',
  'CARD_TRANSFER',
  'WALLET',
  'OFFSET',
  'FOREIGN_REMITTANCE',
  'OTHER_CONTROLLED',
];
const REFERENCES: readonly MethodReference[] = [
  'CASHBOX',
  'BANK_ACCOUNT',
  'CHEQUE',
  'POS',
  'GATEWAY',
  'TRACKING_NUMBER',
  'DUE_DATE',
  'PARTY',
  'EVIDENCE',
];
@Component({
  selector: 'vl-method-definitions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    TextControlComponent,
    SingleSelectControlComponent,
    MultiSelectControlComponent,
    BooleanControlComponent,
    VeloraIconComponent,
  ],
  templateUrl: './method-definitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodDefinitionsComponent implements OnInit {
  private readonly service = inject(MethodDefinitionService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _methods = signal<readonly MethodView[]>([]);
  private readonly _currencies = signal<
    readonly {
      readonly code: string;
      readonly name: string;
      readonly decimalPlaces: number;
    }[]
  >([]);
  private readonly _page = signal<PageInfo | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _isLoadingMore = signal(false);
  private readonly _isSaving = signal(false);
  private readonly _loadFailed = signal(false);
  private readonly _saveFailed = signal(false);

  readonly methods = computed(() => this._methods());
  readonly page = computed(() => this._page());
  readonly isLoading = computed(() => this._isLoading());
  readonly isLoadingMore = computed(() => this._isLoadingMore());
  readonly isSaving = computed(() => this._isSaving());
  readonly loadFailed = computed(() => this._loadFailed());
  readonly saveFailed = computed(() => this._saveFailed());
  readonly canCreate = computed(() =>
    this.auth.hasPermission('master-data.manage'),
  );
  readonly directionOptions = this.options(DIRECTIONS);
  readonly behaviorOptions = this.options(BEHAVIOR_CATEGORIES);
  readonly referenceOptions = this.options(REFERENCES);
  readonly currencyOptions = computed<readonly SharedSelectOption[]>(() =>
    this._currencies().map((currency) => ({
      value: currency.code,
      label: `${currency.code} — ${currency.name}`,
    })),
  );
  private readonly currencyDecimalPlaces = computed(
    () =>
      new Map(
        this._currencies().map((currency) => [
          currency.code,
          currency.decimalPlaces,
        ]),
      ),
  );

  form: FormGroup;

  get amountLimits(): FormArray {
    return this.form.get('amountLimits') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        code: [
          '',
          [Validators.required, Validators.minLength(1), Validators.maxLength(64)],
        ],
        name: [
          '',
          [Validators.required, Validators.minLength(1), Validators.maxLength(160)],
        ],
        direction: [null, Validators.required],
        behaviorCategory: [null, Validators.required],
        requiredReferences: [[]],
        createsFundsInTransit: [false],
        requiresApproval: [false],
        allowedCurrencies: [[], Validators.required],
        amountLimits: this.fb.array([]),
        debitMappingRef: ['', Validators.maxLength(128)],
        creditMappingRef: ['', Validators.maxLength(128)],
        feeMappingRef: ['', Validators.maxLength(128)],
        discrepancyMappingRef: ['', Validators.maxLength(128)],
        templateMappingRef: ['', Validators.maxLength(128)],
      },
      {
        validators: createMethodDefinitionCrossFieldValidator(
          () => this.currencyDecimalPlaces(),
        ),
      },
    );

    if (!this.canCreate()) {
      this.form.disable({ emitEvent: false });
    }
    this.loadInitial();
  }

  addAmountLimit(): void {
    this.amountLimits.push(
      this.fb.group({
        currency: [null, Validators.required],
        amount: [
          '',
          [Validators.required, positiveDecimalValidator],
        ],
      }),
    );
    this.form.updateValueAndValidity();
  }

  removeAmountLimit(index: number): void {
    this.amountLimits.removeAt(index);
    this.form.updateValueAndValidity();
  }

  isLimitCurrencyUnavailable(currency: string, rowIndex: number): boolean {
    return this.amountLimits.controls.some(
      (control, index) =>
        index !== rowIndex && control.get('currency')?.value === currency,
    );
  }

  submit(): void {
    this._saveFailed.set(false);
    if (!this.canCreate() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._isSaving.set(true);
    this.service
      .createMethod(this.buildRequest())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isSaving.set(false)),
        catchError(() => {
          this._saveFailed.set(true);
          return of(null);
        }),
      )
      .subscribe((created) => {
        if (!created) return;
        this._methods.update((methods) => [created, ...methods]);
        this.resetForm();
      });
  }

  loadMore(): void {
    const cursor = this._page()?.nextCursor;
    if (!cursor) return;

    this._isLoadingMore.set(true);
    this.service
      .listMethods(cursor)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoadingMore.set(false)),
        catchError(() => {
          this._loadFailed.set(true);
          return of(null);
        }),
      )
      .subscribe((page) => {
        if (!page) return;
        this._methods.update((methods) => [...methods, ...page.items]);
        this._page.set(page.page);
      });
  }

  private loadInitial(): void {
    this._isLoading.set(true);
    this._loadFailed.set(false);
    forkJoin({
      currencies: this.service.listCurrencies(),
      methods: this.service.listMethods(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
        catchError(() => {
          this._loadFailed.set(true);
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (!result) return;
        this._currencies.set(
          result.currencies.items
            .filter((currency) => currency.state === 'ACTIVE')
            .map((currency) => ({
              code: currency.code,
              name: currency.name,
              decimalPlaces: currency.decimalPlaces,
            })),
        );
        this.form.updateValueAndValidity();
        this._methods.set(result.methods.items);
        this._page.set(result.methods.page);
      });
  }

  private buildRequest(): MethodCreate {
    const value = this.form.getRawValue();
    const optionalMappings = Object.fromEntries(
      [
        'debitMappingRef',
        'creditMappingRef',
        'feeMappingRef',
        'discrepancyMappingRef',
        'templateMappingRef',
      ]
        .map((field) => [field, String(value[field] ?? '')])
        .filter(([, mapping]) => mapping !== ''),
    );

    return {
      code: String(value.code),
      name: String(value.name),
      direction: value.direction,
      behaviorCategory: value.behaviorCategory,
      requiredReferences: value.requiredReferences,
      createsFundsInTransit: Boolean(value.createsFundsInTransit),
      requiresApproval: Boolean(value.requiresApproval),
      allowedCurrencies: value.allowedCurrencies,
      ...(value.amountLimits.length
        ? {
            amountLimits: value.amountLimits.map(
              (limit: { currency: string; amount: string }) => ({
                currency: limit.currency,
                amount: String(limit.amount),
              }),
            ),
          }
        : {}),
      ...optionalMappings,
    } as MethodCreate;
  }

  private resetForm(): void {
    while (this.amountLimits.length) {
      this.amountLimits.removeAt(0);
    }
    this.form.reset({
      code: '',
      name: '',
      direction: null,
      behaviorCategory: null,
      requiredReferences: [],
      createsFundsInTransit: false,
      requiresApproval: false,
      allowedCurrencies: [],
      debitMappingRef: '',
      creditMappingRef: '',
      feeMappingRef: '',
      discrepancyMappingRef: '',
      templateMappingRef: '',
    });
  }

  private options<T extends string>(
    values: readonly T[],
  ): readonly SharedSelectOption<T>[] {
    return values.map((value) => ({ value, label: value }));
  }
}
