import { Component, Directive, Input, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';

import { ShellNavigationFacade } from '@shell/layout/navigation/shell-navigation.facade';
import { SidebarMenuComponent } from './sidebar-menu.component';

@Directive({
  selector: '[vlVeloraScroll]',
  standalone: true,
})
class ScrollDirectiveStub {
  @Input() scrollActivate = false;
  @Input() scrollHeight = '';
  @Input() scrollDependencies: unknown;
  @Input() scrollWrappers: unknown;
  @Input() scrollOffset = '';
  @Input() scrollSaveState = false;
}

@Directive({
  selector: '[vlVeloraMenu]',
  standalone: true,
})
class MenuDirectiveStub {
  @Input() menuExpand = false;
}

@Component({
  selector: 'vl-velora-icon',
  standalone: true,
  template: '',
})
class VeloraIconStubComponent {
  @Input() name = '';
  @Input() class = '';
}

describe('SidebarMenuComponent performance', () => {
  let fixture: ComponentFixture<SidebarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMenuComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ShellNavigationFacade,
          useValue: {
            menuItems: signal([]),
          },
        },
      ],
    })
      .overrideComponent(SidebarMenuComponent, {
        set: {
          imports: [
            RouterLink,
            ScrollDirectiveStub,
            MenuDirectiveStub,
            VeloraIconStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SidebarMenuComponent);
    fixture.detectChanges();
  });

  it('exposes stable scroll dependency arrays instead of template literals', () => {
    const component = fixture.componentInstance as unknown as {
      scrollDependencies?: readonly string[];
      scrollWrappers?: readonly string[];
    };

    expect(component.scrollDependencies).toEqual([
      '#velora_app_sidebar_logo',
      '#velora_app_sidebar_footer',
    ]);
    expect(component.scrollWrappers).toEqual(['#velora_app_sidebar_menu']);
    expect(component.scrollDependencies).toBe(component.scrollDependencies);
    expect(component.scrollWrappers).toBe(component.scrollWrappers);
  });
});
