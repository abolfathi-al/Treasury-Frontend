import { Component } from '@angular/core';

import { TAGIFY_INPUT_IMPORTS } from '../standard-control-imports';
import { TagsFormControl } from '../standard-control-base';

@Component({
  selector: 'vl-tags-control',
  standalone: true,
  imports: TAGIFY_INPUT_IMPORTS,
  template: `
    @if (control()) {
    <ng-container [formGroup]="form">
      <div class="form-group">
        @if (label()) {
        <label class="form-label" [class.required]="required()" [for]="controlName">{{ label() | translate }}</label>
        }
        <input
          [id]="controlName"
          class="form-control"
          type="text"
          vlVeloraTagify
          [tagifyWhitelist]="tagifyWhitelist()"
          [tagifyMaxTags]="tagifyMaxTags()"
          [tagifyEnforceWhitelist]="enforceWhitelist()"
          [tagifyDuplicates]="duplicates()"
          [tagifyTrim]="trimTags()"
          [tagifyPlaceholder]="(tagPlaceholder() || placeholder()) | translate"
          [tagifyDropdownEnabled]="dropdownEnabled()"
          [tagifyReadOnly]="readonly()"
          [placeholder]="placeholder() | translate"
          [formControlName]="controlName"
          (inputEvent)="emitCurrentTagValue()"
          (addEvent)="emitCurrentTagValue()"
          (removeEvent)="emitCurrentTagValue()"
          (blur)="onBlur()"
        />
        @if (helpText()) {
        <div class="form-text">{{ helpText() | translate }}</div>
        }
        <vl-invalid-feedback [control]="controlName" [name]="label()" />
      </div>
    </ng-container>
    }
  `,
})
export class TagsControlComponent extends TagsFormControl {}
