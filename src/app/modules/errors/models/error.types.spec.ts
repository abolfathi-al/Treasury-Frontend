import { isErrorCode } from './error.types';

describe('error type helpers', () => {
  it('narrows supported error route codes', () => {
    expect(isErrorCode('404')).toBeTrue();
    expect(isErrorCode('not-found')).toBeFalse();
  });
});
