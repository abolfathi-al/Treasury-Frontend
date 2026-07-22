export function runSafely<T>(
  fn: () => T,
  onError: (error: Error) => void
): T | undefined {
  try {
    return fn();
  } catch (error) {
    onError(normalizeThrownError(error));
    return undefined;
  }
}

function normalizeThrownError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return new Error(error.message);
  }

  return new Error(String(error));
}
