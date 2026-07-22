import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutType } from '@core/config/config';
import { LayoutInitService } from '@core/services/layout-init.service';
import { LayoutService } from '@core/services/layout.service';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

@Component({
  selector: 'vl-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslateModule, VeloraIconComponent],
})
export class HeaderMenuComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly layout = inject(LayoutService);
  private readonly layoutInit = inject(LayoutInitService);

  private readonly _currentUrl = signal<string>('');

  readonly currentUrl = computed(() => this._currentUrl());

  ngOnInit(): void {
    this._currentUrl.set(this.router.url);
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.currentUrl(), url) ? 'active' : '';
  }

  setBaseLayoutType(layoutType: LayoutType): void {
    this.layoutInit.setBaseLayoutType(layoutType);
  }

  setToolbar(
    toolbarLayout: 'classic' | 'accounting' | 'extended' | 'reports' | 'saas'
  ): void {
    const currentConfig = { ...this.layout.layoutConfigSubject.value };
    if (currentConfig && currentConfig.app && currentConfig.app.toolbar) {
      currentConfig.app.toolbar.layout = toolbarLayout;
      this.layout.saveBaseConfig(currentConfig);
    }
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
