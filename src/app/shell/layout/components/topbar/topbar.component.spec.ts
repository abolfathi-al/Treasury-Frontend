import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LayoutService } from '@core/services/layout.service';
import { TopbarComponent } from './topbar.component';

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
class SearchResultInnerStubComponent {}

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

describe('TopbarComponent', () => {
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: LayoutService,
          useValue: {
            getProp: () => 'menu',
          },
        },
      ],
    })
      .overrideComponent(TopbarComponent, {
        set: {
          imports: [
            NgClass,
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

    fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
  });

  it('passes a resolved button class string to the theme switcher', () => {
    const themeSwitcher = fixture.debugElement.query(
      By.directive(ThemeModeSwitcherStubComponent),
    ).componentInstance as ThemeModeSwitcherStubComponent;

    expect(themeSwitcher.toggleBtnClass).toBe(
      'btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px',
    );
  });
});
