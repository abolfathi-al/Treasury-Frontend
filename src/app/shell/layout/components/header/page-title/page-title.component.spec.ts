import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { PageInfoService, PageLink } from '@core/services/page-info.service';
import { PageTitleComponent } from './page-title.component';

class PageInfoServiceStub {
  readonly titleSubject = new BehaviorSubject<string>('Dashboard');
  readonly descriptionSubject = new BehaviorSubject<string>('Overview');
  readonly breadcrumbsSubject = new BehaviorSubject<PageLink[]>([]);
  readonly init = jasmine.createSpy('init');
}

describe('PageTitleComponent performance', () => {
  let fixture: ComponentFixture<PageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTitleComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PageInfoService, useClass: PageInfoServiceStub },
      ],
    })
      .overrideComponent(PageTitleComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PageTitleComponent);
    fixture.detectChanges();
  });

  it('exposes stable page-title class maps for template bindings', () => {
    const component = fixture.componentInstance as unknown as {
      titleClasses?: () => Record<string, boolean>;
      descriptionClasses?: () => Record<string, boolean>;
      breadcrumbListClasses?: () => Record<string, boolean>;
    };

    fixture.componentRef.setInput('appPageTitleDirection', 'column');
    fixture.detectChanges();

    const titleClasses = component.titleClasses?.();
    const titleClassesAgain = component.titleClasses?.();

    expect(titleClasses).toEqual({
      'flex-column justify-content-center': true,
      'align-items-center': false,
    });
    expect(titleClassesAgain).toBe(titleClasses);
    expect(component.descriptionClasses?.()).toEqual({ 'pt-2': true });
    expect(component.breadcrumbListClasses?.()).toEqual({ 'pt-1': true });

    fixture.componentRef.setInput('appPageTitleDirection', 'row');
    fixture.detectChanges();

    expect(component.descriptionClasses?.()).toEqual({ 'pt-2': false });
    expect(component.breadcrumbListClasses?.()).toEqual({ 'pt-1': false });
  });
});
