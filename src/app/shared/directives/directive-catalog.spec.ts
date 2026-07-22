import { Type } from '@angular/core';

import {
  AntiAutocompleteDirective,
  AutocompleteDirective,
  AutosizeDirective,
  ClipboardDirective,
  CookieAlertDirective,
  CountUpDirective,
  DialerDirective,
  DraggableDirective,
  DrawerDirective,
  DropzoneDirective,
  FlatpickrDirective,
  FullCalendarDirective,
  IfIsBrowserDirective,
  ImageInputDirective,
  InputmaskDirective,
  MaxlengthDirective,
  MenuDirective,
  NoUiSliderDirective,
  PasswordMeterDirective,
  ScrollDirective,
  ScrollTopDirective,
  SearchDirective,
  SingleOptionDirective,
  StepperDirective,
  StickyDirective,
  SwapperDirective,
  TagifyDirective,
  TinySliderDirective,
  ToggleDirective,
  TreeDirective,
  TypedDirective,
} from './index';

interface CatalogEntry {
  readonly directive: Type<unknown>;
  readonly selectors: readonly string[];
  readonly exportAs?: string;
}

interface DirectiveDefinition {
  readonly selectors: readonly (readonly string[])[];
  readonly exportAs: readonly string[] | null;
  readonly standalone: boolean;
}

const DIRECTIVE_CATALOG: readonly CatalogEntry[] = [
  { directive: AntiAutocompleteDirective, selectors: ['vlAntiAutocomplete'] },
  {
    directive: AutocompleteDirective,
    selectors: ['vlVeloraAutocomplete', 'data-velora-autocomplete'],
    exportAs: 'vlVeloraAutocomplete',
  },
  { directive: AutosizeDirective, selectors: ['vlVeloraAutosize'], exportAs: 'vlVeloraAutosize' },
  { directive: ClipboardDirective, selectors: ['vlVeloraClipboard'], exportAs: 'veloraClipboard' },
  { directive: CookieAlertDirective, selectors: ['vlVeloraCookieAlert'], exportAs: 'veloraCookieAlert' },
  { directive: CountUpDirective, selectors: ['vlVeloraCountUp'], exportAs: 'vlVeloraCountUp' },
  { directive: DialerDirective, selectors: ['vlVeloraDialer'], exportAs: 'vlVeloraDialer' },
  { directive: DraggableDirective, selectors: ['vlDraggable'], exportAs: 'vlDraggable' },
  { directive: DrawerDirective, selectors: ['vlVeloraDrawer'], exportAs: 'vlVeloraDrawer' },
  { directive: DropzoneDirective, selectors: ['vlVeloraDropzone'], exportAs: 'veloraDropzone' },
  { directive: FlatpickrDirective, selectors: ['vlVeloraFlatpickr'], exportAs: 'veloraFlatpickr' },
  {
    directive: FullCalendarDirective,
    selectors: ['vlVeloraFullCalendar'],
    exportAs: 'vlVeloraFullCalendar',
  },
  { directive: IfIsBrowserDirective, selectors: ['vlIfIsBrowser'], exportAs: 'vlIfIsBrowser' },
  { directive: ImageInputDirective, selectors: ['vlVeloraImageInput'], exportAs: 'vlVeloraImageInput' },
  { directive: InputmaskDirective, selectors: ['vlVeloraInputmask'], exportAs: 'vlVeloraInputmask' },
  { directive: MaxlengthDirective, selectors: ['vlVeloraMaxlength'], exportAs: 'veloraMaxlength' },
  { directive: MenuDirective, selectors: ['vlVeloraMenu'], exportAs: 'vlVeloraMenu' },
  { directive: NoUiSliderDirective, selectors: ['vlVeloraNoUiSlider'], exportAs: 'vlVeloraNoUiSlider' },
  {
    directive: PasswordMeterDirective,
    selectors: ['vlVeloraPasswordMeter'],
    exportAs: 'vlVeloraPasswordMeter',
  },
  { directive: ScrollDirective, selectors: ['vlVeloraScroll'], exportAs: 'vlVeloraScroll' },
  { directive: ScrollTopDirective, selectors: ['vlVeloraScrollTop'], exportAs: 'vlVeloraScrollTop' },
  { directive: SearchDirective, selectors: ['vlVeloraSearch'], exportAs: 'vlVeloraSearch' },
  { directive: SingleOptionDirective, selectors: ['vlSingleOption'], exportAs: 'vlSingleOption' },
  {
    directive: StepperDirective,
    selectors: ['vlVeloraStepper', 'data-velora-stepper'],
    exportAs: 'vlVeloraStepper',
  },
  { directive: StickyDirective, selectors: ['vlVeloraSticky'], exportAs: 'vlVeloraSticky' },
  { directive: SwapperDirective, selectors: ['vlVeloraSwapper'], exportAs: 'vlVeloraSwapper' },
  { directive: TagifyDirective, selectors: ['vlVeloraTagify'], exportAs: 'veloraTagify' },
  { directive: TinySliderDirective, selectors: ['vlVeloraTinySlider'], exportAs: 'vlVeloraTinySlider' },
  { directive: ToggleDirective, selectors: ['vlVeloraToggle'], exportAs: 'vlVeloraToggle' },
  { directive: TreeDirective, selectors: ['vlVeloraTree'], exportAs: 'vlVeloraTree' },
  { directive: TypedDirective, selectors: ['vlVeloraTyped'], exportAs: 'veloraTyped' },
];

function getDefinition(directive: Type<unknown>): DirectiveDefinition {
  return (directive as unknown as { ɵdir: DirectiveDefinition }).ɵdir;
}

describe('Master directive compatibility catalog', () => {
  it('exports all 31 supported directive classes from the shared barrel', () => {
    expect(DIRECTIVE_CATALOG.length).toBe(31);
    expect(new Set(DIRECTIVE_CATALOG.map(({ directive }) => directive)).size).toBe(31);
  });

  for (const entry of DIRECTIVE_CATALOG) {
    it(`preserves ${entry.directive.name} metadata`, () => {
      const definition = getDefinition(entry.directive);

      expect(definition.selectors).toEqual(
        entry.selectors.map((selector) => ['', selector, ''])
      );
      expect(definition.exportAs ?? []).toEqual(
        entry.exportAs ? [entry.exportAs] : []
      );
      expect(definition.standalone).toBeTrue();
    });
  }
});
