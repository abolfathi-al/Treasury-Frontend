import { IranianDateAdapter } from 'native-date-adapter';
import { toEnglish } from '@shared/pipes';

const ALT_FORMAT = 'Y/m/d';
const DATE_FORMAT = 'Y-m-d';
const DATE_REGEX = /^([0-9]{2})?[0-9]{2}(\/|-)(1[0-2]|0?[1-9])\2(3[01]|[12][0-9]|0?[1-9])$/;
const DATE_SEPARATOR = /[\/|-]/;
const GREGORIAN_YEAR_THRESHOLD = 1500;
const TIME_COMPONENTS = [0, 0, 0, 0] as const;

const PREV_ARROW_SVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17">
    <path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path>
  </svg>`;

const NEXT_ARROW_SVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17">
    <path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path>
  </svg>`;

const parseDate = (dateStr: string): Date => {
  const value = toEnglish(dateStr);
  
  if (!DATE_REGEX.test(value)) {
    return new Date(NaN);
  }
  
  const [y, m, d] = value.split(DATE_SEPARATOR).map(Number);
  
  if (y > GREGORIAN_YEAR_THRESHOLD) {
    return new Date(y, m - 1, d, ...TIME_COMPONENTS);
  }
  
  const iranianDateAdapter = new IranianDateAdapter();
  const [gy, gm, gd] = iranianDateAdapter.toGregorianDate(y, m - 1, d);
  return new Date(gy, gm, gd, ...TIME_COMPONENTS);
};

export const flatpickrConfig = {
  altFormat: ALT_FORMAT,
  dateFormat: DATE_FORMAT,
  altInput: true,
  allowInput: true,
  allowInvalidPreload: false,
  clickOpens: false,
  prevArrow: PREV_ARROW_SVG,
  nextArrow: NEXT_ARROW_SVG,
  parseDate
};
