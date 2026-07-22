import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BaseErrorComponent, ErrorRouteData } from '../../components/base-error.component';
import { ErrorInfo } from '../../models/error.types';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

@Component({
  selector: 'vl-error404',
  templateUrl: './error404.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    CommonModule,
    TranslateModule,
    VeloraIconComponent,
  ]
})
export class Error404Component extends BaseErrorComponent {
  // Computed values specific to 404
  readonly backgroundImage = computed(() =>
    this.isDarkMode()
      ? 'url(./assets/media/auth/bg1-dark.webp)'
      : 'url(./assets/media/auth/bg1.webp)'
  );
  readonly illustration = computed(() =>
    this.getIllustration(
      'assets/media/illustrations/sigma-1/18.webp',
      'assets/media/illustrations/sigma-1/18-dark.webp'
    )
  );

  /**
   * Create error info using base utility
   */
  protected createErrorInfo(routeData: ErrorRouteData, fallbackInfo?: ErrorInfo): ErrorInfo {
    return this.createBaseErrorInfo(
      '404',
      'workspace.errors.error404.title',
      'workspace.errors.error404.message',
      'search',
      'assets/media/illustrations/sigma-1/18.webp',
      'assets/media/illustrations/sigma-1/18-dark.webp',
      false, // showRetry
      true,  // showHome
      true,  // showBack
      routeData,
      fallbackInfo
    );
  }

  /**
   * Get background image for 404 page
   */
  protected getBackgroundImage(): string {
    return this.backgroundImage();
  }
}
