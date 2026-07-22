import { formatDate, formatNumber } from '@angular/common';
import { ChangeDetectorRef, DestroyRef, inject, NgZone, Pipe, PipeTransform } from '@angular/core';
import { WINDOW } from '@core/tokens';
import { TranslateService } from '@ngx-translate/core';

const MS = 1000;
const SEC = 60;
const HOUR = 3600;
const DAY = 86400;
const MONTH = 2629746;
const YEAR = 31556952;

const THRESHOLDS = {
  SECONDS_45: 45,
  SECONDS_90: 90,
  MINUTES_45: 45,
  MINUTES_90: 90,
  HOURS_22: 22,
  HOURS_36: 36,
  DAYS_25: 25,
  DAYS_45: 45,
  DAYS_345: 345,
  DAYS_545: 545
};

const UPDATE_INTERVALS = {
  SECOND: 1,
  FEW_SECONDS: 2,
  HALF_MINUTE: 30,
  FIVE_MINUTES: 300,
  HOUR: 3600
};

type DueInFormat = 'relative' | 'relativeNear' | 'full' | 'short' | 'compact' | 'digital';

@Pipe({
  name: 'dueIn',
  standalone: true,
  pure: false
})
export class DueInPipe implements PipeTransform {
  private readonly window = inject(WINDOW);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private timer: number | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  transform(value: string | number | Date | undefined, format: DueInFormat = 'relative'): string {
    if (!value) return '';

    this.clearTimer();
    const target = new Date(value).getTime();
    const now = Date.now();
    const diff = target - now;
    const absDiff = Math.abs(diff);
    const isPast = diff < 0;
    const seconds = Math.floor(absDiff / MS);

    if (Number.isNaN(seconds)) return '';

    this.scheduleUpdate(seconds, format);

    switch (format) {
      case 'relative':
      case 'relativeNear':
        return this.formatRelative(seconds, isPast, format === 'relativeNear', new Date(target));
      case 'digital':
      case 'compact':
      case 'short':
      case 'full':
        if (isPast) return this.t('common.countdown.expired');
        return this.formatCountdown(seconds, format);
      default:
        return this.formatRelative(seconds, isPast, false, new Date(target));
    }
  }

  private formatRelative(seconds: number, isPast: boolean, justNear: boolean, date: Date): string {
    const minutes = Math.round(seconds / SEC);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30.416);
    const years = Math.round(days / 365);
    const prefix = isPast ? 'common.timeAgo' : 'common.timeLater';

    if (justNear && days > THRESHOLDS.DAYS_25) {
      return formatDate(date, 'MMM dd', this.translate.currentLang);
    }

    if (seconds <= THRESHOLDS.SECONDS_45) return this.t(`${prefix}.aFewSeconds`);
    if (seconds <= THRESHOLDS.SECONDS_90) return this.t(`${prefix}.aMinute`);
    if (minutes <= THRESHOLDS.MINUTES_45) return this.t(`${prefix}.minutes`, { minutes });
    if (minutes <= THRESHOLDS.MINUTES_90) return this.t(`${prefix}.anHour`);
    if (hours <= THRESHOLDS.HOURS_22) return this.t(`${prefix}.hours`, { hours });
    if (hours <= THRESHOLDS.HOURS_36) return this.t(`${prefix}.aDay`);
    if (days <= THRESHOLDS.DAYS_25) return this.t(`${prefix}.days`, { days });
    if (days <= THRESHOLDS.DAYS_45) return this.t(`${prefix}.aMonth`);
    if (days <= THRESHOLDS.DAYS_345) return this.t(`${prefix}.months`, { months });
    if (days <= THRESHOLDS.DAYS_545) return this.t(`${prefix}.aYear`);
    return this.t(`${prefix}.years`, { years });
  }

  private formatCountdown(totalSeconds: number, format: DueInFormat): string {
    const d = Math.floor(totalSeconds / DAY);
    const h = Math.floor((totalSeconds % DAY) / HOUR);
    const m = Math.floor((totalSeconds % HOUR) / SEC);
    const s = totalSeconds % SEC;
    const locale = this.translate.currentLang;

    switch (format) {
      case 'digital':
        const pad = (n: number) => n.toString().padStart(2, '0');
        return d > 0 ? `${d}:${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;

      case 'compact':
        const parts: string[] = [];
        if (d > 0) parts.push(this.t('common.countdown.daysShort', { days: this.num(d, locale) }));
        if (h > 0 || d > 0) parts.push(this.t('common.countdown.hoursShort', { hours: this.num(h, locale) }));
        if (m > 0 || h > 0 || d > 0) parts.push(this.t('common.countdown.minutesShort', { minutes: this.num(m, locale) }));
        parts.push(this.t('common.countdown.secondsShort', { seconds: this.num(s, locale) }));
        return parts.join(' ');

      case 'short':
        if (d > 0) return this.t('common.countdown.daysHours', { days: this.num(d, locale), hours: this.num(h, locale) });
        if (h > 0) return this.t('common.countdown.hoursMinutes', { hours: this.num(h, locale), minutes: this.num(m, locale) });
        if (m > 0) return this.t('common.countdown.minutesSeconds', { minutes: this.num(m, locale), seconds: this.num(s, locale) });
        return this.t('common.countdown.seconds', { seconds: this.num(s, locale) });

      case 'full':
      default:
        const fullParts: string[] = [];
        if (d > 0) fullParts.push(d === 1 ? this.t('common.countdown.oneDay') : this.t('common.countdown.days', { days: this.num(d, locale) }));
        if (h > 0) fullParts.push(h === 1 ? this.t('common.countdown.oneHour') : this.t('common.countdown.hours', { hours: this.num(h, locale) }));
        if (m > 0) fullParts.push(m === 1 ? this.t('common.countdown.oneMinute') : this.t('common.countdown.minutes', { minutes: this.num(m, locale) }));
        if (s > 0 || !fullParts.length) fullParts.push(s === 1 ? this.t('common.countdown.oneSecond') : this.t('common.countdown.seconds', { seconds: this.num(s, locale) }));
        return fullParts.join(this.t('common.countdown.separator'));
    }
  }

  private t(key: string, params?: Record<string, string | number>): string {
    return this.translate.instant(key, params);
  }

  private num(value: number, locale: string): string {
    return formatNumber(value, locale, '1.0-0');
  }

  private scheduleUpdate(seconds: number, format: DueInFormat): void {
    const isCountdown = ['full', 'short', 'compact', 'digital'].includes(format);
    const interval = isCountdown ? UPDATE_INTERVALS.SECOND : this.getUpdateInterval(seconds);

    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return this.window.setTimeout(() => {
          this.ngZone.run(() => this.cdr.markForCheck());
        }, interval * MS);
      }
      return null;
    });
  }

  private getUpdateInterval(seconds: number): number {
    if (seconds < SEC) return UPDATE_INTERVALS.FEW_SECONDS;
    if (seconds < HOUR) return UPDATE_INTERVALS.HALF_MINUTE;
    if (seconds < DAY) return UPDATE_INTERVALS.FIVE_MINUTES;
    return UPDATE_INTERVALS.HOUR;
  }

  private clearTimer(): void {
    if (this.timer) {
      this.window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
