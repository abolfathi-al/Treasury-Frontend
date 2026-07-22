import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';

import { AUTH_SESSION } from '@core/auth';
import { ToggleDirective } from '@shared/directives/toggle.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { ShellFacade } from '../../../shell.facade';

const SIDEBAR_LOGO_CONSTANTS = {
  DEFAULT_LOGO_URL: 'assets/media/logos/default-small.svg',
  TOGGLE_ATTR_PREFIX: 'app-sidebar-',
} as const;

@Component({
  selector: 'vl-sidebar-logo',
  templateUrl: './sidebar-logo.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, AsyncPipe, RouterLink, ToggleDirective, VeloraIconComponent],
})
export class SidebarLogoComponent implements OnInit {
  private readonly auth = inject(AUTH_SESSION);
  readonly shell = inject(ShellFacade);

  readonly toggleButtonClass = input<string>('');
  readonly toggleEnabled = input<boolean>(false);
  readonly toggleType = input<string>('');
  readonly toggleState = input<string>('');

  readonly toggleAttr = computed(
    () => `${SIDEBAR_LOGO_CONSTANTS.TOGGLE_ATTR_PREFIX}${this.toggleType()}`
  );

  logoUrl$: Observable<string>;

  ngOnInit(): void {
    this.logoUrl$ = this.auth.getCurrentUserChanges().pipe(
      map(
        (user) =>
          user?.logoUrl?.trim() || SIDEBAR_LOGO_CONSTANTS.DEFAULT_LOGO_URL
      ),
      shareReplay(1)
    );
  }
}
