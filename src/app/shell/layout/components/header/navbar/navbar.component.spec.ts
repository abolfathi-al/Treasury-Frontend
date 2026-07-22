import { NgClass } from '@angular/common';
import {
  Component,
  Directive,
  Input,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { AuthFacade } from '@core/state/context';
import type { AuthFacadeState } from '@core/state/context';
import { AUTH_SESSION } from '@core/auth';
import { ShellContextDisplayFacade } from '../../../context/shell-context-display.facade';
import { NavbarComponent } from './navbar.component';

@Directive({
  selector: '[vlVeloraSearch]',
  exportAs: 'vlVeloraSearch',
  standalone: true,
})
class SearchDirectiveStub {
  @Input() searchActivate = false;
  @Input() searchKeypress = false;
  @Input() searchMinLength = 0;
  @Input() searchEnter = false;
  @Input() searchLayout = '';
}

@Directive({
  selector: '[vlVeloraMenu]',
  standalone: true,
})
class MenuDirectiveStub {}

@Component({
  selector: 'vl-velora-icon',
  standalone: true,
  template: '',
})
class VeloraIconStubComponent {
  @Input() name = '';
  @Input() class = '';
}

@Component({
  selector: 'vl-search-result-inner',
  standalone: true,
  template: '',
})
class SearchResultInnerStubComponent {
  @Input() searchDirective: unknown;
}

@Component({
  selector: 'vl-notifications-inner',
  standalone: true,
  template: '',
})
class NotificationsInnerStubComponent {}

@Component({
  selector: 'vl-quick-links-inner',
  standalone: true,
  template: '',
})
class QuickLinksInnerStubComponent {}

@Component({
  selector: 'vl-theme-mode-switcher',
  standalone: true,
  template: '',
})
class ThemeModeSwitcherStubComponent {
  @Input() toggleBtnClass = '';
}

@Component({
  selector: 'vl-user-inner',
  standalone: true,
  template: '',
})
class UserInnerStubComponent {}

const createUser = (name: string, year: string) =>
  ({
    id: 1,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: new Date('2026-01-01T00:00:00.000Z'),
    companyCode: 'AC01',
    fourCharsFinancialYear: year,
    twoCharsFiscalYear: year.slice(-2),
    username: 'admin',
    password: '',
    fullname: name,
    email: 'admin@example.com',
    pic: '',
    role: 'admin',
    roles: [],
    accessList: [],
    occupation: '',
    companyName: 'Acme',
    phone: '',
    name,
    firstname: name,
    lastname: 'User',
    website: '',
    logoUrl: '',
    language: 'en',
    timeZone: 'UTC',
    isAdmin: true,
    reservationServersInfo: [],
    fiscalYearParameters: {
      companyCode: 1,
      companyName: 'Acme',
      groupCodeLength: 1,
      generalCodeLength: 1,
      generalCodeFullLength: 1,
      subsidiaryCodeLength: 1,
      subsidiaryCodeFullLength: 1,
      detailCodeLength: 1,
      fiscalYear: year,
      fiscalYearStartDate: '',
      fiscalYearEndDate: '',
      dtFiscalYearStartDate: '',
      dtFiscalYearEndDate: '',
      logoUrl: '',
    },
  });

const createContextState = (): AuthFacadeState => ({
  status: 'authenticated',
  identity: {
    id: 'identity-1',
    displayName: 'Alex Morgan',
    status: 'ACTIVE',
  },
  organizationMemberships: [],
  actorMemberships: [],
  permissionHints: [],
  uiCapabilities: [],
  isDemoMode: false,
});

describe('NavbarComponent shell session display', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let authUser: BehaviorSubject<ReturnType<typeof createUser> | undefined>;
  let contextAuthState: ReturnType<typeof signal<AuthFacadeState>>;
  let workspaceSwitcherVisible: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    authUser = new BehaviorSubject<ReturnType<typeof createUser> | undefined>(
      undefined,
    );
    contextAuthState = signal(createContextState());
    workspaceSwitcherVisible = signal(false);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: AUTH_SESSION,
          useValue: {
            initializeAuth: () => Promise.resolve(undefined),
            getAuthToken: () => undefined,
            refreshAccessToken: () => of(undefined),
            logout: () => undefined,
            getCurrentUserSnapshot: () => authUser.value,
            getCurrentUserChanges: () => authUser.asObservable(),
          },
        },
        {
          provide: AuthFacade,
          useValue: {
            state: contextAuthState,
            isAuthenticated: signal(true),
          },
        },
        {
          provide: ShellContextDisplayFacade,
          useValue: {
            workspaceSwitcherVisible,
          },
        },
      ],
    })
      .overrideComponent(NavbarComponent, {
        set: {
          imports: [
            NgClass,
            TranslateModule,
            SearchDirectiveStub,
            MenuDirectiveStub,
            VeloraIconStubComponent,
            SearchResultInnerStubComponent,
            NotificationsInnerStubComponent,
            QuickLinksInnerStubComponent,
            ThemeModeSwitcherStubComponent,
            UserInnerStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
  });

  it('renders the context profile when user display is enabled and no legacy auth user exists', () => {
    fixture.componentRef.setInput('appHeaderDefaultUserDisplay', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.btn-outline')).toBeNull();
    expect(host.textContent).toContain('Alex Morgan');
    expect(host.textContent).toContain('AM');
  });

  it('renders and updates the current user from the existing auth subject', () => {
    authUser.next(createUser('Mina', '1403'));
    fixture.componentRef.setInput('appHeaderDefaultUserDisplay', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('Mina');
    expect(host.textContent).toContain('1403');

    authUser.next(createUser('Reza', '1404'));
    fixture.detectChanges();

    expect(host.textContent).toContain('Reza');
    expect(host.textContent).toContain('1404');
  });

  it('uses the shell context facade to decide workspace switcher visibility', () => {
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('#workspace_switcher_toggle')).toBeNull();

    workspaceSwitcherVisible.set(true);
    fixture.detectChanges();

    expect(host.querySelector('#workspace_switcher_toggle')).not.toBeNull();
  });
});
