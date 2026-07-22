import { Component } from '@angular/core';

import { TextualFormControl } from '../standard-control-base';
import { TEXTAREA_INPUT_IMPORTS } from '../standard-control-imports';

@Component({
  selector: 'vl-textarea-control',
  standalone: true,
  imports: TEXTAREA_INPUT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <textarea
          [id]="controlName"
          class="form-control"
          rows="3"
          vlVeloraAutosize
          vlVeloraMaxlength
          [attr.maxlength]="maxLength() ?? null"
          [autocomplete]="autocomplete()"
          [readonly]="readonly()"
          [maxlengthAlwaysShow]="showCounter()"
          [maxlengthShowOnReady]="showCounter()"
          [maxlengthAppendToParent]="true"
          [placeholder]="placeholder() | translate"
          [formControlName]="controlName"
          (blur)="onBlur()"
        ></textarea>
        @if (helpText()) {
        <div class="form-text">{{ helpText() | translate }}</div>
        }
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class TextareaControlComponent extends TextualFormControl {}
