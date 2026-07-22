import {
  toEnglish,
  toPersian,
  toPersianDigit,
} from './locale-number.pipe';

describe('locale number helpers', () => {
  it('converts ASCII digits to Persian digits without implicit any coercion', () => {
    expect(toPersianDigit('5')).toBe('۵');
    expect(toPersian('0123456789')).toBe('۰۱۲۳۴۵۶۷۸۹');
  });

  it('converts Arabic and Persian digits back to English digits', () => {
    expect(toEnglish('۱۲۳٤٥٦')).toBe('123456');
  });
});
