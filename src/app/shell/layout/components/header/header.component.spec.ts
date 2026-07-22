import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, Directive, Input, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ShellFacade } from '../../shell.facade';
import { HeaderComponent } from './header.component';

@Directive({
  selector: '[vlVeloraToggle]',
  standalone: true,
})
class ToggleDirectiveStub {
  @Input() toggleActivate = false;
  @Input() toggleTargetSelector = '';
  @Input() toggleState = '';
  @Input() toggleName = '';
}

@Directive({
  selector: '[vlVeloraDrawer]',
  standalone: true,
})
class DrawerDirectiveStub {
  @Input() drawerOverlay = false;
  @Input() drawerWidth = '';
  @Input() drawerDirection = '';
  @Input() drawerName = '';
  @Input() drawerActivate: unknown;
  @Input() drawerToggleSelector = '';
}

@Directive({
  selector: '[vlVeloraSwapper]',
  standalone: true,
})
class SwapperDirectiveStub {
  @Input() swapperActivate = false;
  @Input() swapperMode: unknown;
  @Input() swapperParents: unknown;
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
  selector: 'vl-header-menu',
  standalone: true,
  template: '',
})
class HeaderMenuStubComponent {}

@Component({
  selector: 'vl-page-title',
  standalone: true,
  template: '',
})
class PageTitleStubComponent {}

@Component({
  selector: 'vl-navbar',
  standalone: true,
  template: '',
})
class NavbarStubComponent {
  @Input() appHeaderDefaultSearchDisplay = false;
  @Input() appHeaderDefaultQuickPanelDisplay = false;
  @Input() appHeaderDefaultQuickActionsDisplay = false;
  @Input() appHeaderDefaultNotificationsDisplay = false;
  @Input() appHeaderDefaultChatDisplay = false;
  @Input() appHeaderDefaultThemModeDisplay = false;
  @Input() appHeaderDefaultUserDisplay = false;
  @Input() appHeaderDefaultMenuDisplay = false;
  @Input() isRtl = false;
}

function createShellStub(): ShellFacade {
  return {
    headerContainerCssClass: () => 'container-fluid',
    appSidebarDefaultCollapseDesktopEnabled: () => true,
    appSidebarDisplay: () => true,
    appHeaderDefaultContent: () => 'page-title',
    appHeaderDefaultMenuDisplay: () => false,
    appPageTitleDisplay: () => false,
    currentLayoutType: () => 'dark-sidebar',
    drawerActivateOnMobile: { default: true, lg: false },
    headerMenuDrawerDirection: 'end',
    headerMenuDrawerName: 'app-header-menu',
    headerMenuToggleSelector: '#velora_app_header_menu_toggle',
    headerMenuSwapperMode: { default: 'append', lg: 'prepend' },
    headerMenuSwapperParents: {
      default: '#velora_app_body',
      lg: '#velora_app_header_wrapper',
    },
    appHeaderDefaultSearchDisplay: () => false,
    appHeaderDefaultQuickPanelDisplay: () => false,
    appHeaderDefaultQuickActionsDisplay: () => false,
    appHeaderDefaultNotificationsDisplay: () => false,
    appHeaderDefaultChatDisplay: () => false,
    appHeaderDefaultThemModeDisplay: () => false,
    appHeaderDefaultUserDisplay: () => false,
    setSidebarCollapsed: jasmine.createSpy('setSidebarCollapsed'),
  } as unknown as ShellFacade;
}

describe('HeaderComponent accessibility', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ShellFacade, useFactory: createShellStub },
      ],
    })
      .overrideComponent(HeaderComponent, {
        set: {
          imports: [
            NgClass,
            NgOptimizedImage,
            TranslateModule,
            RouterLink,
            VeloraIconStubComponent,
            DrawerDirectiveStub,
            ToggleDirectiveStub,
            SwapperDirectiveStub,
            MenuDirectiveStub,
            HeaderMenuStubComponent,
            NavbarStubComponent,
            PageTitleStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('uses real buttons for sidebar toggle controls', () => {
    const host = fixture.nativeElement as HTMLElement;
    const collapseToggle = host.querySelector(
      '[data-testid="velora-sidebar-collapse-toggle"]',
    ) as HTMLButtonElement | null;
    const mobileToggle = host.querySelector(
      '#velora_app_sidebar_mobile_toggle',
    ) as HTMLButtonElement | null;

    expect(collapseToggle).not.toBeNull();
    expect(collapseToggle?.tagName).toBe('BUTTON');
    expect(collapseToggle?.type).toBe('button');
    expect(mobileToggle).not.toBeNull();
    expect(mobileToggle?.tagName).toBe('BUTTON');
    expect(mobileToggle?.type).toBe('button');
  });
});
