import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';

import { AUTH_SESSION } from '@core/auth';
import { ShellFacade } from '../../../shell.facade';
import { SidebarLogoComponent } from './sidebar-logo.component';

const createUser = (logoUrl?: string) => ({
  companyCode: 'AC01',
  fourCharsFinancialYear: '1403',
  logoUrl,
});

describe('SidebarLogoComponent auth session boundary', () => {
  let authUser: BehaviorSubject<ReturnType<typeof createUser> | undefined>;

  const createComponent = () =>
    TestBed.runInInjectionContext(() => new SidebarLogoComponent());

  beforeEach(() => {
    authUser = new BehaviorSubject<ReturnType<typeof createUser> | undefined>(
      undefined,
    );

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: AUTH_SESSION,
          useValue: {
            initializeAuth: () => Promise.resolve(undefined),
            invalidateSession: () => undefined,
            logout: () => undefined,
            getCurrentUserSnapshot: () => authUser.value,
            getCurrentUserChanges: () => authUser.asObservable(),
          },
        },
        {
          provide: ShellFacade,
          useValue: {
            currentLayoutType: signal('dark-sidebar'),
            setSidebarCollapsed: jasmine.createSpy('setSidebarCollapsed'),
          },
        },
      ],
    });
  });

  it('uses the current user logo from the core auth session', async () => {
    authUser.next(createUser(' assets/media/logos/company.svg '));
    const component = createComponent();

    component.ngOnInit();

    await expectAsync(firstValueFrom(component.logoUrl$)).toBeResolvedTo(
      'assets/media/logos/company.svg',
    );
  });

  it('falls back to the default logo when the auth session has no logo', async () => {
    const component = createComponent();

    component.ngOnInit();

    await expectAsync(firstValueFrom(component.logoUrl$)).toBeResolvedTo(
      'assets/media/logos/default-small.svg',
    );
  });
});
