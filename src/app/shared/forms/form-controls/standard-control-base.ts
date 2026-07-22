import {
  ChangeDetectorRef,
  computed,
  Directive,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { InputmaskOptions, TagifyTag } from '@shared/directives';
import { SharedSelectOption } from './standard-control.types';

@Directive()
export abstract class StandardFormControl<T = unknown>
  implements OnInit, OnDestroy
{
  protected readonly route = inject(ActivatedRoute, { optional: true });
  protected readonly rootFormGroup = inject(FormGroupDirective, { optional: true });
  protected readonly cdr = inject(ChangeDetectorRef);

  readonly required = input(true);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly queryParamKey = input<string>();
  readonly validators = input<ValidatorFn | ValidatorFn[] | null>(null);
  readonly asyncValidators = input<AsyncValidatorFn | AsyncValidatorFn[] | null>(null);

  protected readonly _form = signal<FormGroup | null>(null);
  protected abstract readonly controlName: string;
  protected abstract readonly defaultValidators: ValidatorFn[];
  private readonly _value = signal<T | null>(null);
  private readonly _stateRevision = signal(0);
  private readonly runtimeValidators = signal<ValidatorFn[]>([]);
  private readonly runtimeAsyncValidators = signal<AsyncValidatorFn[]>([]);
  private readonly validatorsCleared = signal(false);
  private controlSubscription?: Subscription;
  private inheritedValidator: ValidatorFn | null = null;
  private inheritedAsyncValidator: AsyncValidatorFn | null = null;
  private inheritedDisabled = false;
  private ownsControl = false;

  protected get form(): FormGroup {
    const form = this._form();
    if (!form) {
      throw new Error('StandardFormControl: form is not available before initialization.');
    }

    return form;
  }

  readonly control = computed<AbstractControl | null>(
    () => this._form()?.get(this.controlName) ?? null
  );

  readonly value = computed<T | null>(() => this._value());
  readonly state = computed(() => {
    this._stateRevision();
    const ctrl = this.control();

    return {
      valid: ctrl?.valid ?? false,
      invalid: ctrl?.invalid ?? false,
      dirty: ctrl?.dirty ?? false,
      touched: ctrl?.touched ?? false,
      pristine: ctrl?.pristine ?? true,
      untouched: ctrl?.untouched ?? true,
      pending: ctrl?.pending ?? false,
      disabled: ctrl?.disabled ?? false,
      enabled: ctrl?.enabled ?? false,
      readonly: this.readonly(),
      errors: ctrl?.errors ?? null,
    };
  });
  readonly isValid = computed(() => this.state().valid);
  readonly isInvalid = computed(() => this.state().invalid);
  readonly isDirty = computed(() => this.state().dirty);
  readonly isTouched = computed(() => this.state().touched);
  readonly isPristine = computed(() => this.state().pristine);
  readonly isUntouched = computed(() => this.state().untouched);
  readonly isPending = computed(() => this.state().pending);
  readonly isDisabled = computed(() => this.state().disabled);
  readonly errors = computed(() => this.state().errors);
  readonly showErrors = computed(
    () => this.isInvalid() && (this.isDirty() || this.isTouched())
  );

  constructor() {
    effect(() => {
      const ctrl = this.control();
      if (!ctrl) return;
      this.shouldDisableResolved()
        ? ctrl.disable({ emitEvent: false })
        : ctrl.enable({ emitEvent: false });
      this.bumpState();
    });

    effect(() => {
      const ctrl = this.control();
      if (!ctrl) return;
      this.applyValidators(ctrl);
    });
  }

  ngOnInit(): void {
    if (!this.rootFormGroup?.control) {
      console.warn('StandardFormControl: No FormGroupDirective found. Ensure the component is used within a form with [formGroup].');
      return;
    }

    const parent = this.rootFormGroup.control.parent;
    const form =
      parent instanceof FormGroup ? parent : this.rootFormGroup.control;

    const existingControl = form.get(this.controlName);
    this.ownsControl = existingControl === null;
    this.inheritedDisabled = !this.ownsControl && existingControl?.disabled === true;

    if (this.ownsControl) {
      const queryValue = this.route?.snapshot?.queryParamMap?.get(
        this.queryParamKey() ?? this.controlName
      );
      const initialValue = queryValue !== null && queryValue !== undefined
        ? this.parseQueryParam(queryValue)
        : this.getInitialValue();

      form.addControl(
        this.controlName,
        new FormControl<T | null>(
          { value: initialValue, disabled: this.disabled() },
          this.buildValidators()
        )
      );
    }

    this._form.set(form);

    const ctrl = form.get(this.controlName);
    if (ctrl) {
      this.inheritedValidator = this.ownsControl ? null : ctrl.validator;
      this.inheritedAsyncValidator = this.ownsControl ? null : ctrl.asyncValidator;
      this.applyValidators(ctrl);
      this._value.set(this.normalizeValue(ctrl.value));
      this.controlSubscription = new Subscription();
      this.controlSubscription.add(
        ctrl.valueChanges.subscribe((value) => {
          this._value.set(this.normalizeValue(value));
          this.bumpState();
          this.cdr.markForCheck();
        })
      );
      this.controlSubscription.add(
        ctrl.statusChanges.subscribe(() => {
          this.bumpState();
          this.cdr.markForCheck();
        })
      );
      this.bumpState();
    }

    this.onInit();
  }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();

    const form = this._form();
    if (this.ownsControl && form?.contains(this.controlName)) {
      form.removeControl(this.controlName);
      form.updateValueAndValidity();
    }
  }

  protected onInit(): void {}

  protected getInitialValue(): T | null {
    return null;
  }

  protected parseQueryParam(value: string): T | null {
    return value as unknown as T;
  }

  protected normalizeValue(value: unknown): T | null {
    return value as T | null;
  }

  protected getPolicyValidators(): ValidatorFn[] {
    return [];
  }

  protected getPolicyAsyncValidators(): AsyncValidatorFn[] {
    return [];
  }

  protected shouldDisableControl(): boolean {
    return this.disabled();
  }

  private shouldDisableResolved(): boolean {
    if (this.shouldDisableControl()) {
      return true;
    }

    return !this.ownsControl && this.inheritedDisabled;
  }

  protected buildValidators(extraValidators: ValidatorFn[] = []): ValidatorFn[] {
    if (this.validatorsCleared()) return [];

    return [
      ...(this.inheritedValidator ? [this.inheritedValidator] : []),
      ...this.defaultValidators,
      ...this.getPolicyValidators(),
      ...this.toArray(this.validators()),
      ...this.runtimeValidators(),
      ...extraValidators,
      ...(this.required() ? [Validators.required] : []),
    ];
  }

  protected buildAsyncValidators(extraValidators: AsyncValidatorFn[] = []): AsyncValidatorFn[] {
    if (this.validatorsCleared()) return [];

    return [
      ...(this.inheritedAsyncValidator ? [this.inheritedAsyncValidator] : []),
      ...this.getPolicyAsyncValidators(),
      ...this.toArray(this.asyncValidators()),
      ...this.runtimeAsyncValidators(),
      ...extraValidators,
    ];
  }

  protected bumpState(): void {
    this._stateRevision.update((value) => value + 1);
  }

  private applyValidators(ctrl: AbstractControl): void {
    ctrl.setValidators(this.buildValidators());
    ctrl.setAsyncValidators(this.buildAsyncValidators());
    ctrl.updateValueAndValidity({ emitEvent: false });
    this.bumpState();
    this.cdr.markForCheck();
  }

  private toArray<TItem>(value: TItem | readonly TItem[] | null | undefined): TItem[] {
    if (!value) return [];
    return Array.isArray(value) ? [...value] : [value as TItem];
  }

  setValue(value: T, emitEvent = true): void {
    this.control()?.setValue(value, { emitEvent });
    if (!emitEvent) {
      this._value.set(this.normalizeValue(value));
      this.bumpState();
    }
  }

  patchValue(value: Partial<T>, emitEvent = true): void {
    this.control()?.patchValue(value, { emitEvent });
    if (!emitEvent) {
      this._value.set(this.normalizeValue(this.control()?.value));
      this.bumpState();
    }
  }

  reset(value?: T): void {
    this.control()?.reset(value);
    this._value.set(this.normalizeValue(this.control()?.value));
    this.bumpState();
  }

  markAsTouched(): void {
    this.control()?.markAsTouched();
    this.bumpState();
    this.cdr.markForCheck();
  }

  markAsDirty(): void {
    this.control()?.markAsDirty();
    this.bumpState();
    this.cdr.markForCheck();
  }

  markAsPristine(): void {
    this.control()?.markAsPristine();
    this.bumpState();
    this.cdr.markForCheck();
  }

  markAsUntouched(): void {
    this.control()?.markAsUntouched();
    this.bumpState();
    this.cdr.markForCheck();
  }

  setValidators(validators: ValidatorFn[]): void {
    this.validatorsCleared.set(false);
    this.runtimeValidators.set(validators);
    const ctrl = this.control();
    if (ctrl) this.applyValidators(ctrl);
  }

  setAsyncValidators(validators: AsyncValidatorFn[]): void {
    this.validatorsCleared.set(false);
    this.runtimeAsyncValidators.set(validators);
    const ctrl = this.control();
    if (ctrl) this.applyValidators(ctrl);
  }

  clearValidators(): void {
    this.validatorsCleared.set(true);
    this.runtimeValidators.set([]);
    this.runtimeAsyncValidators.set([]);
    const ctrl = this.control();
    if (!ctrl) return;
    ctrl.clearValidators();
    ctrl.clearAsyncValidators();
    ctrl.updateValueAndValidity();
    this.bumpState();
  }

  hasError(code: string): boolean {
    return this.control()?.hasError(code) ?? false;
  }

  getError<E = unknown>(code: string): E | null {
    return this.control()?.getError(code) ?? null;
  }

  onBlur(): void {
    this.cdr.markForCheck();
  }
}

