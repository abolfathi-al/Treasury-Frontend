import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseErrorComponent, ErrorRouteData } from '../../components/base-error.component';

import { ErrorInfo } from '../../models/error.types';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

@Component({
  selector: 'vl-error500',
  templateUrl: './error500.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    CommonModule,
    TranslateModule,
    VeloraIconComponent,
  ]
})
export class Error500Component extends BaseErrorComponent {
  // Computed values specific to 500
  readonly backgroundImage = computed(() =>
    this.isDarkMode()
      ? 'url(./assets/media/auth/bg7-dark.webp)'
      : 'url(./assets/media/auth/bg7.webp)'
  );
  readonly illustration = computed(() =>
    this.getIllustration(
      'assets/media/auth/500-error.webp',
      'assets/media/auth/500-error-dark.webp'
    )
  );

  /**
   * Create error info using base utility
   */
  protected createErrorInfo(routeData: ErrorRouteData, fallbackInfo?: ErrorInfo): ErrorInfo {
    return this.createBaseErrorInfo(
      '500',
      'workspace.errors.error500.title',
      'workspace.errors.error500.message',
      'warning',
      'assets/media/auth/500-error.webp',
      'assets/media/auth/500-error-dark.webp',
      true,  // showRetry
      true,  // showHome
      false, // showBack
      routeData,
      fallbackInfo
    );
  }

  /**
   * Get background image for 500 page
   */
  protected getBackgroundImage(): string {
    return this.backgroundImage();
  }
}
