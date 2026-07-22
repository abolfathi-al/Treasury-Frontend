import {
  DropzoneDirective,
  type DropzoneError,
  type DropzoneOptions,
  hasDropzoneRemoveHandler,
  markDropzoneRemoveHandler,
  toDropzoneClipboardEvent,
} from './dropzone.directive';

type IsAny<T> = 0 extends 1 & T ? true : false;
type IsNotAny<T> = IsAny<T> extends true ? false : true;
type AssertAll<T extends readonly true[]> = T;
type OutputPayload<T> = T extends { emit(value: infer Value): void }
  ? Value
  : never;

type DropzonePublicTypeContracts = AssertAll<
  [
    IsNotAny<NonNullable<DropzoneOptions['params']>[string]>,
    IsNotAny<Parameters<NonNullable<DropzoneOptions['successmultiple']>>[1]>,
    IsNotAny<NonNullable<DropzoneError['details']>>,
    IsNotAny<NonNullable<ReturnType<DropzoneDirective['dropzoneParams']>>[string]>,
    IsNotAny<OutputPayload<DropzoneDirective['successEvent']>['response']>,
    IsNotAny<OutputPayload<DropzoneDirective['successMultipleEvent']>['response']>,
  ]
>;

describe('Dropzone directive adapter helpers', () => {
  it('keeps public payload contracts narrowed to unknown', () => {
    const contract: DropzonePublicTypeContracts = [
      true,
      true,
      true,
      true,
      true,
      true,
    ];

    expect(contract.every(Boolean)).toBeTrue();
  });

  it('marks remove links without changing element identity', () => {
    const element = document.createElement('a');

    expect(hasDropzoneRemoveHandler(element)).toBeFalse();
    markDropzoneRemoveHandler(element);

    expect(hasDropzoneRemoveHandler(element)).toBeTrue();
  });

  it('preserves the original paste event object when adapting output type', () => {
    const event = new Event('paste') as unknown as DragEvent;

    expect(toDropzoneClipboardEvent(event)).toBe(
      event as unknown as ClipboardEvent
    );
  });
});
