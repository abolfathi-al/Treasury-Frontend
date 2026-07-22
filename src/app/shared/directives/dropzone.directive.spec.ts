import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type Dropzone from 'dropzone';

import { CssLoaderService } from '@core/services/css-loader.service';

import {
  DropzoneDirective,
  type DropzoneError,
  type DropzoneOptions,
  hasDropzoneRemoveHandler,
  markDropzoneRemoveHandler,
  toDropzoneClipboardEvent,
} from './dropzone.directive';

type FakeDropzoneHandler = (...args: unknown[]) => unknown;

class FakeDropzone {
  static lastInstance: FakeDropzone | null = null;
  static lastOptions: DropzoneOptions | null = null;

  readonly files: Dropzone.DropzoneFile[] = [];
  readonly handlers = new Map<string, FakeDropzoneHandler[]>();
  readonly removedFiles: Dropzone.DropzoneFile[] = [];
  destroyed = false;

  constructor(
    readonly element: HTMLElement,
    options: DropzoneOptions
  ) {
    FakeDropzone.lastInstance = this;
    FakeDropzone.lastOptions = options;
    const init = options.init as ((this: FakeDropzone) => void) | undefined;
    init?.call(this);
  }

  on(eventName: string, handler: FakeDropzoneHandler): FakeDropzone {
    const handlers = this.handlers.get(eventName) ?? [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
    return this;
  }

  emit(eventName: string, ...args: unknown[]): void {
    this.handlers.get(eventName)?.forEach((handler) => handler(...args));
  }

  removeFile(file: Dropzone.DropzoneFile): void {
    this.removedFiles.push(file);
  }

  destroy(): void {
    this.destroyed = true;
  }
}

@Component({
  imports: [DropzoneDirective],
  standalone: true,
  template: `
    <div
      vlVeloraDropzone
      [dropzoneHiddenInputContainer]="hiddenInputContainer"
      [dropzoneRenameFile]="renameFile"
      [dropzoneTransformFile]="transformFile"
      [dropzoneResize]="resize"
    ></div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(DropzoneDirective);
  readonly hiddenInputContainer = document.createElement('div');
  readonly renameFile = (name: string): string => `renamed-${name}`;
  readonly transformFile = (
    file: Dropzone.DropzoneFile,
    done: (file: File | Blob) => void
  ): void => done(file);
  readonly resize = (): Dropzone.DropzoneResizeInfo => ({
    srcX: 0,
    srcY: 0,
    srcWidth: 100,
    srcHeight: 100,
    trgWidth: 50,
    trgHeight: 50,
  });
}

interface DropzoneDirectiveInternals {
  DropzoneClass: typeof Dropzone | null;
  createInstance(): void;
  loadLibrary(): Promise<void>;
  populatePreview(
    previewElement: HTMLElement,
    file: Dropzone.DropzoneFile
  ): void;
}

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
  beforeEach(() => {
    FakeDropzone.lastInstance = null;
    FakeDropzone.lastOptions = null;
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: CssLoaderService,
          useValue: { loadCss: () => new Promise<void>(() => undefined) },
        },
      ],
    });
  });

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

  it('composes adapter events without replacing Dropzone UI callbacks', () => {
    jasmine.clock().install();
    try {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      const directive = fixture.componentInstance.directive();
      const addedFileCallback = jasmine.createSpy('addedfile callback');
      const dropCallback = jasmine.createSpy('drop callback');
      const addedFileOutput = spyOn(
        directive.addedFileEvent,
        'emit'
      ).and.callThrough();

      directive.updateOptions({
        addedfile: addedFileCallback,
        drop: dropCallback,
      });
      const internals = directive as unknown as DropzoneDirectiveInternals;
      internals.DropzoneClass = FakeDropzone as unknown as typeof Dropzone;
      internals.createInstance();

      const constructorOptions = FakeDropzone.lastOptions;
      const instance = FakeDropzone.lastInstance;
      expect(constructorOptions).not.toBeNull();
      expect(instance).not.toBeNull();

      const eventCallbackKeys: readonly (keyof DropzoneOptions)[] = [
        'addedfile',
        'removedfile',
        'thumbnail',
        'error',
        'errormultiple',
        'processing',
        'processingmultiple',
        'uploadprogress',
        'maxfilesexceeded',
        'maxfilesreached',
        'queuecomplete',
        'sending',
        'sendingmultiple',
        'success',
        'successmultiple',
        'complete',
        'completemultiple',
        'canceled',
        'canceledmultiple',
        'drop',
        'dragstart',
        'dragend',
        'dragenter',
        'dragover',
        'dragleave',
        'paste',
        'reset',
      ];
      eventCallbackKeys.forEach((key) => {
        expect(constructorOptions?.[key]).withContext(key).toBeUndefined();
        expect(instance?.handlers.get(key)?.length)
          .withContext(key)
          .toBe(1);
      });
      expect(constructorOptions?.init).toEqual(jasmine.any(Function));

      const file = {
        name: 'statement.csv',
        size: 128,
      } as Dropzone.DropzoneFile;
      const dropEvent = new DragEvent('drop');
      instance?.emit('addedfile', file);
      instance?.emit('drop', dropEvent);

      expect(addedFileCallback).toHaveBeenCalledOnceWith(file);
      expect(addedFileOutput).toHaveBeenCalledOnceWith(file);
      expect(dropCallback).toHaveBeenCalledOnceWith(dropEvent);

      fixture.destroy();
      jasmine.clock().tick(100);
      expect(instance?.destroyed).toBeTrue();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('cancels delayed preview work and manual remove handlers on destroy', () => {
    jasmine.clock().install();
    try {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      const directive = fixture.componentInstance.directive();
      const internals = directive as unknown as DropzoneDirectiveInternals;
      internals.DropzoneClass = FakeDropzone as unknown as typeof Dropzone;
      const populatePreview = spyOn(
        internals,
        'populatePreview'
      ).and.callThrough();
      internals.createInstance();

      const instance = FakeDropzone.lastInstance!;
      const previewElement = document.createElement('div');
      previewElement.innerHTML = `
        <span data-dz-size></span>
        <span data-dz-name></span>
        <button type="button" data-dz-remove>Remove</button>
      `;
      const removeButton = previewElement.querySelector<HTMLElement>(
        '[data-dz-remove]'
      )!;
      const file = {
        name: 'statement.csv',
        size: 128,
        previewElement,
      } as unknown as Dropzone.DropzoneFile;
      instance.files.push(file);

      instance.emit('addedfile', file);
      expect(populatePreview).toHaveBeenCalledTimes(1);
      expect(hasDropzoneRemoveHandler(removeButton)).toBeTrue();

      fixture.destroy();
      removeButton.click();
      jasmine.clock().tick(100);

      expect(populatePreview).toHaveBeenCalledTimes(1);
      expect(hasDropzoneRemoveHandler(removeButton)).toBeFalse();
      expect(instance.removedFiles).toEqual([]);
      expect(instance.destroyed).toBeTrue();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('binds advanced inputs and emits validation and total-size state', () => {
    jasmine.clock().install();
    try {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const directive = component.directive();
      const options = directive.getOptions();

      expect(options.hiddenInputContainer).toBe(
        component.hiddenInputContainer
      );
      expect(options.renameFile).toBe(component.renameFile);
      expect(options.transformFile).toBe(component.transformFile);
      expect(options.resize).toBe(component.resize);

      const validationChange = spyOn(
        directive.validationChange,
        'emit'
      ).and.callThrough();
      const totalSizeChange = spyOn(
        directive.totalSizeEvent,
        'emit'
      ).and.callThrough();
      const internals = directive as unknown as DropzoneDirectiveInternals;
      internals.DropzoneClass = FakeDropzone as unknown as typeof Dropzone;
      internals.createInstance();

      const file = {
        name: 'statement.csv',
        size: 128,
      } as Dropzone.DropzoneFile;
      FakeDropzone.lastInstance?.files.push(file);
      FakeDropzone.lastInstance?.emit('addedfile', file);

      expect(validationChange).toHaveBeenCalledOnceWith({
        isValid: true,
        errors: [],
      });
      expect(totalSizeChange).toHaveBeenCalledOnceWith(128);
      expect(directive.getTotalSize()).toBe(128);

      fixture.destroy();
      jasmine.clock().tick(100);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('waits for library loading when recreate runs before bootstrap', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as DropzoneDirectiveInternals;
    let resolveLoad!: () => void;
    const pendingLoad = new Promise<void>((resolve) => {
      resolveLoad = resolve;
    });
    const loadLibrary = spyOn(internals, 'loadLibrary').and.returnValue(
      pendingLoad
    );
    let settled = false;

    const recreation = directive.recreate().then(() => {
      settled = true;
    });
    await Promise.resolve();

    expect(loadLibrary).toHaveBeenCalledTimes(1);
    expect(settled).toBeFalse();

    resolveLoad();
    await recreation;

    expect(settled).toBeTrue();
    fixture.destroy();
  });

  it('recreates the instance before resolving when the library is cached', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as DropzoneDirectiveInternals;
    internals.DropzoneClass = FakeDropzone as unknown as typeof Dropzone;
    internals.createInstance();
    const firstInstance = FakeDropzone.lastInstance!;

    await directive.recreate();

    expect(firstInstance.destroyed).toBeTrue();
    expect(FakeDropzone.lastInstance).not.toBe(firstInstance);
    expect(directive.isDropzoneActive()).toBeTrue();
    fixture.destroy();
  });
});
