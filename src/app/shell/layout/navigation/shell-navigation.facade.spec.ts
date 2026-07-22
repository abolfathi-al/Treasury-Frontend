import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { PAGE_NAVIGATION_ITEMS } from '@core/navigation';
import { ShellNavigationFacade } from './shell-navigation.facade';

describe('ShellNavigationFacade project composition', () => {
  it('renders injected nested navigation instead of a shell-owned config', () => {
    const requestedKeys: string[][] = [];
    const navigationItems = [
      {
        id: 'reports',
        kind: 'section',
        labelKey: 'navigation.reports',
        children: [
          {
            id: 'daily-report',
            kind: 'link',
            labelKey: 'navigation.dailyReport',
            route: '/reports/daily',
          },
        ],
      },
    ] as const;

    TestBed.configureTestingModule({
      providers: [
        ShellNavigationFacade,
        { provide: PAGE_NAVIGATION_ITEMS, useValue: navigationItems },
        {
          provide: Router,
          useValue: { events: EMPTY, url: '/reports/daily' },
        },
        {
          provide: TranslateService,
          useValue: {
            stream: (keys: string[]) => {
              requestedKeys.push(keys);
              return of({
                'navigation.reports': 'Reports',
                'navigation.dailyReport': 'Daily report',
              });
            },
            instant: (key: string) => key,
          },
        },
      ],
    });

    const facade = TestBed.inject(ShellNavigationFacade);
    const menuItems = facade.menuItems();

    expect(requestedKeys).toEqual([
      ['navigation.reports', 'navigation.dailyReport'],
    ]);
    expect(menuItems[0].label).toBe('Reports');
    expect(menuItems[0].children[0].label).toBe('Daily report');
    expect(menuItems[0].children[0].isActive).toBeTrue();
  });

  it('uses the navigation token default when a consumer provides no items', () => {
    TestBed.configureTestingModule({
      providers: [
        ShellNavigationFacade,
        { provide: Router, useValue: { events: EMPTY, url: '/' } },
        {
          provide: TranslateService,
          useValue: {
            stream: () => of({}),
            instant: (key: string) => key,
          },
        },
      ],
    });

    expect(TestBed.inject(ShellNavigationFacade).menuItems()).toEqual([]);
  });
});
