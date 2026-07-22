import { Injectable, inject, DestroyRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, merge, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LANGUAGE_SERVICE } from '@core/i18n';
import { GlobalEventsService } from './events.service';
import { ModalRef } from '@models/common';

export interface AppInitializationConfig {
  onOverlayChange?: () => void;
  onModalRefsChange?: (modalRefs: ModalRef[]) => void;
}

const DEBOUNCE_TIME = 100;
@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {
  private readonly translate = inject(TranslateService);
  private readonly selectConfig = inject(NgSelectConfig);
  private readonly modalService = inject(NgbModal);
  private readonly languageService = inject(LANGUAGE_SERVICE);
  private readonly globalEventsService = inject(GlobalEventsService);
  private readonly destroyRef = inject(DestroyRef);

  initialize(config: AppInitializationConfig = {}): void {
    this.setupTranslations();
    this.setupNgSelectConfig();
    this.setupOverlaySubscriptions(config);
  }

  destroy(): void {
  }

  private setupTranslations(): void {
    void this.languageService.loadRuntimeTranslations();
  }

  private setupNgSelectConfig(): void {
    const config = {
      openOnEnter: false,
      notFoundText: this.translate.instant('common.select.notFound'),
      loadingText: this.translate.instant('common.select.loading'),
      typeToSearchText: this.translate.instant('common.select.typeToSearch'),
      addTagText: this.translate.instant('common.select.addTag'),
      clearAllText: this.translate.instant('common.select.clearAll')
    };

    Object.assign(this.selectConfig, config);
  }

  private setupOverlaySubscriptions(config: AppInitializationConfig): void {
    merge(
      this.modalService.activeInstances,
      this.globalEventsService.hasOpenNotification$,
      this.globalEventsService.hasOpenDrawer$
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(DEBOUNCE_TIME),
      tap(() => config.onOverlayChange?.())
    ).subscribe();

    this.modalService.activeInstances.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((modalRefs) => config.onModalRefsChange?.(modalRefs))
    ).subscribe();
  }
}
