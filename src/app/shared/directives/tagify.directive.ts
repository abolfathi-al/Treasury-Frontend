import {
  computed,
  Directive,
  effect,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
  untracked,
} from '@angular/core';
import type Tagify from '@yaireo/tagify';

type TagifyConstructor = typeof Tagify;

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';

import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface TagifyTag {
  value: string;
  title?: string;
  readonly?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export interface TagifyOptions {
  mode?: 'mix' | 'select';
  pattern?: string | RegExp;
  delimiters?: string;
  maxTags?: number;
  duplicates?: boolean;
  trim?: boolean;
  lowercase?: boolean;
  transformTag?: (tagData: TagifyTag) => TagifyTag;
  whitelist?: string[] | TagifyTag[];
  blacklist?: string[];
  enforceWhitelist?: boolean;
  addTagOnBlur?: boolean;
  pasteAsTags?: boolean;
  callbacks?: {
    add?: (e: CustomEvent) => void;
    remove?: (e: CustomEvent) => void;
    input?: (e: CustomEvent) => void;
    edit?: (e: CustomEvent) => void;
    invalid?: (e: CustomEvent) => void;
    click?: (e: CustomEvent) => void;
    focus?: (e: CustomEvent) => void;
    blur?: (e: CustomEvent) => void;
    keydown?: (e: CustomEvent) => void;
    dropdown?: {
      show?: (e: CustomEvent) => void;
      hide?: (e: CustomEvent) => void;
      select?: (e: CustomEvent) => void;
    };
  };
  dropdown?: {
    enabled?: number;
    maxItems?: number;
    classname?: string;
    position?: 'text' | 'all' | 'manual';
    highlightFirst?: boolean;
    closeOnSelect?: boolean;
    mapValueTo?: string;
    searchKeys?: string[];
    fuzzySearch?: boolean;
    accentedSearch?: boolean;
    suggestOnPaste?: boolean;
    noResults?: string;
    keepOpen?: boolean;
    clearOnSelect?: boolean;
  };
  tagTemplate?: (tagData: TagifyTag) => string;
  dropdownItemTemplate?: (tagData: TagifyTag) => string;
  dropdownContentTemplate?: (suggestions: TagifyTag[]) => string;
  mixTagsAllowedAfter?: RegExp;
  mixTagsInterpolator?: string[];
  mixTagsAllowedBefore?: RegExp;
  placeholder?: string;
  readOnly?: boolean;
  autoComplete?: boolean;
  originalInputValueFormat?: (values: TagifyTag[]) => string;
  keepInvalidTags?: boolean;
  skipInvalid?: boolean;
  backspace?: boolean | 'edit';
  editTags?: boolean | number;
  validate?: (tagData: TagifyTag) => boolean | string;
  hooks?: {
    beforeRemove?: (tags: TagifyTag[]) => void;
    afterRemove?: (tags: TagifyTag[]) => void;
  };
}

export interface TagifyValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TagifyError {
  code: string;
  message: string;
  details?: any;
}

@Directive({
  selector: '[vlVeloraTagify]',
  standalone: true,
  exportAs: 'veloraTagify',
})
export class TagifyDirective
  extends BaseDirective<TagifyOptions, TagifyError>
  implements OnInit, OnChanges
{
  private readonly host = useDirectiveHost();
  private readonly cssLoader = inject(CssLoaderService);

  private readonly _tags = signal<TagifyTag[]>([]);
  private readonly _value = signal<string>('');
  private tagifyCtor: TagifyConstructor | null = null;
  private tagifyLoader: Promise<TagifyConstructor> | null = null;
  private tagifyInstance: any = null;

  private readonly onOptionsChange = () => {
    if (this.isBaseInitialized()) this.reinit();
  };

  readonly tags = computed(() => this._tags());
  readonly value = computed(() => this._value());

  readonly tagifyMode = input<'mix' | 'select'>();
  readonly tagifyPattern = input<string | RegExp>();
  readonly tagifyDelimiters = input<string>();
  readonly tagifyMaxTags = input<number>();
  readonly tagifyDuplicates = input<boolean>();
  readonly tagifyTrim = input<boolean>();
  readonly tagifyLowercase = input<boolean>();
  readonly tagifyWhitelist = input<string[] | TagifyTag[]>();
  readonly tagifyBlacklist = input<string[]>();
  readonly tagifyEnforceWhitelist = input<boolean>();
  readonly tagifyAddTagOnBlur = input<boolean>();
  readonly tagifyPasteAsTags = input<boolean>();
  readonly tagifyPlaceholder = input<string>();
  readonly tagifyReadOnly = input<boolean>();
  readonly tagifyAutoComplete = input<boolean>();
  readonly tagifyEditTags = input<boolean | number>();
  readonly tagifyBackspace = input<boolean | 'edit'>();
  readonly tagifyDropdownEnabled = input<number>();
  readonly tagifyDropdownMaxItems = input<number>();
  readonly tagifyDropdownClassname = input<string>();
  readonly tagifyDropdownPosition = input<'text' | 'all' | 'manual'>();
  readonly tagifyDropdownHighlightFirst = input<boolean>();
  readonly tagifyDropdownCloseOnSelect = input<boolean>();
  readonly tagifyDropdownMapValueTo = input<string>();
  readonly tagifyDropdownSearchKeys = input<string[]>();
  readonly tagifyDropdownFuzzySearch = input<boolean>();
  readonly tagifyDropdownAccentedSearch = input<boolean>();
  readonly tagifyDropdownSuggestOnPaste = input<boolean>();
  readonly tagifyDropdownNoResults = input<string>();
  readonly tagifyDropdownKeepOpen = input<boolean>();
  readonly tagifyDropdownClearOnSelect = input<boolean>();

  readonly addEvent = output<CustomEvent>();
  readonly removeEvent = output<CustomEvent>();
  readonly inputEvent = output<CustomEvent>();
  readonly editEvent = output<CustomEvent>();
  readonly invalidEvent = output<CustomEvent>();
  readonly clickEvent = output<CustomEvent>();
  readonly focusEvent = output<CustomEvent>();
  readonly blurEvent = output<CustomEvent>();
  readonly keydownEvent = output<CustomEvent>();
  readonly dropdownShowEvent = output<CustomEvent>();
  readonly dropdownHideEvent = output<CustomEvent>();
  readonly dropdownSelectEvent = output<CustomEvent>();
  readonly validationChange = output<TagifyValidationResult>();

  constructor() {
    super(inject(LoggerService), 'TagifyDirective', {});
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.destroyTagify();
    });
    this.initEffects();
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.cssLoader
      .loadCss('tagify.css')
      .then(() => {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => this.bootstrap());
        } else {
          setTimeout(() => this.bootstrap(), 16);
        }
      })
      .catch((error) => {
        this.logger.error('Failed to load tagify CSS, proceeding anyway', 'TagifyDirective', { error });
        this.bootstrap();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.host.isBrowser) return;

    if (this.isBaseInitialized() && Object.keys(changes).length > 0) {
      this.reinit();
    }
  }

  getOptions(): TagifyOptions {
    return this.options();
  }

  getTags(): TagifyTag[] {
    return this.tags();
  }

  getValue(): string {
    return this.value();
  }

  addTags(tags: string[] | TagifyTag[]): void {
    if (this.tagifyInstance) this.tagifyInstance.addTags(tags);
  }

  removeTags(tags: string[] | TagifyTag[]): void {
    if (this.tagifyInstance) this.tagifyInstance.removeTags(tags);
  }

  removeAllTags(): void {
    if (this.tagifyInstance) this.tagifyInstance.removeAllTags();
  }

  loadSuggestions(suggestions: TagifyTag[]): void {
    if (this.tagifyInstance) {
      this.tagifyInstance.settings.whitelist = suggestions;
      this.tagifyInstance.dropdown.show();
    }
  }

  updateOptions(options: Partial<TagifyOptions>): void {
    mergeOptionsIfChanged(this.optionsManager, options, this.onOptionsChange);
  }

  refresh(): void {
    if (this.isBaseInitialized()) this.reinit();
  }

  recreate(): void {
    this.destroyTagify();
    if (this.tagifyCtor) this.initTagify();
    else this.bootstrap();
  }

  reset(): void {
    if (this.tagifyInstance) this.tagifyInstance.removeAllTags();
  }

  isTagifyActive(): boolean {
    return this.isActive();
  }

  isTagifyLoading(): boolean {
    return this.isLoading();
  }

  getError(): TagifyError | null {
    return this.error();
  }

  getValidationResult(): TagifyValidationResult {
    return this.validate();
  }

  protected override updateOption<K extends keyof TagifyOptions>(key: K, value: TagifyOptions[K]): boolean {
    if (value === undefined) return false;
    return setOptionIfChanged(this.optionsManager, key, value, this.onOptionsChange);
  }

  private initEffects(): void {
    const createEffect = <K extends keyof TagifyOptions>(
      inputFn: () => TagifyOptions[K] | undefined,
      key: K
    ) => {
      effect(() => {
        const v = inputFn();
        untracked(() => {
          if (v !== undefined) this.updateOption(key, v);
        });
      });
    };

    const createDropdownEffect = <K extends keyof NonNullable<TagifyOptions['dropdown']>>(
      inputFn: () => NonNullable<TagifyOptions['dropdown']>[K] | undefined,
      key: K
    ) => {
      effect(() => {
        const v = inputFn();
        untracked(() => {
          if (v !== undefined) this.updateDropdownOption(key, v);
        });
      });
    };

    createEffect(() => this.tagifyMode(), 'mode');
    createEffect(() => this.tagifyPattern(), 'pattern');
    createEffect(() => this.tagifyDelimiters(), 'delimiters');
    createEffect(() => this.tagifyMaxTags(), 'maxTags');
    createEffect(() => this.tagifyDuplicates(), 'duplicates');
    createEffect(() => this.tagifyTrim(), 'trim');
    createEffect(() => this.tagifyLowercase(), 'lowercase');
    createEffect(() => this.tagifyWhitelist(), 'whitelist');
    createEffect(() => this.tagifyBlacklist(), 'blacklist');
    createEffect(() => this.tagifyEnforceWhitelist(), 'enforceWhitelist');
    createEffect(() => this.tagifyAddTagOnBlur(), 'addTagOnBlur');
    createEffect(() => this.tagifyPasteAsTags(), 'pasteAsTags');
    createEffect(() => this.tagifyPlaceholder(), 'placeholder');
    createEffect(() => this.tagifyReadOnly(), 'readOnly');
    createEffect(() => this.tagifyAutoComplete(), 'autoComplete');
    createEffect(() => this.tagifyEditTags(), 'editTags');
    createEffect(() => this.tagifyBackspace(), 'backspace');

    createDropdownEffect(() => this.tagifyDropdownEnabled(), 'enabled');
    createDropdownEffect(() => this.tagifyDropdownMaxItems(), 'maxItems');
    createDropdownEffect(() => this.tagifyDropdownClassname(), 'classname');
    createDropdownEffect(() => this.tagifyDropdownPosition(), 'position');
    createDropdownEffect(() => this.tagifyDropdownHighlightFirst(), 'highlightFirst');
    createDropdownEffect(() => this.tagifyDropdownCloseOnSelect(), 'closeOnSelect');
    createDropdownEffect(() => this.tagifyDropdownMapValueTo(), 'mapValueTo');
    createDropdownEffect(() => this.tagifyDropdownSearchKeys(), 'searchKeys');
    createDropdownEffect(() => this.tagifyDropdownFuzzySearch(), 'fuzzySearch');
    createDropdownEffect(() => this.tagifyDropdownAccentedSearch(), 'accentedSearch');
    createDropdownEffect(() => this.tagifyDropdownSuggestOnPaste(), 'suggestOnPaste');
    createDropdownEffect(() => this.tagifyDropdownNoResults(), 'noResults');
    createDropdownEffect(() => this.tagifyDropdownKeepOpen(), 'keepOpen');
    createDropdownEffect(() => this.tagifyDropdownClearOnSelect(), 'clearOnSelect');
  }

  private updateDropdownOption<K extends keyof NonNullable<TagifyOptions['dropdown']>>(
    key: K,
    value: NonNullable<TagifyOptions['dropdown']>[K]
  ): void {
    const current = this.optionsManager.snapshot();
    const dropdown = { ...(current.dropdown ?? {}), [key]: value };
    setOptionIfChanged(this.optionsManager, 'dropdown', dropdown, this.onOptionsChange);
  }

  private bootstrap(): void {
    this.loadTagify()
      .then(() => {
        if (this.isBaseDestroyed() || !this.host.isBrowser) return;
        this.initTagify();
      })
      .catch((error) => this.handleErr('Failed to load Tagify library', error as Error));
  }

  private loadTagify(): Promise<TagifyConstructor> {
    if (this.tagifyLoader) return this.tagifyLoader;

    this.tagifyLoader = import('@yaireo/tagify').then((TagifyModule) => {
      const ctor = (TagifyModule.default || TagifyModule) as TagifyConstructor;
      this.tagifyCtor = ctor;
      return ctor;
    });

    return this.tagifyLoader;
  }

  private initTagify(): void {
    this.status.setLoading(true);
    this.status.setError(null);
    this.execOp(() => this.createInstance(), 'Failed to initialize Tagify');
  }

  private reinit(): void {
    this.destroyTagify();
    if (this.tagifyCtor) this.initTagify();
    else this.bootstrap();
  }

  private createInstance(): void {
    const element = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const options = this.optionsManager.snapshot();
    const validation = this.validate();

    if (!validation.isValid) {
      const message = validation.errors.join(', ') || 'Invalid Tagify configuration';
      this.handleErr('Tagify validation failed', new Error(message));
      this.status.setLoading(false);
      return;
    }

    if (!element) {
      this.handleErr('Failed to create Tagify instance', new Error('Element not available'));
      return;
    }

    const ctor = this.tagifyCtor;
    if (!ctor) {
      this.handleErr('Failed to create Tagify instance', new Error('Tagify library not loaded'));
      return;
    }

    const tagifyConfig: any = {
      ...options,
      callbacks: {
        add: (e: CustomEvent) => this.handleAdd(e),
        remove: (e: CustomEvent) => this.handleRemove(e),
        input: (e: CustomEvent) => this.handleInput(e),
        edit: (e: CustomEvent) => this.handleEdit(e),
        invalid: (e: CustomEvent) => this.handleInvalid(e),
        click: (e: CustomEvent) => this.handleClick(e),
        focus: (e: CustomEvent) => this.handleFocus(e),
        blur: (e: CustomEvent) => this.handleBlur(e),
        keydown: (e: CustomEvent) => this.handleKeydown(e),
        'dropdown:show': (e: CustomEvent) => this.handleDropdownShow(e),
        'dropdown:hide': (e: CustomEvent) => this.handleDropdownHide(e),
        'dropdown:select': (e: CustomEvent) => this.handleDropdownSelect(e),
        ...options.callbacks,
      },
    };

    this.tagifyInstance = new ctor(element, tagifyConfig);
    this.status.setActive(true);
    this.status.setLoading(false);
    this.markBaseInitialized();

    this.updateTagsState();
  }

  private destroyTagify(): void {
    if (!this.tagifyInstance) return;

    this.execOp(() => {
      this.tagifyInstance.destroy();
      this.tagifyInstance = null;
      this.status.setActive(false);
      this.baseCleanup();
    }, 'Failed to destroy Tagify instance');
  }

  private updateTagsState(): void {
    if (this.tagifyInstance) {
      const tags = this.tagifyInstance.value || [];
      const value = this.tagifyInstance.DOM.originalInput.value || '';

      this._tags.set(tags);
      this._value.set(value);
    }
  }

  private validate(): TagifyValidationResult {
    const errors: string[] = [];
    const options = this.optionsManager.snapshot();

    if (options.maxTags && options.maxTags < 0) {
      errors.push('maxTags must be a positive number');
    }

    if (options.delimiters && typeof options.delimiters !== 'string') {
      errors.push('delimiters must be a string');
    }

    if (
      options.pattern &&
      typeof options.pattern !== 'string' &&
      !(options.pattern instanceof RegExp)
    ) {
      errors.push('pattern must be a string or RegExp');
    }

    return { isValid: errors.length === 0, errors };
  }

  protected override runOperation(action: () => void, message: string): void {
    runSafely(action, (error) => this.handleErr(message, error));
  }

  private execOp(action: () => void, message: string): void {
    runSafely(action, (error) => this.handleErr(message, error));
  }

  private handleErr(message: string, error: Error): void {
    const tagifyError: TagifyError = {
      code: 'TAGIFY_ERROR',
      message,
      details: error,
    };

    this.status.setError(tagifyError);
    this.status.setLoading(false);
    this.logger.error(message, 'TagifyDirective', { error: error.message });
  }

  private handleAdd(e: CustomEvent): void {
    this.execOp(() => {
      this.addEvent.emit(e);
      this.updateTagsState();
    }, 'Failed to handle add event');
  }

  private handleRemove(e: CustomEvent): void {
    this.execOp(() => {
      this.removeEvent.emit(e);
      this.updateTagsState();
    }, 'Failed to handle remove event');
  }

  private handleInput(e: CustomEvent): void {
    this.execOp(() => this.inputEvent.emit(e), 'Failed to handle input event');
  }

  private handleEdit(e: CustomEvent): void {
    this.execOp(() => this.editEvent.emit(e), 'Failed to handle edit event');
  }

  private handleInvalid(e: CustomEvent): void {
    this.execOp(() => {
      this.invalidEvent.emit(e);
      this.logger.error('Invalid tag', 'TagifyDirective', { tag: e.detail });
    }, 'Failed to handle invalid event');
  }

  private handleClick(e: CustomEvent): void {
    this.execOp(() => this.clickEvent.emit(e), 'Failed to handle click event');
  }

  private handleFocus(e: CustomEvent): void {
    this.execOp(() => this.focusEvent.emit(e), 'Failed to handle focus event');
  }

  private handleBlur(e: CustomEvent): void {
    this.execOp(() => this.blurEvent.emit(e), 'Failed to handle blur event');
  }

  private handleKeydown(e: CustomEvent): void {
    this.execOp(() => this.keydownEvent.emit(e), 'Failed to handle keydown event');
  }

  private handleDropdownShow(e: CustomEvent): void {
    this.execOp(() => this.dropdownShowEvent.emit(e), 'Failed to handle dropdown show event');
  }

  private handleDropdownHide(e: CustomEvent): void {
    this.execOp(() => this.dropdownHideEvent.emit(e), 'Failed to handle dropdown hide event');
  }

  private handleDropdownSelect(e: CustomEvent): void {
    this.execOp(() => this.dropdownSelectEvent.emit(e), 'Failed to handle dropdown select event');
  }
}
