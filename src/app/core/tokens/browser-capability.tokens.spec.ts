import { resolveCssApi } from './css.token';
import { resolveNetworkInformation } from './network-information.token';
import { resolveSpeechRecognitionConstructor } from './speech-recognition.token';

describe('browser capability token helpers', () => {
  it('uses the browser CSS API when present', () => {
    const cssApi = {
      escape: (ident: string) => `escaped:${ident}`,
      supports: () => true,
    };

    expect(
      resolveCssApi({ CSS: cssApi } as unknown as Window).escape('id')
    ).toBe('escaped:id');
  });

  it('falls back when CSS is unavailable', () => {
    expect(resolveCssApi({} as Window).supports('display', 'grid')).toBeFalse();
  });

  it('uses standard or webkit speech recognition constructors', () => {
    class StandardSpeechRecognition {}
    class WebkitSpeechRecognition {}

    expect(
      resolveSpeechRecognitionConstructor({
        speechRecognition: StandardSpeechRecognition,
      } as unknown as Window)
    ).toBe(StandardSpeechRecognition);
    expect(
      resolveSpeechRecognitionConstructor({
        webkitSpeechRecognition: WebkitSpeechRecognition,
      } as unknown as Window)
    ).toBe(WebkitSpeechRecognition);
  });

  it('uses navigator network information when present', () => {
    const connection = { effectiveType: '4g' as const, saveData: true };

    expect(
      resolveNetworkInformation({ connection } as unknown as Navigator)
    ).toEqual(connection);
  });
});
