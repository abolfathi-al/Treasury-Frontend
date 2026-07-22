import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import {
  AntiAutocompleteDirective,
  AutosizeDirective,
  DialerDirective,
  FlatpickrDirective,
  InputmaskDirective,
  MaxlengthDirective,
  PasswordMeterDirective,
  SingleOptionDirective,
  TagifyDirective,
} from '@shared/directives';
import { InvalidFeedbackComponent } from '../invalid-feedback/invalid-feedback.component';

export const TEXT_INPUT_IMPORTS = [
  NgTemplateOutlet,
  ReactiveFormsModule,
  TranslateModule,
  InputmaskDirective,
  InvalidFeedbackComponent,
];

export const MASKED_TEXT_INPUT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  InputmaskDirective,
  InvalidFeedbackComponent,
];

export const TEXTAREA_INPUT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  AutosizeDirective,
  MaxlengthDirective,
  InvalidFeedbackComponent,
];

export const SELECT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  NgSelectModule,
  InvalidFeedbackComponent,
];

export const SINGLE_SELECT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  NgSelectModule,
  SingleOptionDirective,
  InvalidFeedbackComponent,
];

export const DATE_INPUT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  FlatpickrDirective,
  InvalidFeedbackComponent,
];

export const PASSWORD_INPUT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  AntiAutocompleteDirective,
  PasswordMeterDirective,
  InvalidFeedbackComponent,
];

export const TAGIFY_INPUT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  TagifyDirective,
  InvalidFeedbackComponent,
];

export const DIALER_INPUT_IMPORTS = [
  ReactiveFormsModule,
  TranslateModule,
  DialerDirective,
  InvalidFeedbackComponent,
];
