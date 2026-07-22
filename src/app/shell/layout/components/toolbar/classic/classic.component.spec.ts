import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ILayout } from '@core/config/config';
import { LayoutService } from '@core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { ClassicComponent } from './classic.component';

type ClassicToolbarLayoutConfig = ILayout & {
  appToolbarFixedDesktop?: boolean;
  appToolbarFilterButton?: boolean;
  appToolbarDaterangepickerButton?: boolean;
};

const layoutConfig: ClassicToolbarLayoutConfig = {
  appToolbarFixedDesktop: true,
  appToolbarFilterButton: true,
  appToolbarDaterangepickerButton: false,
  app: {
    toolbar: {
      componentName: 'toolbar',
      primaryButton: true,
      primaryButtonLabel: 'Create',
      primaryButtonModal: 'create-user',
    },
  },
};

class LayoutServiceStub {
  readonly layoutConfigSubject =
    new BehaviorSubject<ClassicToolbarLayoutConfig>(layoutConfig);

  getProp(path: string, config: ClassicToolbarLayoutConfig = layoutConfig): unknown {
    return path
      .split('.')
      .reduce<unknown>(
        (value, key) =>
          value && typeof value === 'object'
            ? (value as Record<string, unknown>)[key]
            : undefined,
        config,
      );
  }
}

class TranslateServiceStub {
  get(key: string) {
    return of(key);
  }
}

describe('ClassicComponent toolbar config', () => {
  let fixture: ComponentFixture<ClassicComponent>;
  let component: ClassicComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LayoutService, useClass: LayoutServiceStub },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
    })
      .overrideComponent(ClassicComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('builds toolbar config from layout config without widening layout state', () => {
    component.ngOnInit();

    expect(component.toolbarConfig()).toEqual({
      primaryButton: true,
      primaryButtonLabel: 'Create',
      primaryButtonModal: 'create-user',
      filterButton: true,
      daterangepickerButton: false,
      fixed: {
        desktop: true,
      },
    });
  });
});
