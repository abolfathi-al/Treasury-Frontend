import { NgClass } from '@angular/common';
import {
  Component,
  Directive,
  Input,
  Pipe,
  PipeTransform,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LANGUAGE_SERVICE } from '@core/i18n';
import {
  NotificationsInnerComponent,
  NotificationsTabsType,
} from './notifications-inner.component';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink]',
  standalone: true,
})
class RouterLinkStubDirective {
  @Input() routerLink: unknown;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[inlineSVG]',
  standalone: true,
})
class InlineSvgStubDirective {
  @Input() inlineSVG = '';
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[ngSrc]',
  standalone: true,
})
class NgOptimizedImageStubDirective {
  @Input() ngSrc = '';
}

@Pipe({
  name: 'translate',
  standalone: true,
})
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
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

class TranslationServiceStub {
  readonly isRtl = signal(false);

  getSelectedLanguage(): string {
    return 'fa';
  }

  getLanguageDirection(): 'ltr' | 'rtl' {
    return this.isRtl() ? 'rtl' : 'ltr';
  }

  isLanguageRTL(): boolean {
    return this.isRtl();
  }

  setLanguage(): boolean {
    return true;
  }

  loadRuntimeTranslations(): Promise<void> {
    return Promise.resolve();
  }
}

describe('NotificationsInnerComponent shell contracts', () => {
  let fixture: ComponentFixture<NotificationsInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsInnerComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LANGUAGE_SERVICE, useClass: TranslationServiceStub },
      ],
    })
      .overrideComponent(NotificationsInnerComponent, {
        set: {
          imports: [
            NgClass,
            RouterLinkStubDirective,
            InlineSvgStubDirective,
            NgOptimizedImageStubDirective,
            TranslatePipeStub,
            VeloraIconStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NotificationsInnerComponent);
    fixture.detectChanges();
  });

  it('uses native buttons for notification tab and upgrade controls', () => {
    const tabButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button[data-bs-toggle="tab"]')
    ) as HTMLButtonElement[];
    const upgradeButton = fixture.nativeElement.querySelector(
      'button[data-bs-target="#velora_modal_upgrade_plan"]'
    ) as HTMLButtonElement | null;

    expect(tabButtons.length).toBe(3);
    expect(tabButtons.every((button) => button.type === 'button')).toBeTrue();
    expect(tabButtons[1]?.getAttribute('aria-selected')).toBe('true');
    expect(upgradeButton?.type).toBe('button');
  });

  it('exposes stable tab-pane class maps for template bindings', () => {
    const component = fixture.componentInstance as unknown as {
      alertsTabPaneClasses?: () => Record<string, boolean>;
      updatesTabPaneClasses?: () => Record<string, boolean>;
      logsTabPaneClasses?: () => Record<string, boolean>;
      setActiveTabId(tabId: NotificationsTabsType): void;
    };

    const updatesClasses = component.updatesTabPaneClasses?.();
    const updatesClassesAgain = component.updatesTabPaneClasses?.();

    expect(updatesClasses).toEqual({ 'show active': true });
    expect(updatesClassesAgain).toBe(updatesClasses);
    expect(component.alertsTabPaneClasses?.()).toEqual({
      'show active': false,
    });
    expect(component.logsTabPaneClasses?.()).toEqual({
      'show active': false,
    });

    component.setActiveTabId('velora_topbar_notifications_1');
    fixture.detectChanges();

    expect(component.alertsTabPaneClasses?.()).toEqual({
      'show active': true,
    });
    expect(component.updatesTabPaneClasses?.()).toEqual({
      'show active': false,
    });
  });

  it('uses unique log ids for stable list tracking', () => {
    const component = fixture.componentInstance as unknown as {
      logs: () => Array<{ id?: string }>;
    };

    const logIds = component.logs().map((log) => log.id);

    expect(logIds.every(Boolean)).toBeTrue();
    expect(new Set(logIds).size).toBe(logIds.length);
  });
});
