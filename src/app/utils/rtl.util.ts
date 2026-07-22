import { computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { LANGUAGE_SERVICE, type LanguageDirection } from '@core/i18n';

export type { LanguageDirection } from '@core/i18n';

export interface RtlSignals {
  isRtl: Signal<boolean>;
  direction: Signal<LanguageDirection>;
  prevArrowIcon: Signal<string>;
  nextArrowIcon: Signal<string>;
  arrowIcon: Signal<string>;
  textDirection: Signal<LanguageDirection>;
}

export function createRtlSignals(): RtlSignals {
  const languageService = inject(LANGUAGE_SERVICE);

  const direction = toSignal(languageService.getLanguageDirectionChanges(), {
    initialValue: languageService.getLanguageDirection(),
  });

  const isRtl = computed(() => direction() === 'rtl');
  const prevArrowIcon = computed(() => (isRtl() ? 'left' : 'right'));
  const nextArrowIcon = computed(() => (isRtl() ? 'right' : 'left'));
  const arrowIcon = computed(() => (isRtl() ? 'arrow-left' : 'arrow-right'));
  const textDirection = computed(() => (isRtl() ? 'rtl' : 'ltr'));

  return {
    isRtl,
    direction,
    prevArrowIcon,
    nextArrowIcon,
    arrowIcon,
    textDirection,
  };
}
