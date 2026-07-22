import { Component, contentChild, TemplateRef } from '@angular/core';

import { TEXT_INPUT_IMPORTS } from '../standard-control-imports';
import { TextualFormControl } from '../standard-control-base';

@Component({
  selector: 'vl-text-control',
  standalone: true,
  imports: TEXT_INPUT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <div class="position-relative">
          <input
            [id]="controlName"
            class="form-control"
            [class.pe-22]="buttonTpl()"
            type="text"
            vlVeloraInputmask
            [attr.maxlength]="maxLength() ?? null"
            [autocomplete]="autocomplete()"
            [readonly]="readonly()"
            [inputmaskOptions]="textInputmaskOptions()"
            [placeholder]="placeholder() | translate"
            [formControlName]="controlName"
            (blur)="onBlur()"
          />
          @if (buttonTpl()) {
          <div class="position-absolute translate-middle-y top-50 end-0 me-1">
            <ng-container *ngTemplateOutlet="buttonTpl()!" />
          </div>
          }
        </div>
        @if (helpText()) {
        <div class="form-text">{{ helpText() | translate }}</div>
        }
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class TextControlComponent extends TextualFormControl {
  readonly buttonTpl = contentChild<TemplateRef<unknown>>('button');
}
