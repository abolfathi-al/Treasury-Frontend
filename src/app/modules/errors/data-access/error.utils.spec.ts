import { ErrorUtils } from './error.utils';

describe('ErrorUtils', () => {
  it('extracts nested server validation messages', () => {
    expect(
      ErrorUtils.extractErrorMessage({
        error: {
          errors: [
            { errorMessage: 'Name is required' },
            { message: 'Email is invalid' },
          ],
        },
      })
    ).toBe('Name is required, Email is invalid');
  });

  it('retries rate-limited client errors but not ordinary client errors', () => {
    expect(ErrorUtils.shouldRetry({ status: 429 }, 0)).toBeTrue();
    expect(ErrorUtils.shouldRetry({ status: 400 }, 0)).toBeFalse();
  });

  it('redacts sensitive nested fields for logging', () => {
    expect(
      ErrorUtils.sanitizeErrorForLogging({
        message: 'failed',
        meta: {
          accessToken: 'secret',
          profile: { name: 'Ada' },
        },
      })
    ).toEqual({
      message: 'failed',
      meta: {
        accessToken: '[REDACTED]',
        profile: { name: 'Ada' },
      },
    });
  });

  it('normalizes nested error payload status and stack data', () => {
    expect(
      ErrorUtils.normalizeError({
        error: {
          message: 'Server failed',
          stack: 'server-stack',
        },
        statusCode: 500,
        statusText: 'Server Error',
      })
    ).toEqual({
      message: 'Server failed',
      code: '500',
      stack: 'server-stack',
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('deep merges nested records without replacing sibling fields', () => {
    const target: Record<string, unknown> = {
      retry: { max: 3, delay: 1000 },
      flags: ['report'],
    };
    const source: Record<string, unknown> = {
      retry: { delay: 2000 },
    };

    const result = ErrorUtils.deepMerge(
      target,
      source
    );

    expect(result).toEqual({
      retry: { max: 3, delay: 2000 },
      flags: ['report'],
    });
  });
});
