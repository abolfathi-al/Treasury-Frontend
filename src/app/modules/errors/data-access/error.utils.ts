import { ErrorInfo, ErrorContext, ErrorCode } from '../models/error.types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readRecord = (value: unknown, key: string): unknown =>
  isRecord(value) ? value[key] : undefined;

const readString = (value: unknown, key: string): string | undefined => {
  const property = readRecord(value, key);
  return typeof property === 'string' ? property : undefined;
};

const readStatus = (value: unknown): number | undefined => {
  const status = readRecord(value, 'status') ?? readRecord(value, 'statusCode');
  if (typeof status === 'number') return status;
  if (typeof status === 'string' && status.trim() !== '') {
    const parsed = Number(status);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const readErrorPayload = (value: unknown): unknown => readRecord(value, 'error');

const readErrorCode = (value: unknown): ErrorCode => {
  const code = readRecord(value, 'code');
  if (code !== undefined && code !== null) {
    return String(code) as ErrorCode;
  }

  const status = readRecord(value, 'status') ?? readRecord(value, 'statusCode');
  return status !== undefined && status !== null ? (String(status) as ErrorCode) : 'unknown';
};

/**
 * Utility functions for error handling
 */
export class ErrorUtils {
  /**
   * Check if an error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    const name = readString(error, 'name');
    const message = readString(error, 'message');
    const status = readStatus(error);
    return !navigator.onLine || 
           name === 'NetworkError' ||
           Boolean(message?.includes('Network Error')) ||
           status === 0;
  }

  /**
   * Check if an error is a timeout error
   */
  static isTimeoutError(error: unknown): boolean {
    const name = readString(error, 'name');
    const message = readString(error, 'message');
    const status = readStatus(error);
    return name === 'TimeoutError' ||
           Boolean(message?.includes('timeout')) ||
           status === 504;
  }

  /**
   * Check if an error is a client-side error (4xx)
   */
  static isClientError(error: unknown): boolean {
    const status = readStatus(error);
    return status !== undefined && status >= 400 && status < 500;
  }

  /**
   * Check if an error is a server-side error (5xx)
   */
  static isServerError(error: unknown): boolean {
    const status = readStatus(error);
    return status !== undefined && status >= 500 && status < 600;
  }

  /**
   * Extract error message from various error types
   */
  static extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    const message = readString(error, 'message');
    if (message) {
      return message;
    }

    const errorPayload = readErrorPayload(error);
    const payloadMessage = readString(errorPayload, 'message');
    if (payloadMessage) {
      return payloadMessage;
    }

    const payloadErrorMessage = readString(errorPayload, 'errorMessage');
    if (payloadErrorMessage) {
      return payloadErrorMessage;
    }

    const errors = readRecord(errorPayload, 'errors');
    if (Array.isArray(errors)) {
      return errors
        .map((entry) => readString(entry, 'errorMessage') ?? readString(entry, 'message'))
        .filter((entry): entry is string => typeof entry === 'string')
        .join(', ');
    }

    return 'خطای ناشناخته رخ داده است';
  }

  /**
   * Extract error code from various error types
   */
  static extractErrorCode(error: unknown): ErrorCode {
    return readErrorCode(error);
  }

  /**
   * Create error context from current state
   */
  static createErrorContext(additionalContext?: Partial<ErrorContext>): ErrorContext {
    return {
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      sessionId: this.generateSessionId(),
      ...additionalContext
    };
  }

  /**
   * Generate a unique session ID
   */
  static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Generate a unique error ID
   */
  static generateErrorId(): string {
    return 'err_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Format error for display
   */
  static formatErrorForDisplay(error: unknown): string {
    const message = this.extractErrorMessage(error);
    const code = this.extractErrorCode(error);
    
    if (code !== 'unknown') {
      return `[${code}] ${message}`;
    }
    
    return message;
  }

  /**
   * Check if error should be retried
   */
  static shouldRetry(error: unknown, retryCount: number, maxRetries: number = 3): boolean {
    if (retryCount >= maxRetries) {
      return false;
    }

    // Don't retry client errors (4xx) except 408, 429
    if (this.isClientError(error)) {
      const status = readStatus(error);
      return status === 408 || status === 429;
    }

    // Retry server errors (5xx) and network errors
    return this.isServerError(error) || this.isNetworkError(error) || this.isTimeoutError(error);
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  static calculateRetryDelay(retryCount: number, baseDelay: number = 1000): number {
    return Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
  }

  /**
   * Sanitize error for logging (remove sensitive information)
   */
  static sanitizeErrorForLogging(error: unknown): unknown {
    const sensitiveFields = ['password', 'token', 'authorization', 'cookie', 'session'];
    
    const sanitizeObject = (obj: unknown): unknown => {
      if (!isRecord(obj) && !Array.isArray(obj)) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      const sanitized: UnknownRecord = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeObject(value);
        }
      }
      return sanitized;
    };
    
    return sanitizeObject(error);
  }

  /**
   * Get user-friendly error message based on error type
   * Note: This method should be used with TranslateService for proper i18n support
   */
  static getUserFriendlyMessage(error: unknown): string {
    if (this.isNetworkError(error)) {
      return 'workspace.errors.general.networkError';
    }

    if (this.isTimeoutError(error)) {
      return 'workspace.errors.general.timeoutError';
    }

    if (this.isClientError(error)) {
      const status = readStatus(error);
      switch (status) {
        case 400:
          return 'workspace.errors.error400.message';
        case 401:
          return 'workspace.errors.error401.message';
        case 403:
          return 'workspace.errors.error403.message';
        case 404:
          return 'workspace.errors.error404.message';
        case 429:
          return 'workspace.errors.general.tooManyRequests';
        default:
          return 'workspace.errors.general.clientError';
      }
    }

    if (this.isServerError(error)) {
      return 'workspace.errors.error500.message';
    }

    return 'workspace.errors.general.unknownError';
  }

  /**
   * Check if error is critical and should be reported immediately
   */
  static isCriticalError(error: unknown): boolean {
    const status = readStatus(error);
    
    // Critical server errors
    if (status !== undefined && status >= 500 && status < 600) {
      return true;
    }
    
    // Critical client errors
    if (status === 401 || status === 403) {
      return true;
    }
    
    // Network errors
    if (this.isNetworkError(error) && navigator.onLine) {
      return true;
    }
    
    return false;
  }

  /**
   * Format error for display with emoji
   */
  static formatErrorWithEmoji(error: unknown): string {
    const message = this.extractErrorMessage(error);
    const code = this.extractErrorCode(error);
    
    const emojiMap: Record<string, string> = {
      '404': '🔍',
      '500': '⚠️',
      '403': '🔒',
      '401': '👤',
      '400': '❌',
      '503': '⏰',
      '502': '🌐',
      '504': '⏱️',
      'unknown': '❓'
    };
    
    const emoji = emojiMap[code] || '❓';
    return `${emoji} ${message}`;
  }

  /**
   * Get error severity level
   */
  static getErrorSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isCriticalError(error)) {
      return 'critical';
    }
    
    const status = readStatus(error);
    
    if (status !== undefined && status >= 500) return 'high';
    if (status !== undefined && status >= 400) return 'medium';
    return 'low';
  }

  /**
   * Check if error should be logged
   */
  static shouldLogError(error: unknown, logLevel: 'debug' | 'info' | 'warn' | 'error' = 'error'): boolean {
    const severity = this.getErrorSeverity(error);
    
    const levelMap = {
      'debug': ['low', 'medium', 'high', 'critical'],
      'info': ['medium', 'high', 'critical'],
      'warn': ['high', 'critical'],
      'error': ['critical']
    };
    
    return levelMap[logLevel].includes(severity);
  }

  /**
   * Create error summary for reporting
   */
  static createErrorSummary(error: unknown): {
    code: string;
    message: string;
    severity: string;
    category: string;
    timestamp: number;
    userAgent: string;
    url: string;
  } {
    return {
      code: this.extractErrorCode(error),
      message: this.extractErrorMessage(error),
      severity: this.getErrorSeverity(error),
      category: this.isClientError(error) ? 'client' : this.isServerError(error) ? 'server' : 'unknown',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
  }

  /**
   * Validate error object structure
   */
  static isValidError(error: unknown): boolean {
    return Boolean(error) && (
      typeof error === 'object' ||
      typeof error === 'string' ||
      error instanceof Error
    );
  }

  /**
   * Normalize error object to standard format
   */
  static normalizeError(error: unknown): {
    message: string;
    code: string;
    stack?: string;
    status?: number;
    statusText?: string;
  } {
    if (!this.isValidError(error)) {
      return {
        message: 'Unknown error',
        code: 'unknown'
      };
    }

    return {
      message: this.extractErrorMessage(error),
      code: this.extractErrorCode(error),
      stack: readString(error, 'stack') ?? readString(readErrorPayload(error), 'stack'),
      status: readStatus(error),
      statusText: readString(error, 'statusText')
    };
  }

  /**
   * Safely get boolean value from unknown input
   */
  static getBooleanValue(value: unknown, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return defaultValue;
  }

  /**
   * Check if value is empty or null
   */
  static isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (isRecord(value) && Object.keys(value).length === 0);
  }

  /**
   * Deep merge objects
   */
  static deepMerge<T extends UnknownRecord>(target: T, source: Partial<T>): T {
    const result: UnknownRecord = { ...target };
    
    for (const key of Object.keys(source)) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const resultValue = result[key];

        if (isRecord(sourceValue)) {
          result[key] = this.deepMerge(
            isRecord(resultValue) ? resultValue : {},
            sourceValue
          );
        } else {
          result[key] = sourceValue;
        }
      }
    }
    
    return result as T;
  }
}
