import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Directive, Input, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import {
  ThemeModeService,
  ThemeModeValue,
} from '@core/services/theme-mode.service';
import { ThemeModeSwitcherComponent } from './theme-mode-switcher.component';

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

class ThemeModeServiceStub {
  readonly mode = new BehaviorSubject<ThemeModeValue>('light');
  readonly menuMode = new BehaviorSubject<ThemeModeValue>('light');
  readonly init = jasmine.createSpy('init');
  readonly switchMode = jasmine.createSpy('switchMode');
}

describe('ThemeModeSwitcherComponent accessibility', () => {
  let fixture: ComponentFixture<ThemeModeSwitcherComponent>;
  let modeService: ThemeModeServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeModeSwitcherComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ThemeModeService, useClass: ThemeModeServiceStub },
        {
          provide: LoggerService,
          useValue: {
            error: jasmine.createSpy('error'),
            warn: jasmine.createSpy('warn'),
          },
        },
      ],
    })
      .overrideComponent(ThemeModeSwitcherComponent, {
        set: {
          imports: [
            NgClass,
            AsyncPipe,
            TranslateModule,
            MenuDirectiveStub,
            VeloraIconStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ThemeModeSwitcherComponent);
    modeService = TestBed.inject(
      ThemeModeService,
    ) as unknown as ThemeModeServiceStub;
    fixture.detectChanges();
  });

  it('uses a real button for the menu trigger', () => {
    const trigger = fixture.nativeElement.querySelector(
      '[data-velora-menu-trigger]',
    ) as HTMLButtonElement | null;

    expect(trigger).not.toBeNull();
    expect(trigger?.tagName).toBe('BUTTON');
    expect(trigger?.type).toBe('button');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('binds the trigger and placement attributes from stable component inputs', () => {
    fixture.componentRef.setInput('menuTrigger', 'click');
    fixture.componentRef.setInput('menuPlacement', 'top-start');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-velora-menu-trigger]',
    ) as HTMLButtonElement | null;

    expect(trigger?.getAttribute('data-velora-menu-trigger')).toBe('click');
    expect(trigger?.getAttribute('data-velora-menu-placement')).toBe('top-start');
  });

  it('renders a trigger icon when the current theme mode is system', () => {
    modeService.mode.next('system');
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(
      (debugElement) =>
        debugElement.nativeElement instanceof HTMLButtonElement &&
        debugElement.nativeElement.hasAttribute('data-velora-menu-trigger'),
    );
    const icons = trigger
      .queryAll(
        (debugElement) =>
          debugElement.componentInstance instanceof VeloraIconStubComponent,
      )
      .map(
        (debugElement) =>
          debugElement.componentInstance as VeloraIconStubComponent,
      );

    expect(icons.some((icon) => icon.name === 'screen')).toBeTrue();
  });
});
