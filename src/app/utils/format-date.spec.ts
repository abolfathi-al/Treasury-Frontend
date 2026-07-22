import { isDate, toDate } from './format-date';

describe('format-date toDate', () => {
  it('treats numeric strings as millisecond timestamps', () => {
    expect(toDate('1234', 'en-US').getTime()).toBe(1234);
  });

  it('rejects invalid date strings', () => {
    expect(() => toDate('1234hello', 'en-US')).toThrowError(
      'Unable to convert "1234hello" into a date'
    );
  });

  it('narrows real Date instances without accepting date-like objects', () => {
    expect(isDate(new Date(1234))).toBeTrue();
    expect(isDate({ getTime: () => 1234 })).toBeFalse();
  });
});