@Directive()
export abstract class NamedFormControl<T = unknown> extends StandardFormControl<T> {
  readonly fieldName = input.required<string>({ alias: 'controlName' });
  readonly label = input('');
  readonly placeholder = input('');
  readonly helpText = input('');

  public override get controlName(): string {
    return this.fieldName();
  }

  protected override readonly defaultValidators: ValidatorFn[] = [];
}

@Directive()
export abstract class TextualFormControl extends NamedFormControl<string> {
  readonly maxLength = input<number | null>(null);
  readonly minLength = input<number | null>(null);
  readonly showCounter = input(false);
  readonly trimOnBlur = input(true);
  readonly autocomplete = input('off');
  readonly maskOptions = input<InputmaskOptions | null>(null);

  readonly textInputmaskOptions = computed<InputmaskOptions | undefined>(() => {
    const maskOptions = this.maskOptions();
    if (!maskOptions) return undefined;

    return {
      ...maskOptions,
      disabled: this.disabled(),
      readonly: this.readonly(),
    };
  });

  protected override getPolicyValidators(): ValidatorFn[] {
    return [
      ...(this.minLength() !== null ? [Validators.minLength(this.minLength()!)] : []),
      ...(this.maxLength() !== null ? [Validators.maxLength(this.maxLength()!)] : []),
    ];
  }

