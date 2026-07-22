import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '@core/services/logger.service';
import { formatDate } from '@utils/format-date';

const DEFAULT_FORMAT = 'mediumDate';
const DEFAULT_LOCALE = 'fa';
const TIMEZONE_SAME = 'same';
const TIMEZONE_REGEX = /(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$/;

@Pipe({
  name: 'date',
  standalone: true,
  pure: false
})
export class ExtendDatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly logger = inject(LoggerService);

  transform(
    value: Date | string | number,
    format?: string,
    timezone?: string,
    locale?: string,
  ): string | null;
  transform(
    value: null | undefined,
    format?: string,
    timezone?: string,
    locale?: string,
  ): null;
  transform(
    value: Date | string | number | null | undefined,
    format?: string,
    timezone?: string,
    locale?: string,
  ): string | null;
  transform(
    value: Date | string | number | null | undefined,
    format = DEFAULT_FORMAT,
    timezone?: string,
    locale?: string
  ): string | null {
    if (value == null || value === '' || value !== value) {
      return null;
    }

    if (timezone === TIMEZONE_SAME) {
      const dateTimezone = ((value || '').toString().match(TIMEZONE_REGEX) || [''])[0];
      timezone = dateTimezone;
    }

    try {
      const currentLocale = locale ?? this.translate.currentLang ?? DEFAULT_LOCALE;
      return formatDate(value, format, currentLocale, timezone);
    } catch (error) {
      this.logger.error('Date formatting error', 'ExtendDatePipe', { error });
      return null;
    }
  }
}
