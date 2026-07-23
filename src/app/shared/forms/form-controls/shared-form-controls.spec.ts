import { Component, signal } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  DialerDirective,
  InputmaskDirective,
  MaxlengthDirective,
  PasswordMeterDirective,
  SingleOptionDirective,
  TagifyDirective,
} from '@shared/directives';
import {
  AsyncSelectControlComponent,
  BooleanControlComponent,
  CurrencyControlComponent,
  DateControlComponent,
  DateTimeControlComponent,
  DialerControlComponent,
  MembershipSelectorControlComponent,
  MultiSelectControlComponent,
  NumberControlComponent,
  OrganizationSelectorControlComponent,
  PercentControlComponent,
  PasswordControlComponent,
  ScopeSelectorControlComponent,
  SingleSelectControlComponent,
  TagsControlComponent,
  TenantSelectorControlComponent,
  TextControlComponent,
  TextareaControlComponent,
  type SharedSelectOption,
} from './index';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextControlComponent,
    TextareaControlComponent,
    NumberControlComponent,
    CurrencyControlComponent,
    PercentControlComponent,
    PasswordControlComponent,
    TagsControlComponent,
    DialerControlComponent,
    DateControlComponent,
    DateTimeControlComponent,
    BooleanControlComponent,
    SingleSelectControlComponent,
    MultiSelectControlComponent,
    AsyncSelectControlComponent,
    TenantSelectorControlComponent,
    OrganizationSelectorControlComponent,
    MembershipSelectorControlComponent,
    ScopeSelectorControlComponent,
  ],
  template: `
    <form [formGroup]="form">
      <vl-text-control controlName="text" label="Text"></vl-text-control>
      <vl-textarea-control controlName="textarea" label="Textarea"></vl-textarea-control>
      <vl-number-control controlName="number" label="Number"></vl-number-control>
      <vl-currency-control controlName="currency" label="Currency"></vl-currency-control>
      <vl-percent-control controlName="percent" label="Percent"></vl-percent-control>
      <vl-password-control controlName="password" label="Password"></vl-password-control>
      <vl-tags-control controlName="tags" label="Tags" [whitelist]="tagWhitelist"></vl-tags-control>
      <vl-dialer-control controlName="dialer" label="Dialer"></vl-dialer-control>
      <vl-date-control controlName="date" label="Date"></vl-date-control>
      <vl-datetime-control controlName="datetime" label="Datetime"></vl-datetime-control>
      <vl-boolean-control controlName="boolean" label="Boolean"></vl-boolean-control>
      <vl-single-select-control controlName="single" label="Single" [options]="options"></vl-single-select-control>
      <vl-multi-select-control controlName="multi" label="Multi" [options]="options"></vl-multi-select-control>
      <vl-async-select-control controlName="async" label="Async" [options]="options"></vl-async-select-control>
      <vl-tenant-selector-control controlName="tenant" label="Tenant" [options]="options"></vl-tenant-selector-control>
      <vl-organization-selector-control controlName="organization" label="Organization" [options]="options"></vl-organization-selector-control>
      <vl-membership-selector-control controlName="membership" label="Membership" [options]="options"></vl-membership-selector-control>
      <vl-scope-selector-control controlName="scope" label="Scope" [options]="scopeOptions"></vl-scope-selector-control>
    </form>
  `,
})
class SharedFormControlsHostComponent {
  readonly form = new UntypedFormGroup({});
  readonly options: readonly SharedSelectOption[] = [
    { label: 'One', value: 'one' },
    { label: 'Two', value: 'two' },
  ];
  readonly tagWhitelist = ['ops', 'support', 'finance'];
  readonly scopeOptions: readonly SharedSelectOption[] = [
    { label: 'tenantId', value: 'tenantId' },
    { label: 'organizationId', value: 'organizationId' },
  ];
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextControlComponent],
  template: `
    <form [formGroup]="form">
      <vl-text-control controlName="text" label="Text" [required]="required" [readonly]="readonly"></vl-text-control>
    </form>
  `,
})
class ExistingControlHostComponent {
  readonly form = new UntypedFormGroup({
    text: new FormControl('existing value'),
  });
  required = true;
  readonly = false;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextControlComponent],
  template: `
    <form [formGroup]="form">
      <vl-text-control controlName="text" label="Text"></vl-text-control>
    </form>
  `,
})
class DisabledExistingControlHostComponent {
  readonly form = new UntypedFormGroup({
    text: new FormControl({ value: 'locked value', disabled: true }),
  });
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextControlComponent],
  template: `
    <form [formGroup]="form">
      <vl-text-control
        controlName="text"
        label="Text"
        [required]="required()"
        [maxLength]="10"
        [showCounter]="true"
      ></vl-text-control>
    </form>
  `,
})
class DynamicControlHostComponent {
  readonly form = new UntypedFormGroup({});
  readonly required = signal(false);
}

