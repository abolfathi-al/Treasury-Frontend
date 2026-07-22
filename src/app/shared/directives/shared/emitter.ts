import { OutputEmitterRef } from '@angular/core';
import { LoggerAdapter, runSafely } from './directive-helpers';

export function emitSafely<T>(
  emitter: OutputEmitterRef<T>,
  value: T,
  logger: LoggerAdapter,
  context: string,
  errorMessage: string
): void {
  runSafely(
    () => emitter.emit(value),
    (error) => logger.error(errorMessage, context, { error })
  );
}
