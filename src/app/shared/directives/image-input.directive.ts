import {
  Directive,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { mergeOptionsIfChanged, runSafely, setOptionIfChanged } from './shared/directive-helpers';

export interface ImageInputOptions {
  baseClass: string;
  wrapperSelector: string;
  cancelSelector: string;
  removeSelector: string;
  hiddenInputSelector: string;
}

const DEFAULT_OPTIONS: Required<ImageInputOptions> = {
  baseClass: 'image-input',
  wrapperSelector: '.image-input-wrapper',
  cancelSelector: '[data-velora-image-input-action="cancel"]',
  removeSelector: '[data-velora-image-input-action="remove"]',
  hiddenInputSelector: 'input[type="hidden"]',
} as const;

class ImageInputStore {
  private static store = new WeakMap<HTMLElement, ImageInputDirective>();
  static set(element: HTMLElement, instance: ImageInputDirective): void { ImageInputStore.store.set(element, instance); }
  static get(element: HTMLElement): ImageInputDirective | undefined { return ImageInputStore.store.get(element); }
  static remove(element: HTMLElement): void { ImageInputStore.store.delete(element); }
}

@Directive({
  selector: '[vlVeloraImageInput]',
  exportAs: 'vlVeloraImageInput',
  standalone: true,
})
export class ImageInputDirective extends BaseDirective<ImageInputOptions, string> implements OnInit {
  private readonly host = useDirectiveHost();

  private inputElement: HTMLInputElement | null = null;
  private wrapperElement: HTMLElement | null = null;
  private cancelElement: HTMLElement | null = null;
  private removeElement: HTMLElement | null = null;
  private hiddenInputElement: HTMLInputElement | null = null;
  private inputSubscription: (() => void) | null = null;
  private cancelSubscription: (() => void) | null = null;
  private removeSubscription: (() => void) | null = null;

  private readonly _hasImage = signal<boolean>(false);
  private readonly _isProcessing = signal<boolean>(false);
  private readonly _isActivated = signal<boolean>(true);

  readonly hasImage = computed(() => this._hasImage());
  readonly isProcessing = computed(() => this._isProcessing());
  readonly isActivated = computed(() => this._isActivated());

  readonly imageInputOptions = input<ImageInputOptions>();
  readonly imageInputActivate = input<boolean>();
  readonly imageInputBaseClass = input<string>();
  readonly imageInputWrapperSelector = input<string>();
  readonly imageInputCancelSelector = input<string>();
  readonly imageInputRemoveSelector = input<string>();
  readonly imageInputHiddenInputSelector = input<string>();

  readonly imageInputChange = output<string>();
  readonly imageInputCancel = output<void>();
  readonly imageInputRemove = output<void>();
  readonly imageInputError = output<Error>();

  constructor() {
    super(inject(LoggerService), 'ImageInputDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initEffects();
  }

  private initEffects(): void {
    effect(() => {
      const options = this.imageInputOptions();
      untracked(() => { if (options !== undefined) this.mergeOptions(options); });
    });

    effect(() => {
      const activate = this.imageInputActivate();
      untracked(() => {
        if (activate !== undefined) {
          this._isActivated.set(activate);
          if (activate && !this.isBaseInitialized()) this.initImageInput();
          else if (!activate && this.isBaseInitialized()) this.cleanup();
        }
      });
    });

    this.bindInputs([
      { input: this.imageInputBaseClass, key: 'baseClass' as const },
      { input: this.imageInputWrapperSelector, key: 'wrapperSelector' as const },
      { input: this.imageInputCancelSelector, key: 'cancelSelector' as const },
      { input: this.imageInputRemoveSelector, key: 'removeSelector' as const },
      { input: this.imageInputHiddenInputSelector, key: 'hiddenInputSelector' as const },
    ]);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncImageInputs();
    if (this._isActivated() && !this.isBaseInitialized()) this.initImageInput();
  }

  private syncImageInputs(): void {
    const options = this.imageInputOptions();
    if (options !== undefined) this.mergeOptions(options);

    const baseClass = this.imageInputBaseClass();
    if (baseClass !== undefined) this.updateOption('baseClass', baseClass);

    const wrapperSelector = this.imageInputWrapperSelector();
    if (wrapperSelector !== undefined) this.updateOption('wrapperSelector', wrapperSelector);

    const cancelSelector = this.imageInputCancelSelector();
    if (cancelSelector !== undefined) this.updateOption('cancelSelector', cancelSelector);

    const removeSelector = this.imageInputRemoveSelector();
    if (removeSelector !== undefined) this.updateOption('removeSelector', removeSelector);

    const hiddenInputSelector = this.imageInputHiddenInputSelector();
    if (hiddenInputSelector !== undefined) this.updateOption('hiddenInputSelector', hiddenInputSelector);

    const activate = this.imageInputActivate();
    if (activate !== undefined) this._isActivated.set(activate);
  }

  protected override mergeOptions(options: Partial<ImageInputOptions> | undefined): boolean {
    return mergeOptionsIfChanged(this.optionsManager, options, () => this.refresh());
  }

  protected override updateOption<K extends keyof ImageInputOptions>(key: K, value: ImageInputOptions[K]): boolean {
    return setOptionIfChanged(this.optionsManager, key, value, () => this.refresh());
  }

  private initImageInput(): void {
    this.status.setLoading(true);
    runSafely(() => {
      this.queryElements();
      if (!this.inputElement) throw new Error('File input element not found');
      if (!this.wrapperElement) throw new Error('Wrapper element not found');
      this.setupListeners();
      ImageInputStore.set(this.host.elementRef.nativeElement, this);
      this.markBaseInitialized();
      this.status.setActive(true);
      this.status.setError(null);
    }, (error) => this.handleErr('Image input initialization failed', error));
    this.status.setLoading(false);
  }

  private queryElements(): void {
    const element = this.host.elementRef.nativeElement;
    const options = this.optionsManager.snapshot();
    this.inputElement = element.querySelector('input[type="file"]') as HTMLInputElement;
    this.wrapperElement = element.querySelector(options.wrapperSelector) as HTMLElement;
    this.cancelElement = element.querySelector(options.cancelSelector) as HTMLElement;
    this.removeElement = element.querySelector(options.removeSelector) as HTMLElement;
    this.hiddenInputElement = element.querySelector(options.hiddenInputSelector) as HTMLInputElement;
  }

  private setupListeners(): void {
    this.detachListeners();
    if (this.inputElement) {
      this.inputSubscription = this.host.renderer.listen(this.inputElement, 'change', (event: Event) => this.onFileChange(event));
    }
    if (this.cancelElement) {
      this.cancelSubscription = this.host.renderer.listen(this.cancelElement, 'click', () => this.cancel());
    }
    if (this.removeElement) {
      this.removeSubscription = this.host.renderer.listen(this.removeElement, 'click', () => this.remove());
    }
  }

  private detachListeners(): void {
    this.inputSubscription?.();
    this.cancelSubscription?.();
    this.removeSubscription?.();
    this.inputSubscription = null;
    this.cancelSubscription = null;
    this.removeSubscription = null;
  }

  private onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const file = target?.files?.[0];
    if (!file) return;
    this.processFile(file);
  }

  private processFile(file: File): void {
    this._isProcessing.set(true);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.handleErr('Image file processing failed', new Error('Invalid image file type'));
      this._isProcessing.set(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string | undefined;
      if (result) {
        this.displayImage(result);
        this.updateHiddenInput(result);
        this._hasImage.set(true);
        this.imageInputChange.emit(result);
      }
      this._isProcessing.set(false);
    };
    reader.onerror = () => {
      this._isProcessing.set(false);
      this.handleErr('Failed to load image', new Error('Failed to load image'));
    };
    reader.readAsDataURL(file);
  }

  private displayImage(imageData: string): void {
    if (!this.wrapperElement) return;

    const imgElement = this.wrapperElement.querySelector('img') as HTMLImageElement | null;
    if (imgElement) {
      this.host.renderer.setProperty(imgElement, 'src', imageData);
      this.host.renderer.setStyle(imgElement, 'display', 'block');
    }

    this.showActionButtons();
    this.host.renderer.setStyle(this.wrapperElement, 'display', 'block');
    this.host.renderer.removeClass(this.wrapperElement, 'hidden');
  }

  private updateHiddenInput(imageData: string): void {
    if (this.host.isBrowser && this.hiddenInputElement) {
      this.host.renderer.setProperty(this.hiddenInputElement, 'value', imageData);
    }
  }

  private showActionButtons(): void {
    if (this.cancelElement) this.host.renderer.setStyle(this.cancelElement, 'display', 'inline-block');
    if (this.removeElement) this.host.renderer.setStyle(this.removeElement, 'display', 'inline-block');
  }

  private hideActionButtons(): void {
    if (this.cancelElement) this.host.renderer.setStyle(this.cancelElement, 'display', 'none');
    if (this.removeElement) this.host.renderer.setStyle(this.removeElement, 'display', 'none');
  }

  private resetImageInput(): void {
    if (this.host.isBrowser) {
      if (this.inputElement) this.host.renderer.setProperty(this.inputElement, 'value', '');
      if (this.hiddenInputElement) this.host.renderer.setProperty(this.hiddenInputElement, 'value', '');
    }

    if (this.wrapperElement) {
      const imgElement = this.wrapperElement.querySelector('img') as HTMLImageElement | null;
      if (imgElement) {
        this.host.renderer.setProperty(imgElement, 'src', '');
        this.host.renderer.setStyle(imgElement, 'display', 'none');
      }
      this.hideActionButtons();
      this.host.renderer.setStyle(this.wrapperElement, 'display', 'block');
      this.host.renderer.removeClass(this.wrapperElement, 'hidden');
    }

    this._hasImage.set(false);
  }

  cancel(): void {
    if (!this.isBaseInitialized()) return;
    runSafely(() => {
      this.resetImageInput();
      this.imageInputCancel.emit();
    }, (error) => this.handleErr('Cancel failed', error));
  }

  remove(): void {
    if (!this.isBaseInitialized()) return;
    runSafely(() => {
      this.resetImageInput();
      this.imageInputRemove.emit();
    }, (error) => this.handleErr('Remove failed', error));
  }

  private refresh(): void {
    if (!this._isActivated()) return;
    if (!this.isBaseInitialized()) {
      this.initImageInput();
      return;
    }
    this.queryElements();
    this.setupListeners();
  }

  private handleErr(message: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.status.setError(message);
    this.logger.error(message, 'ImageInputDirective', { error: errorMessage });
    this.imageInputError.emit(error instanceof Error ? error : new Error(errorMessage));
  }

  private cleanup(): void {
    this.detachListeners();
    if (this.wrapperElement) {
      this.hideActionButtons();
      this.host.renderer.setStyle(this.wrapperElement, 'display', 'block');
      this.host.renderer.removeClass(this.wrapperElement, 'hidden');
    }
    ImageInputStore.remove(this.host.elementRef.nativeElement);
    this.inputElement = null;
    this.wrapperElement = null;
    this.cancelElement = null;
    this.removeElement = null;
    this.hiddenInputElement = null;
    this.baseCleanup();
    this.status.setError(null);
    this.status.setActive(false);
    this.status.setLoading(false);
    this._hasImage.set(false);
    this._isProcessing.set(false);
  }
}
