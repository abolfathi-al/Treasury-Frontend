import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';

import { AuthComponent } from './auth.component';

class TranslateServiceStub {
  get(key: string) {
    return of(`translated:${key}`);
  }
}

describe('AuthComponent route data', () => {
  let fixture: ComponentFixture<AuthComponent>;
  let component: AuthComponent;
  let title: jasmine.SpyObj<Title>;
  let routerEvents: Subject<NavigationEnd>;

  beforeEach(async () => {
    title = jasmine.createSpyObj<Title>('Title', ['setTitle']);
    routerEvents = new Subject<NavigationEnd>();

    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DOCUMENT, useValue: document },
        {
          provide: Router,
          useValue: {
            url: '/auth/login',
            events: routerEvents.asObservable(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            firstChild: {
              data: of({
                title: 'Login',
                titleKey: 'workspace.auth.login.title',
                description: 'Access your account',
                breadcrumb: 'Auth',
                keywords: 'auth,login',
              }),
              snapshot: {
                data: {
                  title: 'Login',
                  titleKey: 'workspace.auth.login.title',
                  description: 'Access your account',
                  breadcrumb: 'Auth',
                  keywords: 'auth,login',
                },
              },
            },
          },
        },
        { provide: Title, useValue: title },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
    })
      .overrideComponent(AuthComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('reads shell copy and metadata from typed child route data', () => {
    expect(component.pageTitle()).toBe('Login');
    expect(component.pageDescription()).toBe('Access your account');
    expect(component.breadcrumb()).toBe('Auth');
    expect(component.keywords()).toBe('auth,login');
  });

  it('sets translated document title for workspace auth route title keys', () => {
    expect(title.setTitle).toHaveBeenCalledWith(
      'translated:workspace.auth.login.title'
    );
  });
});
