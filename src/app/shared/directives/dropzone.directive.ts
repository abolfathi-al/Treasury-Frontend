import {
  computed,
  Directive,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import type Dropzone from 'dropzone';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';

import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

type DropzoneDragEvent = DragEvent;
type DropzoneClipboardEvent = ClipboardEvent;
type DropzoneRemoveHandlerElement = HTMLElement & {
  _dropzoneRemoveHandler?: true;
};
type DropzoneParams = Record<string, unknown>;
type DropzoneResponse = unknown;

export const toDropzoneClipboardEvent = (
  event: DropzoneDragEvent
): DropzoneClipboardEvent => event as unknown as DropzoneClipboardEvent;

export const hasDropzoneRemoveHandler = (element: HTMLElement): boolean =>
  Boolean((element as DropzoneRemoveHandlerElement)._dropzoneRemoveHandler);

export const markDropzoneRemoveHandler = (element: HTMLElement): void => {
  (element as DropzoneRemoveHandlerElement)._dropzoneRemoveHandler = true;
};

const unmarkDropzoneRemoveHandler = (element: HTMLElement): void => {
  delete (element as DropzoneRemoveHandlerElement)._dropzoneRemoveHandler;
};

export interface DropzoneOptions {
  url?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  parallelUploads?: number;
  maxFilesize?: number;
  maxFiles?: number;
  acceptedFiles?: string;
  addRemoveLinks?: boolean;
  clickable?: boolean | string | HTMLElement;
  createImageThumbnails?: boolean;
  maxThumbnailFilesize?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  thumbnailMethod?: 'contain' | 'crop';
  timeout?: number;
  headers?: { [key: string]: string };
  params?: DropzoneParams;
  withCredentials?: boolean;
  uploadMultiple?: boolean;
  chunking?: boolean;
  chunkSize?: number;
  retryChunks?: boolean;
  retryChunksLimit?: number;
  forceFallback?: boolean;
  autoProcessQueue?: boolean;
  autoQueue?: boolean;
  renameFile?: (name: string) => string;
  transformFile?: (file: Dropzone.DropzoneFile, done: (file: File | Blob) => void) => void;
  resize?: (file: Dropzone.DropzoneFile, width?: number, height?: number, resizeMethod?: string) => Dropzone.DropzoneResizeInfo;
  dictDefaultMessage?: string;
  dictFallbackMessage?: string;
  dictFallbackText?: string;
  dictFileTooBig?: string;
  dictInvalidFileType?: string;
  dictResponseError?: string;
  dictCancelUpload?: string;
  dictUploadCanceled?: string;
  dictCancelUploadConfirmation?: string;
  dictRemoveFile?: string;
  dictRemoveFileConfirmation?: string;
  dictMaxFilesExceeded?: string;
  previewTemplate?: string;
  previewsContainer?: string | HTMLElement;
  hiddenInputContainer?: HTMLElement;
  disablePreviews?: boolean;
  accept?: (file: Dropzone.DropzoneFile, done: (error?: string) => void) => void;
  init?: () => void;
  addedfile?: (file: Dropzone.DropzoneFile) => void;
  removedfile?: (file: Dropzone.DropzoneFile) => void;
  thumbnail?: (file: Dropzone.DropzoneFile, dataUrl: string) => void;
  error?: (file: Dropzone.DropzoneFile, errorMessage: string, xhr?: XMLHttpRequest) => void;
  errormultiple?: (files: Dropzone.DropzoneFile[], errorMessage: string, xhr?: XMLHttpRequest) => void;
  processing?: (file: Dropzone.DropzoneFile) => void;
  processingmultiple?: (files: Dropzone.DropzoneFile[]) => void;
  uploadprogress?: (file: Dropzone.DropzoneFile, progress: number, bytesSent: number) => void;
  maxfilesexceeded?: (file: Dropzone.DropzoneFile) => void;
  maxfilesreached?: (files: Dropzone.DropzoneFile[]) => void;
  queuecomplete?: () => void;
  sending?: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => void;
  sendingmultiple?: (files: Dropzone.DropzoneFile[], xhr: XMLHttpRequest, formData: FormData) => void;
  success?: (file: Dropzone.DropzoneFile) => void;
  successmultiple?: (
    files: Dropzone.DropzoneFile[],
    response: DropzoneResponse
  ) => void;
  complete?: (file: Dropzone.DropzoneFile) => void;
  completemultiple?: (files: Dropzone.DropzoneFile[]) => void;
  canceled?: (file: Dropzone.DropzoneFile) => void;
  canceledmultiple?: (files: Dropzone.DropzoneFile[]) => void;
  drop?: (e: DropzoneDragEvent) => void;
  dragstart?: (e: DropzoneDragEvent) => void;
  dragend?: (e: DropzoneDragEvent) => void;
  dragenter?: (e: DropzoneDragEvent) => void;
  dragover?: (e: DropzoneDragEvent) => void;
  dragleave?: (e: DropzoneDragEvent) => void;
  paste?: (e: DropzoneDragEvent) => void;
  reset?: () => void;
}

export interface DropzoneValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DropzoneError {
  code: string;
  message: string;
  details?: unknown;
}

const DEFAULT_OPTIONS: DropzoneOptions = {
  url: '/upload',
  method: 'POST',
  parallelUploads: 2,
  maxFilesize: 2,
  maxFiles: 10,
  acceptedFiles: 'image/*',
  addRemoveLinks: true,
  clickable: true,
  createImageThumbnails: true,
  maxThumbnailFilesize: 10,
  thumbnailWidth: 120,
  thumbnailHeight: 120,
  thumbnailMethod: 'contain',
  timeout: 30000,
  uploadMultiple: false,
  chunking: false,
  chunkSize: 2000000,
  retryChunks: false,
  retryChunksLimit: 3,
  forceFallback: false,
  autoProcessQueue: true,
  autoQueue: true,
  dictDefaultMessage: 'Drop files here to upload',
  dictFallbackMessage: 'Your browser does not support drag and drop file uploads.',
  dictFallbackText: 'Please use the fallback form below to upload your files like in the olden days.',
  dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
  dictInvalidFileType: 'You can not upload files of this type.',
  dictResponseError: 'Server responded with {{statusCode}} code.',
  dictCancelUpload: 'Cancel upload',
  dictUploadCanceled: 'Upload canceled.',
  dictCancelUploadConfirmation: 'Are you sure you want to cancel this upload?',
  dictRemoveFile: 'Remove file',
  dictRemoveFileConfirmation: 'Are you sure you want to remove this file?',
  dictMaxFilesExceeded: 'You can not upload any more files.',
} as const;

const DROPZONE_EVENT_CALLBACK_KEYS = [
  'init',
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
] as const satisfies readonly (keyof DropzoneOptions)[];

function omitDropzoneEventCallbacks(
  options: DropzoneOptions
): DropzoneOptions {
  const constructorOptions = { ...options };
  DROPZONE_EVENT_CALLBACK_KEYS.forEach((key) => {
    delete constructorOptions[key];
  });
  return constructorOptions;
}

const DEFAULT_PREVIEW_TEMPLATE = `<div class="dz-preview dz-file-preview">
  <div class="dz-image"><img data-dz-thumbnail /></div>
  <div class="dz-details">
    <div class="dz-size"><span data-dz-size></span></div>
    <div class="dz-filename"><span data-dz-name></span></div>
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
  <div class="dz-success-mark"><svg width="54px" height="54px" viewBox="0 0 54 54"><title>Check</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF"></path></g></svg></div>
  <div class="dz-error-mark"><svg width="54px" height="54px" viewBox="0 0 54 54"><title>Error</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475"><path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path></g></g></svg></div>
  <a class="dz-remove" href="javascript:undefined;" data-dz-remove>Remove</a>
</div>`;

@Directive({
  selector: '[vlVeloraDropzone]',
  exportAs: 'veloraDropzone',
  standalone: true,
})
export class DropzoneDirective extends BaseDirective<DropzoneOptions, DropzoneError> implements OnInit {
  private readonly host = useDirectiveHost();
  private readonly cssLoader = inject(CssLoaderService);

  private readonly _files = signal<Dropzone.DropzoneFile[]>([]);
  private readonly _totalSize = signal<number>(0);
  private readonly _uploadProgress = signal<number>(0);

  private dropzoneInstance: Dropzone | null = null;
  private DropzoneClass: typeof Dropzone | null = null;
  private libraryLoadPromise: Promise<void> | null = null;
  private readonly pendingTimers = new Set<ReturnType<typeof setTimeout>>();
  private pendingAnimationFrame: number | null = null;
  private readonly removeHandlerCleanups = new Map<HTMLElement, () => void>();

  readonly files = computed(() => this._files());
  readonly totalSize = computed(() => this._totalSize());
  readonly uploadProgress = computed(() => this._uploadProgress());

  readonly dropzoneUrl = input<string>();
  readonly dropzoneMethod = input<'POST' | 'PUT' | 'PATCH'>();
  readonly dropzoneParallelUploads = input<number>();
  readonly dropzoneMaxFilesize = input<number>();
  readonly dropzoneMaxFiles = input<number>();
  readonly dropzoneAcceptedFiles = input<string>();
  readonly dropzoneAddRemoveLinks = input<boolean>();
  readonly dropzonePreviewsContainer = input<string | HTMLElement>();
  readonly dropzoneHiddenInputContainer = input<HTMLElement>();
  readonly dropzoneClickable = input<boolean | string | HTMLElement>();
  readonly dropzoneCreateImageThumbnails = input<boolean>();
  readonly dropzoneMaxThumbnailFilesize = input<number>();
  readonly dropzoneThumbnailWidth = input<number>();
  readonly dropzoneThumbnailHeight = input<number>();
  readonly dropzoneThumbnailMethod = input<'contain' | 'crop'>();
  readonly dropzoneTimeout = input<number>();
  readonly dropzoneHeaders = input<{ [key: string]: string }>();
  readonly dropzoneParams = input<DropzoneParams>();
  readonly dropzoneWithCredentials = input<boolean>();
  readonly dropzoneUploadMultiple = input<boolean>();
  readonly dropzoneChunking = input<boolean>();
  readonly dropzoneChunkSize = input<number>();
  readonly dropzoneRetryChunks = input<boolean>();
  readonly dropzoneRetryChunksLimit = input<number>();
  readonly dropzoneAutoProcessQueue = input<boolean>();
  readonly dropzoneAutoQueue = input<boolean>();
  readonly dropzoneRenameFile = input<(name: string) => string>();
  readonly dropzoneTransformFile = input<(file: Dropzone.DropzoneFile, done: (file: File | Blob) => void) => void>();
  readonly dropzoneResize = input<(file: Dropzone.DropzoneFile, width?: number, height?: number, resizeMethod?: string) => Dropzone.DropzoneResizeInfo>();
  readonly dropzonePreviewTemplate = input<string>();
  readonly dropzoneForceFallback = input<boolean>();
  readonly dropzoneDictDefaultMessage = input<string>();
  readonly dropzoneDictFileTooBig = input<string>();
  readonly dropzoneDictInvalidFileType = input<string>();
  readonly dropzoneDictMaxFilesExceeded = input<string>();

  private readonly inputBindings = [
    { input: this.dropzoneUrl, key: 'url' as const },
    { input: this.dropzoneMethod, key: 'method' as const },
    { input: this.dropzoneParallelUploads, key: 'parallelUploads' as const },
    { input: this.dropzoneMaxFilesize, key: 'maxFilesize' as const },
    { input: this.dropzoneMaxFiles, key: 'maxFiles' as const },
    { input: this.dropzoneAcceptedFiles, key: 'acceptedFiles' as const },
    { input: this.dropzoneAddRemoveLinks, key: 'addRemoveLinks' as const },
    { input: this.dropzonePreviewsContainer, key: 'previewsContainer' as const },
    { input: this.dropzoneHiddenInputContainer, key: 'hiddenInputContainer' as const },
    { input: this.dropzoneClickable, key: 'clickable' as const },
    { input: this.dropzoneCreateImageThumbnails, key: 'createImageThumbnails' as const },
    { input: this.dropzoneMaxThumbnailFilesize, key: 'maxThumbnailFilesize' as const },
    { input: this.dropzoneThumbnailWidth, key: 'thumbnailWidth' as const },
    { input: this.dropzoneThumbnailHeight, key: 'thumbnailHeight' as const },
    { input: this.dropzoneThumbnailMethod, key: 'thumbnailMethod' as const },
    { input: this.dropzoneTimeout, key: 'timeout' as const },
    { input: this.dropzoneHeaders, key: 'headers' as const },
    { input: this.dropzoneParams, key: 'params' as const },
    { input: this.dropzoneWithCredentials, key: 'withCredentials' as const },
    { input: this.dropzoneUploadMultiple, key: 'uploadMultiple' as const },
    { input: this.dropzoneChunking, key: 'chunking' as const },
    { input: this.dropzoneChunkSize, key: 'chunkSize' as const },
    { input: this.dropzoneRetryChunks, key: 'retryChunks' as const },
    { input: this.dropzoneRetryChunksLimit, key: 'retryChunksLimit' as const },
    { input: this.dropzoneAutoProcessQueue, key: 'autoProcessQueue' as const },
    { input: this.dropzoneAutoQueue, key: 'autoQueue' as const },
    { input: this.dropzoneRenameFile, key: 'renameFile' as const },
    { input: this.dropzoneTransformFile, key: 'transformFile' as const },
    { input: this.dropzoneResize, key: 'resize' as const },
    { input: this.dropzonePreviewTemplate, key: 'previewTemplate' as const },
    { input: this.dropzoneForceFallback, key: 'forceFallback' as const },
    { input: this.dropzoneDictDefaultMessage, key: 'dictDefaultMessage' as const },
    { input: this.dropzoneDictFileTooBig, key: 'dictFileTooBig' as const },
    { input: this.dropzoneDictInvalidFileType, key: 'dictInvalidFileType' as const },
    { input: this.dropzoneDictMaxFilesExceeded, key: 'dictMaxFilesExceeded' as const },
  ];

  readonly initEvent = output<void>();
  readonly addedFileEvent = output<Dropzone.DropzoneFile>();
  readonly removedFileEvent = output<Dropzone.DropzoneFile>();
  readonly thumbnailEvent = output<{ file: Dropzone.DropzoneFile; dataUrl: string }>();
  readonly errorEvent = output<{ file: Dropzone.DropzoneFile; errorMessage: string; xhr: XMLHttpRequest | undefined }>();
  readonly errorMultipleEvent = output<{ files: Dropzone.DropzoneFile[]; errorMessage: string; xhr: XMLHttpRequest | undefined }>();
  readonly processingEvent = output<Dropzone.DropzoneFile>();
  readonly processingMultipleEvent = output<Dropzone.DropzoneFile[]>();
  readonly uploadProgressEvent = output<{ file: Dropzone.DropzoneFile; progress: number; bytesSent: number }>();
  readonly totalSizeEvent = output<number>();
  readonly maxFilesExceededEvent = output<Dropzone.DropzoneFile>();
  readonly maxFilesReachedEvent = output<Dropzone.DropzoneFile[]>();
  readonly queueCompleteEvent = output<void>();
  readonly sendingEvent = output<{ file: Dropzone.DropzoneFile; xhr: XMLHttpRequest; formData: FormData }>();
  readonly sendingMultipleEvent = output<{ files: Dropzone.DropzoneFile[]; xhr: XMLHttpRequest; formData: FormData }>();
  readonly successEvent = output<{
    file: Dropzone.DropzoneFile;
    response: DropzoneResponse;
  }>();
  readonly successMultipleEvent = output<{
    files: Dropzone.DropzoneFile[];
    response: DropzoneResponse;
  }>();
  readonly completeEvent = output<Dropzone.DropzoneFile>();
  readonly completeMultipleEvent = output<Dropzone.DropzoneFile[]>();
  readonly canceledEvent = output<Dropzone.DropzoneFile>();
  readonly canceledMultipleEvent = output<Dropzone.DropzoneFile[]>();
  readonly dropEvent = output<DropzoneDragEvent>();
  readonly dragStartEvent = output<DropzoneDragEvent>();
  readonly dragEndEvent = output<DropzoneDragEvent>();
  readonly dragEnterEvent = output<DropzoneDragEvent>();
  readonly dragOverEvent = output<DropzoneDragEvent>();
  readonly dragLeaveEvent = output<DropzoneDragEvent>();
  readonly pasteEvent = output<DropzoneClipboardEvent>();
  readonly resetEvent = output<void>();
  readonly validationChange = output<DropzoneValidationResult>();

  constructor() {
    super(inject(LoggerService), 'DropzoneDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.cleanup();
    });
    this.bindInputs(this.inputBindings);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.syncInputs(this.inputBindings);

    this.cssLoader.loadCss('dropzone.css')
      .then(() => this.scheduleLibraryLoad())
      .catch(() => this.loadLibrary());
  }

  private scheduleLibraryLoad(): void {
    if (this.isBaseDestroyed()) return;
    const windowRef = this.host.window;
    if (windowRef?.requestAnimationFrame) {
      this.pendingAnimationFrame = windowRef.requestAnimationFrame(() => {
        this.pendingAnimationFrame = null;
        this.loadLibrary();
      });
      return;
    }
    this.schedule(() => this.loadLibrary(), 16);
  }

  private schedule(callback: () => void, delay: number): void {
    const timer = setTimeout(() => {
      this.pendingTimers.delete(timer);
      if (!this.isBaseDestroyed()) callback();
    }, delay);
    this.pendingTimers.add(timer);
  }

  protected override updateOption<K extends keyof DropzoneOptions>(key: K, value: DropzoneOptions[K]): boolean {
    if (value === undefined) return false;
    return setOptionIfChanged(this.optionsManager, key, value, () => this.onOptionsUpdated());
  }

  private loadLibrary(): Promise<void> {
    if (this.isBaseDestroyed()) return Promise.resolve();
    if (this.DropzoneClass) {
      if (!this.isBaseInitialized()) this.initDropzone();
      return Promise.resolve();
    }
    if (this.libraryLoadPromise) return this.libraryLoadPromise;

    const loadPromise: Promise<void> = import('dropzone')
      .then((DropzoneModule) => {
        if (this.isBaseDestroyed()) return;
        this.DropzoneClass = DropzoneModule.default || DropzoneModule;
        if (this.DropzoneClass && typeof this.DropzoneClass.autoDiscover !== 'undefined') {
          this.DropzoneClass.autoDiscover = false;
        }
        this.initDropzone();
      })
      .catch((error) => {
        if (!this.isBaseDestroyed()) {
          this.handleErr('Failed to load Dropzone library', error as Error);
        }
      })
      .finally(() => {
        if (this.libraryLoadPromise === loadPromise) {
          this.libraryLoadPromise = null;
        }
      });
    this.libraryLoadPromise = loadPromise;
    return loadPromise;
  }

  private initDropzone(): void {
    if (!this.host.isBrowser) return;

    this.status.setLoading(true);
    this.status.setError(null);

    runSafely(
      () => this.createInstance(),
      (error) => this.handleErr('Failed to initialize dropzone', error)
    );
  }

  private reinitialize(): void {
    if (!this.host.isBrowser || !this.DropzoneClass) return;
    this.cleanup();
    this.initDropzone();
  }

  private createInstance(): void {
    const element = this.host.elementRef.nativeElement;
    let options = this.optionsManager.snapshot();
    const validation = this.validate();

    if (!validation.isValid) {
      validation.errors.forEach((err) => this.handleErr('Dropzone validation failed', new Error(err)));
      return;
    }

    if (!element || !this.DropzoneClass) {
      throw new Error('Element or Dropzone library not available');
    }

    if (!options.previewTemplate) {
      const previewEl = element.querySelector('[data-dropzone-preview-template], #preview-template, template[data-dropzone]');
      options = { ...options, previewTemplate: previewEl?.innerHTML || DEFAULT_PREVIEW_TEMPLATE };
    }

    if (!options.previewsContainer) {
      const container = element.querySelector('.dropzone-items, .dz-preview-container, [data-dropzone-previews]');
      options = { ...options, previewsContainer: (container as HTMLElement) || element };
    }

    if (options.disablePreviews === undefined) {
      options = { ...options, disablePreviews: false };
    }

    const directive = this;
    const config: DropzoneOptions = {
      ...omitDropzoneEventCallbacks(options),
      accept: (file: Dropzone.DropzoneFile, done: (error?: string) => void) => {
        options.accept ? options.accept(file, done) : done();
      },
      init(this: Dropzone): void {
        directive.attachEventCallbacks(this, options);
        directive.onInit(this);
        directive.invokeCallback(options.init, [], 'init callback failed');
      },
    };

    if (this.host.isBrowser && !element.classList.contains('dropzone')) {
      this.host.renderer.addClass(element, 'dropzone');
    }

    this.dropzoneInstance = new this.DropzoneClass(element, config);

    if (this.host.isBrowser && !element.classList.contains('dz-clickable')) {
      this.host.renderer.addClass(element, 'dz-clickable');
    }

    if (!this.dropzoneInstance?.element) {
      throw new Error('Dropzone instance creation failed');
    }

    this.status.setActive(true);
    this.status.setLoading(false);
    this.status.setError(null);
    this.markBaseInitialized();
  }

  private attachEventCallbacks(
    instance: Dropzone,
    options: DropzoneOptions
  ): void {
    instance.on('addedfile', (file: Dropzone.DropzoneFile) => {
      this.invokeCallback(options.addedfile, [file], 'addedfile callback failed');
      this.onAddedFile(file);
    });
    instance.on('removedfile', (file: Dropzone.DropzoneFile) => {
      this.onRemovedFile(file);
      this.invokeCallback(options.removedfile, [file], 'removedfile callback failed');
    });
    instance.on('thumbnail', (file: Dropzone.DropzoneFile, dataUrl: string) => {
      this.onThumbnail(file, dataUrl);
      this.invokeCallback(options.thumbnail, [file, dataUrl], 'thumbnail callback failed');
    });
    instance.on(
      'error',
      (
        file: Dropzone.DropzoneFile,
        errorMessage: string | Error,
        xhr?: XMLHttpRequest
      ) => {
        const message = errorMessage instanceof Error
          ? errorMessage.message
          : errorMessage;
        const formatted = this.formatErrorMessage(message, xhr);
        this.hideProgress(file);
        this.onFileError(file, formatted, xhr);
        this.invokeCallback(options.error, [file, formatted, xhr], 'error callback failed');
      }
    );
    instance.on(
      'errormultiple',
      (
        files: Dropzone.DropzoneFile[],
        errorMessage: string | Error,
        xhr?: XMLHttpRequest
      ) => {
        const message = errorMessage instanceof Error
          ? errorMessage.message
          : errorMessage;
        this.onErrorMultiple(files, message, xhr);
        this.invokeCallback(options.errormultiple, [files, message, xhr], 'errormultiple callback failed');
      }
    );
    instance.on('processing', (file: Dropzone.DropzoneFile) => {
      this.processingEvent.emit(file);
      this.invokeCallback(options.processing, [file], 'processing callback failed');
    });
    instance.on('processingmultiple', (files: Dropzone.DropzoneFile[]) => {
      this.processingMultipleEvent.emit(files);
      this.invokeCallback(options.processingmultiple, [files], 'processingmultiple callback failed');
    });
    instance.on(
      'uploadprogress',
      (file: Dropzone.DropzoneFile, progress: number, bytesSent: number) => {
        this._uploadProgress.set(progress);
        this.uploadProgressEvent.emit({ file, progress, bytesSent });
        this.invokeCallback(options.uploadprogress, [file, progress, bytesSent], 'uploadprogress callback failed');
      }
    );
    instance.on('maxfilesexceeded', (file: Dropzone.DropzoneFile) => {
      this.maxFilesExceededEvent.emit(file);
      this.invokeCallback(options.maxfilesexceeded, [file], 'maxfilesexceeded callback failed');
    });
    instance.on('maxfilesreached', (files: Dropzone.DropzoneFile[]) => {
      this.maxFilesReachedEvent.emit(files);
      this.invokeCallback(options.maxfilesreached, [files], 'maxfilesreached callback failed');
    });
    instance.on('queuecomplete', () => {
      this.queueCompleteEvent.emit();
      this.invokeCallback(options.queuecomplete, [], 'queuecomplete callback failed');
    });
    instance.on(
      'sending',
      (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
        this.sendingEvent.emit({ file, xhr, formData });
        this.invokeCallback(options.sending, [file, xhr, formData], 'sending callback failed');
      }
    );
    instance.on(
      'sendingmultiple',
      (files: Dropzone.DropzoneFile[], xhr: XMLHttpRequest, formData: FormData) => {
        this.sendingMultipleEvent.emit({ files, xhr, formData });
        this.invokeCallback(options.sendingmultiple, [files, xhr, formData], 'sendingmultiple callback failed');
      }
    );
    instance.on('success', (file: Dropzone.DropzoneFile, response: DropzoneResponse) => {
      this.successEvent.emit({ file, response });
      this.invokeCallback(options.success, [file], 'success callback failed');
    });
    instance.on(
      'successmultiple',
      (files: Dropzone.DropzoneFile[], response?: DropzoneResponse) => {
        this.successMultipleEvent.emit({ files, response });
        this.invokeCallback(options.successmultiple, [files, response], 'successmultiple callback failed');
      }
    );
    instance.on('complete', (file: Dropzone.DropzoneFile) => {
      this.completeEvent.emit(file);
      this.invokeCallback(options.complete, [file], 'complete callback failed');
    });
    instance.on('completemultiple', (files: Dropzone.DropzoneFile[]) => {
      this.completeMultipleEvent.emit(files);
      this.invokeCallback(options.completemultiple, [files], 'completemultiple callback failed');
    });
    instance.on('canceled', (file: Dropzone.DropzoneFile) => {
      this.canceledEvent.emit(file);
      this.invokeCallback(options.canceled, [file], 'canceled callback failed');
    });
    instance.on('canceledmultiple', (files: Dropzone.DropzoneFile[]) => {
      this.canceledMultipleEvent.emit(files);
      this.invokeCallback(options.canceledmultiple, [files], 'canceledmultiple callback failed');
    });
    instance.on('drop', (event: DragEvent) => {
      this.dropEvent.emit(event);
      this.invokeCallback(options.drop, [event], 'drop callback failed');
    });
    instance.on('dragstart', (event: DragEvent) => {
      this.dragStartEvent.emit(event);
      this.invokeCallback(options.dragstart, [event], 'dragstart callback failed');
    });
    instance.on('dragend', (event: DragEvent) => {
      this.dragEndEvent.emit(event);
      this.invokeCallback(options.dragend, [event], 'dragend callback failed');
    });
    instance.on('dragenter', (event: DragEvent) => {
      this.dragEnterEvent.emit(event);
      this.invokeCallback(options.dragenter, [event], 'dragenter callback failed');
    });
    instance.on('dragover', (event: DragEvent) => {
      this.dragOverEvent.emit(event);
      this.invokeCallback(options.dragover, [event], 'dragover callback failed');
    });
    instance.on('dragleave', (event: DragEvent) => {
      this.dragLeaveEvent.emit(event);
      this.invokeCallback(options.dragleave, [event], 'dragleave callback failed');
    });
    instance.on('paste', (event: DragEvent) => {
      this.pasteEvent.emit(toDropzoneClipboardEvent(event));
      this.invokeCallback(options.paste, [event], 'paste callback failed');
    });
    instance.on('reset', () => {
      this.onReset();
      this.invokeCallback(options.reset, [], 'reset callback failed');
    });
  }

  private invokeCallback<TArgs extends unknown[]>(
    callback: ((...args: TArgs) => void) | undefined,
    args: TArgs,
    errorMessage: string
  ): void {
    if (!callback) return;
    runSafely(() => callback(...args), (error) => this.handleErr(errorMessage, error));
  }

  private formatErrorMessage(message: string, xhr?: XMLHttpRequest): string {
    if (!xhr?.status) return xhr?.status === 0 ? `Network error: ${message}` : message;
    if (message.includes('{{statusCode}}')) return message.replace('{{statusCode}}', xhr.status.toString());
    if (!message.includes(xhr.status.toString())) return `Server responded with ${xhr.status} code. ${message}`;
    return message;
  }

  private hideProgress(file: Dropzone.DropzoneFile): void {
    if (!this.host.isBrowser || !file.previewElement) return;
    const previewEl = file.previewElement as HTMLElement;
    previewEl.querySelectorAll('.dz-progress, [data-dz-uploadprogress]').forEach((el: Element) => {
      this.host.renderer.setStyle(el as HTMLElement, 'display', 'none');
    });
  }

  private validate(): DropzoneValidationResult {
    const errors: string[] = [];
    const options = this.optionsManager.snapshot();

    if (!options.url) errors.push('URL is required');
    if (options.maxFilesize && options.maxFilesize <= 0) errors.push('Max filesize must be greater than 0');
    if (options.maxFiles && options.maxFiles <= 0) errors.push('Max files must be greater than 0');
    if (options.parallelUploads && options.parallelUploads <= 0) errors.push('Parallel uploads must be greater than 0');
    if (options.chunkSize && options.chunkSize <= 0) errors.push('Chunk size must be greater than 0');

    const result = { isValid: errors.length === 0, errors };
    this.validationChange.emit(result);
    return result;
  }

  private onInit(instance: Dropzone): void {
    this.initEvent.emit();
    this.syncFiles(instance);
  }

  private onAddedFile(file: Dropzone.DropzoneFile): void {
    this._files.update((files) => [...files, file]);
    this.updateTotalSize();
    this.addedFileEvent.emit(file);

    if (file.previewElement) {
      this.populatePreview(file.previewElement as HTMLElement, file);
      this.attachRemoveHandlers(file.previewElement as HTMLElement, file);
    }

    this.schedule(() => {
      if (file.previewElement) {
        this.populatePreview(file.previewElement as HTMLElement, file);
        this.attachRemoveHandlers(file.previewElement as HTMLElement, file);
      }
    }, 100);
  }

  private onRemovedFile(file: Dropzone.DropzoneFile): void {
    this._files.update((files) => files.filter((f) => f !== file));
    this.updateTotalSize();
    this.removedFileEvent.emit(file);
  }

  private onThumbnail(file: Dropzone.DropzoneFile, dataUrl: string): void {
    if (file.previewElement) {
      const previewEl = file.previewElement as HTMLElement;
      previewEl.querySelectorAll('[data-dz-thumbnail]').forEach((el: Element) => {
        const img = el as HTMLImageElement;
        if (img && !img.src) {
          img.src = dataUrl;
          img.alt = file.name;
        }
      });
      if (this.host.isBrowser) {
        previewEl.querySelectorAll('.dz-image').forEach((el: Element) => {
          this.host.renderer.removeStyle(el as HTMLElement, 'display');
        });
      }
    }
    this.thumbnailEvent.emit({ file, dataUrl });
  }

  private onFileError(file: Dropzone.DropzoneFile, errorMessage: string, xhr?: XMLHttpRequest): void {
    const currentFiles = this._files();
    if (!currentFiles.includes(file)) {
      this._files.update((files) => [...files, file]);
    }

    const error: DropzoneError = { code: 'FILE_ERROR', message: errorMessage, details: { file, xhr } };
    this.status.setError(error);
    this.errorEvent.emit({ file, errorMessage, xhr });

    this.schedule(() => {
      this.syncFiles();
      this.ensurePreviewVisible(file);
    }, 100);
  }

  private onErrorMultiple(files: Dropzone.DropzoneFile[], errorMessage: string, xhr?: XMLHttpRequest): void {
    const currentFiles = this._files();
    files.forEach((file) => {
      if (!currentFiles.includes(file)) {
        this._files.update((existingFiles) => [...existingFiles, file]);
      }
    });

    const error: DropzoneError = { code: 'MULTIPLE_FILES_ERROR', message: errorMessage, details: { files, xhr } };
    this.status.setError(error);
    this.errorMultipleEvent.emit({ files, errorMessage, xhr });

    this.schedule(() => {
      this.syncFiles();
      files.forEach((file) => this.ensurePreviewVisible(file));
    }, 100);
  }

  private onReset(): void {
    this.syncFiles();
    this._uploadProgress.set(0);
    this.resetEvent.emit();
  }

  private syncFiles(instance = this.dropzoneInstance): void {
    if (!instance) return;
    const allFiles = [...(instance.files || [])];
    this._files.set(allFiles);
    this.setTotalSize(allFiles.reduce((sum, file) => sum + file.size, 0));
  }

  private updateTotalSize(): void {
    const files = this._files();
    this.setTotalSize(files.reduce((sum, file) => sum + file.size, 0));
  }

  private setTotalSize(totalSize: number): void {
    if (this._totalSize() === totalSize) return;
    this._totalSize.set(totalSize);
    this.totalSizeEvent.emit(totalSize);
  }

  private populatePreview(previewEl: HTMLElement, file: Dropzone.DropzoneFile): void {
    if (!this.host.isBrowser) return;
    previewEl.querySelectorAll('[data-dz-size]').forEach((el: Element) => {
      if (!el.textContent?.trim()) {
        this.host.renderer.setProperty(el as HTMLElement, 'textContent', this.formatFileSize(file.size));
      }
    });
    previewEl.querySelectorAll('[data-dz-name]').forEach((el: Element) => {
      if (!el.textContent?.trim()) {
        this.host.renderer.setProperty(el as HTMLElement, 'textContent', file.name);
      }
    });
  }

  private attachRemoveHandlers(previewEl: HTMLElement, file: Dropzone.DropzoneFile): void {
    if (!this.host.isBrowser || !this.dropzoneInstance) return;

    previewEl.querySelectorAll('[data-dz-remove]').forEach((linkEl: Element) => {
      const removeLink = linkEl as HTMLElement;
      if (hasDropzoneRemoveHandler(removeLink)) return;

      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        const targetFile = this.findFile(file);
        if (!targetFile) return;

        const isUploading = targetFile.status === 'uploading';
        const options = this.optionsManager.snapshot();
        const confirmMsg = isUploading ? options.dictCancelUploadConfirmation : options.dictRemoveFileConfirmation;

        if (!confirmMsg || confirm(confirmMsg)) {
          this.performRemoval(targetFile);
        }
      };

      const cleanup = this.host.renderer.listen(removeLink, 'click', handler);
      this.removeHandlerCleanups.set(removeLink, cleanup);
      markDropzoneRemoveHandler(removeLink);
      this.host.renderer.removeStyle(removeLink, 'display');
    });
  }

  private clearPendingWork(): void {
    this.pendingTimers.forEach((timer) => clearTimeout(timer));
    this.pendingTimers.clear();

    if (this.pendingAnimationFrame !== null) {
      this.host.window?.cancelAnimationFrame(this.pendingAnimationFrame);
      this.pendingAnimationFrame = null;
    }

    this.removeHandlerCleanups.forEach((cleanup, element) => {
      cleanup();
      unmarkDropzoneRemoveHandler(element);
    });
    this.removeHandlerCleanups.clear();
  }

  private findFile(file: Dropzone.DropzoneFile): Dropzone.DropzoneFile | null {
    if (!this.dropzoneInstance?.files) return null;
    if (this.dropzoneInstance.files.includes(file)) return file;
    return this.dropzoneInstance.files.find((f) => f.name === file.name && f.size === file.size) || null;
  }

  private performRemoval(file: Dropzone.DropzoneFile): void {
    if (this.dropzoneInstance) {
      this.dropzoneInstance.removeFile(file);
    }
    if (this.dropzoneInstance?.files) {
      const index = this.dropzoneInstance.files.indexOf(file);
      if (index > -1) this.dropzoneInstance.files.splice(index, 1);
    }
    if (this.host.isBrowser && file.previewElement?.parentNode) {
      this.host.renderer.removeChild(file.previewElement.parentNode, file.previewElement);
    }
    this.onRemovedFile(file);
    this.syncFiles();
  }

  private ensurePreviewVisible(file: Dropzone.DropzoneFile): void {
    if (!this.dropzoneInstance || !file.previewElement || !this.host.isBrowser) return;

    const previewEl = file.previewElement as HTMLElement;
    const computedStyle = window.getComputedStyle(previewEl);

    if (computedStyle.display === 'none') {
      this.host.renderer.removeStyle(previewEl, 'display');
    }

    this.host.renderer.removeClass(previewEl, 'dz-hidden');

    if (file.status === 'error') {
      this.host.renderer.addClass(previewEl, 'dz-error');
    }

    this.host.renderer.setStyle(previewEl, 'opacity', '1');
    this.host.renderer.setStyle(previewEl, 'visibility', 'visible');
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  private cleanup(): void {
    this.clearPendingWork();
    if (this.dropzoneInstance) {
      this.dropzoneInstance.destroy();
      this.dropzoneInstance = null;
    }
    this.status.setActive(false);
    this.status.setLoading(false);
    this._files.set([]);
    this._totalSize.set(0);
    this._uploadProgress.set(0);
    this.baseCleanup();
  }

  private handleErr(message: string, error: Error): void {
    const dzError: DropzoneError = { code: 'GENERAL_ERROR', message, details: error };
    this.status.setLoading(false);
    this.status.setError(dzError);
    this.logger.error(message, 'DropzoneDirective', { error });
  }

  private onOptionsUpdated(): void {
    if (!this.isBaseInitialized()) return;
    runSafely(() => this.reinitialize(), (error) => this.handleErr('Reinitialization failed', error));
  }

  getOptions(): DropzoneOptions {
    return this.optionsManager.snapshot();
  }

  getFiles(): Dropzone.DropzoneFile[] {
    this.syncFiles();
    return this._files();
  }

  getTotalSize(): number {
    this.syncFiles();
    return this._totalSize();
  }

  getUploadProgress(): number {
    return this._uploadProgress();
  }

  getAcceptedFiles(): Dropzone.DropzoneFile[] {
    return this.dropzoneInstance?.getAcceptedFiles() || [];
  }

  getRejectedFiles(): Dropzone.DropzoneFile[] {
    return this.dropzoneInstance?.getRejectedFiles() || [];
  }

  getQueuedFiles(): Dropzone.DropzoneFile[] {
    return this.dropzoneInstance?.getQueuedFiles() || [];
  }

  getUploadingFiles(): Dropzone.DropzoneFile[] {
    return this.dropzoneInstance?.getUploadingFiles() || [];
  }

  getAllFiles(): Dropzone.DropzoneFile[] {
    return this.dropzoneInstance?.files || [];
  }

  enable(): void {
    this.dropzoneInstance?.enable();
  }

  disable(): void {
    this.dropzoneInstance?.disable();
  }

  isEnabled(): boolean {
    if (!this.host.isBrowser || !this.dropzoneInstance?.element) return false;
    return this.dropzoneInstance.element.classList.contains('dz-clickable');
  }

  getValidationResult(): DropzoneValidationResult {
    return this.validate();
  }

  updateOptions(newOptions: Partial<DropzoneOptions>): void {
    mergeOptionsIfChanged(this.optionsManager, newOptions, () => this.onOptionsUpdated());
  }

  processQueue(): void {
    this.dropzoneInstance?.processQueue();
  }

  cancelUpload(file?: Dropzone.DropzoneFile): void {
    if (!this.dropzoneInstance) return;
    if (file) {
      this.dropzoneInstance.cancelUpload(file);
    } else {
      this._files().forEach((f) => {
        if (f.status === 'uploading' || f.status === 'queued') {
          this.dropzoneInstance!.cancelUpload(f);
        }
      });
    }
  }

  removeAllFiles(): void {
    this.dropzoneInstance?.removeAllFiles();
  }

  removeFile(file: Dropzone.DropzoneFile): void {
    if (this.dropzoneInstance) {
      this.dropzoneInstance.removeFile(file);
      this.syncFiles();
    }
  }

  reset(): void {
    this.dropzoneInstance?.removeAllFiles();
  }

  refresh(): void {
    if (!this.host.isBrowser || !this.isBaseInitialized()) return;
    this.reinitialize();
  }

  async recreate(): Promise<void> {
    if (!this.host.isBrowser || this.isBaseDestroyed()) return;
    this.cleanup();
    await this.loadLibrary();
  }

  isDropzoneActive(): boolean {
    return this.status.getActive();
  }

  isDropzoneLoading(): boolean {
    return this.status.getLoading();
  }

  getError(): DropzoneError | null {
    return this.status.getError();
  }
}