  protected override getInitialValue(): string {
    return '';
  }

  override onBlur(): void {
    if (this.trimOnBlur()) {
      const value = this.value();
      if (typeof value === 'string') {
        this.control()?.setValue(value.trim(), { emitEvent: true });
      }
    }
    super.onBlur();
  }
}

@Directive()
export abstract class NumericFormControl extends NamedFormControl<number> {
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input(1);
  readonly decimals = input(0);
  readonly prefix = input('');
  readonly suffix = input('');

  numericInputmaskOptions(alias: InputmaskOptions['alias'] = 'numeric'): InputmaskOptions {
    return {
      alias,
      rightAlign: false,
      autoUnmask: true,
      unmaskAsNumber: true,
      min: this.min() ?? undefined,
      max: this.max() ?? undefined,
      digits: this.decimals(),
      prefix: this.prefix(),
      suffix: this.suffix(),
      disabled: this.disabled(),
      readonly: this.readonly(),
    };
  }

  protected override getPolicyValidators(): ValidatorFn[] {
    return [
      ...(this.min() !== null ? [Validators.min(this.min()!)] : []),
      ...(this.max() !== null ? [Validators.max(this.max()!)] : []),
    ];
  }

  protected override getInitialValue(): number | null {
    return null;
  }

  protected override parseQueryParam(value: string): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  protected override normalizeValue(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}

@Directive()
export abstract class DateLikeControl extends NamedFormControl<string> {
  readonly dateFormat = input('Y-m-d');
  readonly enableTime = input(false);