describe('shared form controls', () => {
  let fixture: ComponentFixture<SharedFormControlsHostComponent>;
  let host: SharedFormControlsHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormControlsHostComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormControlsHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('registers all required shared controls with the parent FormGroup', () => {
    [
      'text',
      'textarea',
      'number',
      'currency',
      'percent',
      'password',
      'tags',
      'dialer',
      'date',
      'datetime',
      'boolean',
      'single',
      'multi',
      'async',
      'tenant',
      'organization',
      'membership',
      'scope',
    ].forEach((controlName) => {
      expect(host.form.contains(controlName)).withContext(controlName).toBeTrue();
    });
  });

  it('uses ng-select for every select-like control and no native select', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('select').length).toBe(0);
    expect(element.querySelectorAll('ng-select').length).toBe(7);
  });

  it('renders shared invalid-feedback for every control', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('vl-invalid-feedback').length).toBe(18);
  });

  it('wraps all form directives behind reusable standard controls', () => {
    expect(fixture.debugElement.queryAll(By.directive(InputmaskDirective)).length).toBeGreaterThanOrEqual(4);
    expect(fixture.debugElement.queryAll(By.directive(MaxlengthDirective)).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.directive(PasswordMeterDirective)).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.directive(TagifyDirective)).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.directive(DialerDirective)).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.directive(SingleOptionDirective)).length).toBe(2);
  });

  it('propagates values through reactive forms', () => {
    host.form.get('text')?.setValue('Velora');
    host.form.get('single')?.setValue('one');
    host.form.get('multi')?.setValue(['one', 'two']);
    host.form.get('boolean')?.setValue(true);
    host.form.get('tags')?.setValue('ops,support');
    host.form.get('dialer')?.setValue(3);

    expect(host.form.get('text')?.value).toBe('Velora');
    expect(host.form.get('single')?.value).toBe('one');
    expect(host.form.get('multi')?.value).toEqual(['one', 'two']);
    expect(host.form.get('boolean')?.value).toBeTrue();
    expect(host.form.get('tags')?.value).toBe('ops,support');
    expect(host.form.get('dialer')?.value).toBe(3);
  });

  it('exposes typed helper methods for template value emissions', () => {
    const singleControl = fixture.debugElement.query(
      By.directive(SingleSelectControlComponent),
    ).componentInstance as SingleSelectControlComponent;
    const multiControl = fixture.debugElement.query(
      By.directive(MultiSelectControlComponent),
    ).componentInstance as MultiSelectControlComponent;
    const tagsControl = fixture.debugElement.query(
      By.directive(TagsControlComponent),
    ).componentInstance as TagsControlComponent;
    const asyncControl = fixture.debugElement.query(
      By.directive(AsyncSelectControlComponent),
    ).componentInstance as AsyncSelectControlComponent;
    const selectValues: unknown[] = [];
    const tagValues: string[] = [];
    const searchTerms: string[] = [];

    singleControl.valueChange.subscribe((value) => selectValues.push(value));
    multiControl.valueChange.subscribe((value) => selectValues.push(value));
    tagsControl.tagValueChange.subscribe((value) => tagValues.push(value));
    asyncControl.searchChange.subscribe((value) => searchTerms.push(value));

    host.form.get('single')?.setValue('one');
    host.form.get('multi')?.setValue(['one', 'two']);
    host.form.get('tags')?.setValue('ops,support');

    singleControl.emitCurrentValue();
    multiControl.emitCurrentValue([]);
    tagsControl.emitCurrentTagValue();
    asyncControl.emitSearchTerm({ term: 'velora' });
    asyncControl.emitSearchTerm('raw');

    expect(selectValues).toEqual(['one', ['one', 'two']]);
    expect(tagValues).toEqual(['ops,support']);
    expect(searchTerms).toEqual(['velora', 'raw']);
  });

  it('does not remove caller-owned controls when the shared control is destroyed', () => {
    const existingFixture = TestBed.createComponent(ExistingControlHostComponent);
    const existingHost = existingFixture.componentInstance;

    existingFixture.detectChanges();
    expect(existingHost.form.contains('text')).toBeTrue();

    existingFixture.destroy();

    expect(existingHost.form.contains('text')).toBeTrue();
    expect(existingHost.form.get('text')?.value).toBe('existing value');
  });

  it('preserves caller-owned disabled controls during initialization', () => {
    const existingFixture = TestBed.createComponent(
      DisabledExistingControlHostComponent,
    );
    const control = existingFixture.componentInstance.form.get('text');

    expect(control?.disabled).toBeTrue();

    existingFixture.detectChanges();

    expect(control?.disabled).toBeTrue();
    expect(control?.value).toBe('locked value');
  });

  it('keeps standard control value signals in sync with reactive form changes', () => {
    const existingFixture = TestBed.createComponent(ExistingControlHostComponent);
    existingFixture.detectChanges();

    const controlComponent = existingFixture.debugElement.query(By.directive(TextControlComponent)).componentInstance as TextControlComponent;
    expect(controlComponent.value()).toBe('existing value');

    existingFixture.componentInstance.form.get('text')?.setValue('updated value');
    existingFixture.detectChanges();

    expect(controlComponent.value()).toBe('updated value');
  });

  it('keeps plain text input synchronized with its reactive control after blur', () => {
    const existingFixture = TestBed.createComponent(ExistingControlHostComponent);
    existingFixture.detectChanges();
    const input = existingFixture.nativeElement.querySelector(
      '#text',
    ) as HTMLInputElement;

    input.value = 'user entered value';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    existingFixture.detectChanges();

    expect(existingFixture.componentInstance.form.get('text')?.value).toBe(
      'user entered value',
    );
    expect(input.value).toBe('user entered value');
  });

  it('rebuilds validators when shared control policy inputs change', () => {
    const dynamicFixture = TestBed.createComponent(DynamicControlHostComponent);
    dynamicFixture.detectChanges();
    const control = dynamicFixture.componentInstance.form.get('text');

    expect(control?.valid).toBeTrue();

    dynamicFixture.componentInstance.required.set(true);
    dynamicFixture.detectChanges();

    expect(control?.hasError('required')).toBeTrue();
  });

  it('preserves explicit clearValidators semantics on the standard control kernel', () => {
    const dynamicFixture = TestBed.createComponent(DynamicControlHostComponent);
    dynamicFixture.componentInstance.required.set(true);
    dynamicFixture.detectChanges();

    const control = dynamicFixture.componentInstance.form.get('text');
    const controlComponent = dynamicFixture.debugElement.query(By.directive(TextControlComponent)).componentInstance as TextControlComponent;
    expect(control?.hasError('required')).toBeTrue();

    controlComponent.clearValidators();

    expect(control?.valid).toBeTrue();
  });

  it('does not attach maxlength display to text inputs', () => {
    const dynamicFixture = TestBed.createComponent(DynamicControlHostComponent);
    dynamicFixture.detectChanges();

    expect(dynamicFixture.debugElement.queryAll(By.directive(MaxlengthDirective)).length).toBe(0);
  });
});
