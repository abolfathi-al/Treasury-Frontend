import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { AUTH_SESSION } from '@core/auth';
import { LANGUAGE_SERVICE, LanguageServicePort } from '@core/i18n';
import { UserInnerComponent } from './user-inner.component';

const createUser = (name: string, year: string) => ({
  name,
  fullname: name,
  username: 'admin',
  email: 'admin@example.com',
  companyName: 'Acme',
  companyCode: 'AC01',
  fourCharsFinancialYear: year,
  pic: '',
  role: 'admin',
  isAdmin: true,
});

type TestUser = ReturnType<typeof createUser>;
type TestAuthSession = {
  initializeAuth: () => Promise<undefined>;
  invalidateSession: () => void;
  logout: jasmine.Spy;
  getCurrentUserSnapshot: () => TestUser | undefined;
  getCurrentUserChanges: () => Observable<TestUser | undefined>;
};

describe('UserInnerComponent auth session boundary', () => {
  let authUser: BehaviorSubject<TestUser | undefined>;
  let authSession: TestAuthSession;
  let languageService: LanguageServicePort;

  const createComponent = () =>
    TestBed.runInInjectionContext(() => new UserInnerComponent());

  beforeEach(() => {
    authUser = new BehaviorSubject<TestUser | undefined>(undefined);
    authSession = {
      initializeAuth: () => Promise.resolve(undefined),
      invalidateSession: () => undefined,
      logout: jasmine.createSpy('logout'),
      getCurrentUserSnapshot: () => authUser.value,
      getCurrentUserChanges: () => authUser.asObservable(),
    };
    languageService = {
      getSelectedLanguage: () => 'fa',
      getLanguageDirection: () => 'rtl',
      getLanguageDirectionChanges: () => of('rtl'),
      isLanguageRTL: () => true,
      setLanguage: jasmine.createSpy('setLanguage').and.returnValue(true),
      loadRuntimeTranslations: () => Promise.resolve(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AUTH_SESSION, useValue: authSession },
        { provide: LANGUAGE_SERVICE, useValue: languageService },
      ],
    });
  });

  it('resolves the displayed profile from core auth session changes', () => {
    const component = createComponent();

    authUser.next(createUser('Mina User', '1403'));

    expect(component.profile()).toEqual(
      jasmine.objectContaining({
        name: 'Mina User',
        email: 'admin@example.com',
        companyName: 'Acme',
        companyCode: 'AC01',
        avatarText: '1403',
      }),
    );
  });

  it('logs out through the core auth session', () => {
    const component = createComponent();

    component.logout();

    expect(authSession.logout).toHaveBeenCalled();
  });

  it('keeps language selection behind the language port', () => {
    const component = createComponent();

    component.ngOnInit();
    component.selectLanguage('en');

    expect(component.language()?.lang).toBe('en');
    expect(languageService.setLanguage).toHaveBeenCalledWith('en');
  });
});