  protected override getInitialValue(): string {
    return '';
  }
}

@Directive()
export abstract class SelectFormControl<
  TValue = string,
  TControlValue = TValue,
> extends NamedFormControl<TControlValue> {
  readonly options = input<readonly SharedSelectOption<TValue>[]>([]);
  readonly bindLabel = input('label');
  readonly bindValue = input('value');
  readonly clearable = input(true);
  readonly searchable = input(true);
  readonly loading = input(false);
  readonly emptyText = input('common.noResults');
  readonly valueChange = output<TControlValue | null>();

  optionsArray(): SharedSelectOption<TValue>[] {
    return [...this.options()];
  }

  emitValue(value: TControlValue | null): void {
    this.valueChange.emit(value);
  }

  currentValue(fallback: TControlValue | null = null): TControlValue | null {
    const value = this.control()?.value;
    return value === null || value === undefined
      ? fallback
      : (value as TControlValue);
  }

  emitCurrentValue(fallback: TControlValue | null = null): void {
    this.emitValue(this.currentValue(fallback));
  }
}

@Directive()
export abstract class PasswordFormControl extends TextualFormControl {
  readonly minPasswordLength = input(8);
  readonly minScore = input(60);
  readonly score = signal(0);

  protected override getPolicyValidators(): ValidatorFn[] {
    return [
      ...super.getPolicyValidators(),
      Validators.minLength(this.minPasswordLength()),
      (control) => {
        const value = String(control.value ?? '');
        if (!value) return null;
        return this.calculatePasswordScore(value) >= this.minScore()
          ? null
          : { PasswordMeter: { minScore: this.minScore() } };
      },
    ];
  }

  onPasswordScoreChange(score: number): void {
    this.score.set(score);
    this.control()?.updateValueAndValidity({ emitEvent: false });
    this.bumpState();
  }

  private calculatePasswordScore(password: string): number {
    const checks = [
      password.length >= this.minPasswordLength(),
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  }
}

@Directive()
export abstract class TagsFormControl extends NamedFormControl<string> {
  readonly whitelist = input<readonly string[] | readonly TagifyTag[]>([]);
  readonly maxTags = input<number | null>(null);
  readonly enforceWhitelist = input(false);
  readonly duplicates = input(false);
  readonly trimTags = input(true);
  readonly tagPlaceholder = input('');
  readonly dropdownEnabled = input(1);
  readonly tagValueChange = output<string>();

  protected override getInitialValue(): string {
    return '';
  }

  protected override getPolicyValidators(): ValidatorFn[] {
    return this.maxTags() === null ? [] : [this.maxTagsValidator(this.maxTags()!)];
  }

  readonly tagifyWhitelist = computed<string[] | TagifyTag[]>(
    () => [...this.whitelist()] as string[] | TagifyTag[]
  );
  readonly tagifyMaxTags = computed(() => this.maxTags() ?? undefined);

  emitTagValue(value: string): void {
    this.tagValueChange.emit(value);
  }

  currentTagValue(): string {
    const value = this.control()?.value;
    return typeof value === 'string' ? value : String(value ?? '');
  }

  emitCurrentTagValue(): void {
    this.emitTagValue(this.currentTagValue());
  }

  private maxTagsValidator(maxTags: number): ValidatorFn {
    return (control) => {
      const tags = String(control.value ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      return tags.length <= maxTags ? null : { max: { max: maxTags, actual: tags.length } };
    };
  }
}
