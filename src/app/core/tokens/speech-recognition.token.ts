import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export interface SpeechRecognitionConstructor {
  new (): unknown;
}

type WindowWithSpeechRecognition = Window & {
  speechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export const resolveSpeechRecognitionConstructor = (
  windowRef: Window
): SpeechRecognitionConstructor | null => {
  const speechWindow = windowRef as WindowWithSpeechRecognition;
  return speechWindow.speechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
};

export const SPEECH_RECOGNITION = new InjectionToken<SpeechRecognitionConstructor | null>(
  'SpeechRecognition',
  {
    factory: (): SpeechRecognitionConstructor | null => {
      return resolveSpeechRecognitionConstructor(inject(WINDOW));
    }
  }
);
