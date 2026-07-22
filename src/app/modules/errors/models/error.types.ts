export const ERROR_CODES = [
  '404',
  '500',
  '403',
  '401',
  '400',
  '503',
  '502',
  '504',
  'unknown',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const isErrorCode = (value: string): value is ErrorCode =>
  ERROR_CODES.some((code) => code === value);

export interface ErrorInfo {
  code: string;
  title: string;
  message: string;
  description?: string;
  icon?: string;
  illustration?: string;
  illustrationDark?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  retryAction?: () => void;
  homeAction?: () => void;
  backAction?: () => void;
}

export interface ErrorContext {
  url?: string;
  timestamp?: number;
  userAgent?: string;
  referrer?: string;
  userId?: string;
  sessionId?: string;
  errorId?: string;
  stackTrace?: string;
}

export interface ErrorReport {
  error: ErrorInfo;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'client' | 'server' | 'network' | 'validation' | 'authentication' | 'authorization';
}

export interface ErrorConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
