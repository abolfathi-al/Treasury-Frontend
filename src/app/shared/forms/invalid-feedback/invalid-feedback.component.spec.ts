import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InvalidFeedbackComponent } from './invalid-feedback.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InvalidFeedbackComponent,
    TranslateModule,
  ],
  template: `
    <form [formGroup]="form">
      <input formControlName="name" />
      <vl-invalid-feedback control="name" name="Customer" />
    </form>
  `,
})
class InvalidFeedbackHostComponent {
  readonly feedback = viewChild.required(InvalidFeedbackComponent);
  readonly form = new UntypedFormGroup({
    name: new FormControl('', Validators.required),
  });
}

describe('InvalidFeedbackComponent', () => {
  let fixture: ComponentFixture<InvalidFeedbackHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvalidFeedbackHostComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(InvalidFeedbackHostComponent);
    fixture.detectChanges();
  });

  it('exposes typed template params for translated validation messages', () => {
    const component = fixture.componentInstance.feedback();
    const error = component.getErrorInfo();

    expect(error).not.toBeNull();
    expect(component.getParamText(error!, 'name')).toBe('Customer');
    expect(component.getParamText(error!, 'min')).toBe('');
  });
});
