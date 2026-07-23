import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AUTH_SESSION } from '@core/auth';
import { LANGUAGE_SERVICE } from '@core/i18n';
import { AuthFacade } from '@core/state/context';
import { MenuDirective } from '@shared/directives/menu.directive';
import { resolveShellProfile } from '@shell/layout/shell-profile';

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const USER_INNER_CONSTANTS = {
  MENU_CLASS:
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px',
  LANGUAGE_FLAGS: [
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/flags/united-states.svg',
    },
    {
      lang: 'fa',
      name: 'Persian',
      flag: './assets/media/flags/iran.svg',
    },
  ] as LanguageFlag[],
} as const;
@Component({
  selector: 'vl-user-inner',
  templateUrl: './user-inner.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslateModule,
    NgbTooltipModule,
  ],
  hostDirectives: [MenuDirective],
  host: {
    class: USER_INNER_CONSTANTS.MENU_CLASS,
  },
})
export class UserInnerComponent implements OnInit {
  private readonly auth = inject(AUTH_SESSION);
  private readonly contextAuth = inject(AuthFacade, { optional: true });
  private readonly languageService = inject(LANGUAGE_SERVICE);
  private readonly legacyUser = toSignal(this.auth.getCurrentUserChanges(), {
    initialValue: this.auth.getCurrentUserSnapshot(),
  });

  readonly language = signal<LanguageFlag | undefined>(undefined);
  readonly langs = signal<LanguageFlag[]>([
    ...USER_INNER_CONSTANTS.LANGUAGE_FLAGS,
  ]);
  readonly profile = computed(() =>
    resolveShellProfile(this.legacyUser(), this.contextAuth?.state()),
  );

  ngOnInit(): void {
    this.setLanguage(this.languageService.getSelectedLanguage());
  }

  logout(): void {
    this.auth.logout();
  }

  selectLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
    this.setLanguage(lang);
  }

  setLanguage(lang: string): void {
    const updatedLangs = this.langs().map((language: LanguageFlag) => ({
      ...language,
      active: language.lang === lang,
    }));

    this.langs.set(updatedLangs);

    const activeLanguage = updatedLangs.find((l) => l.active);
    this.language.set(activeLanguage);
  }
}
