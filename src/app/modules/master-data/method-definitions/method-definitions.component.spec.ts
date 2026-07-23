import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '@modules/auth/data-access/auth.service';
import { MethodDefinitionService } from './method-definition.service';
import { MethodDefinitionsComponent } from './method-definitions.component';

describe('MethodDefinitionsComponent', () => {
  let fixture: ComponentFixture<MethodDefinitionsComponent>;
  let component: MethodDefinitionsComponent;
  let service: jasmine.SpyObj<MethodDefinitionService>;

  beforeEach(async () => {
    service = jasmine.createSpyObj<MethodDefinitionService>(
      'MethodDefinitionService',
      ['listCurrencies', 'listMethods', 'createMethod'],
    );
    service.listCurrencies.and.returnValue(
      of({
        items: [
          {
            code: 'IRR',
            name: 'Iranian rial',
            decimalPlaces: 0,
            baseCurrency: true,
            state: 'ACTIVE',
            version: 0,
          },
          {
            code: 'USD',
            name: 'US dollar',
            decimalPlaces: 2,
            baseCurrency: false,
            state: 'ACTIVE',
            version: 0,
          },
        ],
        page: { limit: 500, hasMore: false },
      }),
    );
    service.listMethods.and.returnValue(
      of({ items: [], page: { limit: 50, hasMore: false } }),
    );

    await TestBed.configureTestingModule({
      imports: [MethodDefinitionsComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MethodDefinitionService, useValue: service },
        {
          provide: AuthService,
          useValue: { hasPermission: () => true },
        },
      ],
    })
      .overrideComponent(MethodDefinitionsComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MethodDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('preserves entered Canon string values without transport trimming', () => {
    component.form.patchValue({
      code: ' WIRE ',
      name: ' Wire transfer ',
      direction: 'BOTH',
      behaviorCategory: 'BANK_TRANSFER',
      requiredReferences: ['BANK_ACCOUNT', 'TRACKING_NUMBER'],
      createsFundsInTransit: true,
      requiresApproval: true,
      allowedCurrencies: ['IRR'],
      debitMappingRef: ' debit-map ',
    });
    service.createMethod.and.returnValue(
      of({
        code: ' WIRE ',
        name: ' Wire transfer ',
        direction: 'BOTH',
        behaviorCategory: 'BANK_TRANSFER',
        requiredReferences: ['BANK_ACCOUNT', 'TRACKING_NUMBER'],
        createsFundsInTransit: true,
        requiresApproval: true,
        allowedCurrencies: ['IRR'],
        debitMappingRef: ' debit-map ',
        id: 'method-1',
        state: 'ACTIVE',
        version: 0,
      }),
    );

    component.submit();

    expect(service.createMethod).toHaveBeenCalledWith(
      jasmine.objectContaining({
        code: ' WIRE ',
        name: ' Wire transfer ',
        debitMappingRef: ' debit-map ',
      }),
    );
  });

  it('retains currency decimalPlaces and rejects an over-scale amount', () => {
    component.form.patchValue({
      direction: 'BOTH',
      behaviorCategory: 'BANK_TRANSFER',
      requiredReferences: ['BANK_ACCOUNT', 'TRACKING_NUMBER'],
      allowedCurrencies: ['IRR'],
    });
    component.addAmountLimit();
    component.amountLimits.at(0).setValue({
      currency: 'IRR',
      amount: '1000.1',
    });

    expect(component.form.hasError('amountScaleExceeded')).toBeTrue();

    component.amountLimits.at(0).setValue({
      currency: 'USD',
      amount: '1000.12',
    });
    component.form.patchValue({ allowedCurrencies: ['USD'] });
    expect(component.form.hasError('amountScaleExceeded')).toBeFalse();
  });
});
