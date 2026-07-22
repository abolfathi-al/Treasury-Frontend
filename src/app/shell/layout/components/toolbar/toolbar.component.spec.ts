import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ILayout } from '@core/config/config';
import { LayoutService } from '@core/services/layout.service';
import { BehaviorSubject } from 'rxjs';

import { ToolbarComponent } from './toolbar.component';

const layoutConfig: ILayout = {
  app: {
    toolbar: {
      componentName: 'toolbar',
      display: true,
      layout: 'classic',
      container: 'fluid',
      fixed: {
        desktop: false,
        mobile: false,
      },
    },
    pageTitle: {
      componentName: 'page-title',
      display: true,
      direction: 'column',
      breadCrumb: true,
      description: true,
    },
  },
};

class LayoutServiceStub {
  readonly layoutConfigSubject = new BehaviorSubject<ILayout>(layoutConfig);

  getProp(path: string, config: ILayout = layoutConfig): unknown {
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

describe('ToolbarComponent performance', () => {
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LayoutService, useClass: LayoutServiceStub },
      ],
    })
      .overrideComponent(ToolbarComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    fixture.detectChanges();
  });

  it('exposes a stable page-title class map for template binding', () => {
    const component = fixture.componentInstance as unknown as {
      pageTitleLayoutClasses?: () => Record<string, boolean>;
    };

    const first = component.pageTitleLayoutClasses?.();
    const second = component.pageTitleLayoutClasses?.();

    expect(first).toEqual({
      'flex-column justify-content-center': true,
      'align-items-center': false,
    });
    expect(second).toBe(first);
  });
});
