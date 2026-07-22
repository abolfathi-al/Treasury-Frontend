import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const SPEECH_SYNTHESIS = new InjectionToken<SpeechSynthesis>(
  'SpeechSynthesis',
  {
    factory: (): SpeechSynthesis => inject(WINDOW).speechSynthesis
  }
);
