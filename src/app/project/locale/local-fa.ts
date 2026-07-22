/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// THIS CODE IS GENERATED - DO NOT MODIFY
// See angular/tools/gulp-tasks/cldr/extract.js
const u = undefined
function plural(n: number): number {
  const i = Math.floor(Math.abs(n))
  const v = n.toString().replace(/^[^.]*\.?/, '').length
  if (i === 1 && v === 0) {
    return 1
  }
  return 4
}

export const extraLocaleFa = [
  'fa',
  [
    ['ق', 'ب'],
    ['ق.ظ.', 'ب.ظ.'],
    ['قبل\u200cازظهر', 'بعدازظهر'],
  ],
  u,
  [
    ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
    ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
    u,
    ['ش', 'ش۱', 'ش۲', 'ش۳', 'ش۴', 'ش۵', 'ج'],
  ],
  u,
  [
    ['ف', 'ا', 'خ', 'ت', 'م', 'ش', 'م', 'آ', 'آ', 'د', 'ب', 'ا'],
    [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ],
    u,
  ],
  [
    ['ف', 'ا', 'خ', 'ت', 'م', 'ش', 'م', 'آ', 'آ', 'د', 'ب', 'ا'],
    [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ],
    u,
  ],
  [
    ['ق', 'م'],
    ['ق.م.', 'م.'],
    ['قبل از هجرت', 'هجری شمسی'],
  ],
  6,
  [5, 5],
  ['y/M/d', 'd MMM y', 'd MMMM y', 'EEEE d MMMM y'],
  ['H:mm', 'H:mm:ss', 'H:mm:ss (z)', 'H:mm:ss (zzzz)'],
  ['{1}،\u200f {0}', u, '{1}، ساعت {0}', u],
  ['.', ',', ';', '%', '\u200e+', '\u200e−', 'E', '×', '‰', '∞', 'ناعدد', ':'],
  // index 3 => change currency symbol position (\u200e ¤ #,##0.00)
  ['#,##0.###', '#,##0%', '#,##0.00\u200e ¤', '#E0'],
  'IRR',
  'ریال',
  'ریال ایران',
  {
    AFN: ['؋'],
    CAD: ['$CA', '$'],
    CNY: ['¥CN', '¥'],
    HKD: ['$HK', '$'],
    IRR: ['ریال'],
    MXN: ['$MX', '$'],
    NZD: ['$NZ', '$'],
    THB: ['฿'],
    XCD: ['$EC', '$'],
  },
  'rtl',
  plural,
]
