import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeModeService } from '@core/services';
import { WINDOW } from '@core/tokens';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, of } from 'rxjs';

import { ErrorService } from '../../data-access';
import { Error404Component } from './error404.component';

class TranslateServiceStub {
  readonly onLangChange = EMPTY;
  readonly onDefaultLangChange = EMPTY;

  instant(key: string): string {
    return `instant:${key}`;
  }

  get(key: string) {
    return of(`translated:${key}`);
  }
}

describe('Error404Component route data', () => {
  let fixture: ComponentFixture<Error404Component>;
  let component: Error404Component;
  let title: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    title = jasmine.createSpyObj<Title>('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [Error404Component],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DOCUMENT, useValue: document },
        {
          provide: WINDOW,
          useValue: {
            history: {
              back: jasmine.createSpy('back'),
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              errorCode: 'CUSTOM_404',
              titleKey: 'workspace.errors.custom.title',
              descriptionKey: 'workspace.errors.custom.message',
              description: 'Custom missing page',
              showRetry: 'true',
              showHome: 'false',
              showBack: false,
            }),
            snapshot: {
              data: {
                errorCode: 'CUSTOM_404',
                titleKey: 'workspace.errors.custom.title',
                descriptionKey: 'workspace.errors.custom.message',
                description: 'Custom missing page',
                showRetry: 'true',
                showHome: 'false',
                showBack: false,
              },
            },
          },
        },
        {
          provide: ThemeModeService,
          useValue: {
            mode: new BehaviorSubject('light'),
          },
        },
        {
          provide: ErrorService,
          useValue: {
            retry: jasmine.createSpy('retry'),
          },
        },
        { provide: Title, useValue: title },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
    })
      .overrideComponent(Error404Component, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('builds error info from typed route data overrides', () => {
    expect(component.errorInfo()).toEqual(
      jasmine.objectContaining({
        code: 'CUSTOM_404',
        title: 'instant:workspace.errors.custom.title',
        message: 'instant:workspace.errors.custom.message',
        description: 'Custom missing page',
        showRetry: true,
        showHome: false,
        showBack: false,
      })
    );
  });

  it('sets translated document title from error route title keys', () => {
    expect(title.setTitle).toHaveBeenCalledWith(
      'translated:workspace.errors.custom.title'
    );
  });
});
