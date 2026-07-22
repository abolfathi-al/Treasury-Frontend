import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const PERSIAN_CHAR_CODE_BASE = 0x6f0;
const DEFAULT_EMPTY_VALUE = '0';
const PERSIAN_LOCALE_PREFIX = 'fa';
const PERSIAN_DIGIT_REGEX = /\d/g;
const ARABIC_PERSIAN_DIGIT_REGEX = /[\u0660-\u0669\u06f0-\u06f9]/g;
const CHAR_MASK = 0xf;

export const toPersianDigit = (digit: string): string => {
  return String.fromCharCode(
    PERSIAN_CHAR_CODE_BASE + (digit.charCodeAt(0) - '0'.charCodeAt(0))
  );
};

export const toPersian = (value: string): string => {
  return value.replace(PERSIAN_DIGIT_REGEX, toPersianDigit);
};

export const toEnglish = (value: string): string => {
  return value.replace(ARABIC_PERSIAN_DIGIT_REGEX, (char) =>
    (char.charCodeAt(0) & CHAR_MASK).toString()
  );
};

@Pipe({
  name: 'localeNumber',
  standalone: true,
  pure: false
})
export class LocaleNumberPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(
    value: string | number | null,
    locale: string = this.translate.currentLang,
    emptyValue: string = DEFAULT_EMPTY_VALUE
  ): string {
    const stringValue = String(value || emptyValue);
    return locale.startsWith(PERSIAN_LOCALE_PREFIX) ? toPersian(stringValue) : toEnglish(stringValue);
  }
}
