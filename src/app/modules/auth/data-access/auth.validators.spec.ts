import { FormControl } from '@angular/forms';

import { passwordCodePointLengthValidator } from './auth.validators';

describe('passwordCodePointLengthValidator', () => {
  it('counts Unicode code points instead of UTF-16 code units', () => {
    const fourteenEmoji = new FormControl('🔐'.repeat(14), [
      passwordCodePointLengthValidator,
    ]);
    const fifteenEmoji = new FormControl('🔐'.repeat(15), [
      passwordCodePointLengthValidator,
    ]);

    expect(fourteenEmoji.hasError('minlength')).toBeTrue();
    expect(fourteenEmoji.getError('minlength').actualLength).toBe(14);
    expect(fifteenEmoji.errors).toBeNull();
  });

  it('rejects more than 128 code points', () => {
    const control = new FormControl('a'.repeat(129), [
      passwordCodePointLengthValidator,
    ]);

    expect(control.hasError('maxlength')).toBeTrue();
    expect(control.getError('maxlength').actualLength).toBe(129);
  });
});
