import { inject, Injectable, OnDestroy } from '@angular/core';
import { LOCAL_STORAGE, LOCATION, NAVIGATOR, WINDOW } from '../tokens';
import { runSafely } from '@shared/directives/shared/directive-helpers';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL'
} as const;

const LOGGER_CONSTANTS = {
  STORAGE_KEY: 'app-logs',
  SESSION_ID_PREFIX: 'session_',
  LOG_ID_PREFIX: 'log_',
  ID_RANDOM_LENGTH: 9,
  SESSION_ID_DISPLAY_LENGTH: 8,
  MAX_SANITIZE_DEPTH: 10,
  SANITIZE_PLACEHOLDERS: {
    MAX_DEPTH: '[Max Depth Reached]',
    FUNCTION: '[Function]',
    CIRCULAR_REF: '[Circular Reference]',
    WINDOW: '[Window]',
    DOCUMENT: '[Document]',
    UNABLE_TO_SERIALIZE: '[Unable to serialize]',
    EMPTY_MESSAGE: 'Empty message'
  }
} as const;

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  component?: string;
  data?: unknown;
  stack?: string;
  userAgent?: string;
  url?: string;
  sessionId?: string;
}
export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  enableRemote: boolean;
  maxStorageEntries: number;
  remoteEndpoint?: string;
  sessionId?: string;
  enableStackTrace: boolean;
  enableUserAgent: boolean;
  enableUrl: boolean;
}

const DEFAULT_CONFIG: LogConfig = {
  level: LogLevel.WARN,
  enableConsole: true,
  enableStorage: true,
  enableRemote: false,
  maxStorageEntries: 1000,
  sessionId: undefined,
  enableStackTrace: true,
  enableUserAgent: true,
  enableUrl: true
};

interface SanitizedLogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  component?: string;
  data?: unknown;
  stack?: string;
  userAgent?: string;
  url?: string;
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements OnDestroy {
  private readonly navigator = inject<Navigator>(NAVIGATOR, { optional: true });
  private readonly localStorage = inject<Storage>(LOCAL_STORAGE, { optional: true });
  private readonly location = inject<Location>(LOCATION, { optional: true });
  private readonly window = inject<Window>(WINDOW, { optional: true });
  private readonly config: LogConfig = { ...DEFAULT_CONFIG };
  private readonly logs: LogEntry[] = [];
  private readonly sessionId: string = this.generateSessionId();
  private isDestroyed = false;
  private errorHandlersSetup = false;

  constructor() {
    this.initializeLogging();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  private initializeLogging(): void {
    if (this.isDestroyed) return;

    try {
      this.setupGlobalErrorHandling();
      this.config.sessionId = this.sessionId;
    } catch (error) {
      console.error('Failed to initialize logging:', error);
    }
  }

  private setupGlobalErrorHandling(): void {
    if (this.errorHandlersSetup || this.isDestroyed) return;

    try {
      const windowRef = this.window;
      if (!windowRef) return;

      windowRef.addEventListener('error', (event: ErrorEvent) => {
        this.handleGlobalError('Global Error', event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.toString()
        });
      });

      windowRef.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        this.handleGlobalError('Unhandled Promise Rejection', 'Promise rejection', {
          reason: event.reason?.toString()
        });
      });

      this.errorHandlersSetup = true;
    } catch (error) {
      console.error('Failed to setup global error handling:', error);
    }
  }

  private handleGlobalError(type: string, message: string, data: unknown): void {
    if (this.isDestroyed) return;

    try {
      this.log(LogLevel.ERROR, `${type}: ${message}`, 'Global', data);
    } catch (error) {
      console.error('Logger error handling failed:', error);
    }
  }

  private generateSessionId(): string {
    const randomPart = Math.random().toString(36).substring(2, 2 + LOGGER_CONSTANTS.ID_RANDOM_LENGTH);
    return `${LOGGER_CONSTANTS.SESSION_ID_PREFIX}${Date.now()}_${randomPart}`;
  }

  private generateLogId(): string {
    const randomPart = Math.random().toString(36).substring(2, 2 + LOGGER_CONSTANTS.ID_RANDOM_LENGTH);
    return `${LOGGER_CONSTANTS.LOG_ID_PREFIX}${Date.now()}_${randomPart}`;
  }

  private formatMessage(args: unknown[]): string {
    if (!args || args.length === 0) return '';

    return args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      
      return String(arg);
    }).join(' ');
  }

  private getStackTrace(): string | undefined {
    if (!this.config.enableStackTrace) return undefined;

    try {
      const stack = new Error().stack;
      return stack ? stack.split('\n').slice(3).join('\n') : undefined;
    } catch {
      return undefined;
    }
  }

  private log(level: LogLevel, message: string, component?: string, data?: unknown): void {
    if (this.isDestroyed || level < this.config.level) {
      return;
    }

    try {
      const entry: LogEntry = {
        id: this.generateLogId(),
        level,
        message: message || LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.EMPTY_MESSAGE,
        timestamp: new Date(),
        component,
        data,
        stack: this.getStackTrace(),
        userAgent: this.config.enableUserAgent ? this.navigator?.userAgent : undefined,
        url: this.config.enableUrl && this.location ? this.location.href : undefined,
        sessionId: this.sessionId
      };

      this.addToMemory(entry);

      if (this.config.enableConsole) {
        this.outputToConsole(entry);
      }

      if (this.config.enableStorage) {
        this.saveToStorage(entry);
      }

      if (this.config.enableRemote && this.config.remoteEndpoint) {
        this.sendToRemote(entry);
      }
    } catch (error) {
      console.error('Logger internal error:', error);
    }
  }

  private addToMemory(entry: LogEntry): void {
    try {
      this.logs.push(entry);
      this.trimLogs();
    } catch (error) {
      console.error('Failed to add log to memory:', error);
    }
  }

  private trimLogs(): void {
    try {
      if (this.logs.length > this.config.maxStorageEntries) {
        this.logs.splice(0, this.logs.length - this.config.maxStorageEntries);
      }
    } catch (error) {
      console.error('Failed to trim logs:', error);
    }
  }

  private formatConsolePrefix(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LOG_LEVEL_NAMES[entry.level];
    const component = entry.component ? `[${entry.component}]` : '';
    const sessionSuffix = entry.sessionId 
      ? `[${entry.sessionId.slice(-LOGGER_CONSTANTS.SESSION_ID_DISPLAY_LENGTH)}]` 
      : '';
    return `${timestamp} ${levelName}${component}${sessionSuffix}`;
  }

  private outputToConsole(entry: LogEntry): void {
    try {
      const prefix = this.formatConsolePrefix(entry);
      const logData = entry.data ? [entry.data] : [];

      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(prefix, entry.message, ...logData);
          break;
        case LogLevel.INFO:
          console.info(prefix, entry.message, ...logData);
          break;
        case LogLevel.WARN:
          console.warn(prefix, entry.message, ...logData);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(prefix, entry.message, ...logData);
          if (entry.stack) {
            console.error('Stack trace:', entry.stack);
          }
          break;
      }
    } catch (error) {
      console.error('Failed to output to console:', error);
    }
  }

  private sanitizeForStorage(
    value: unknown,
    visited = new WeakSet<object>(),
    depth = 0
  ): unknown {
    if (depth > LOGGER_CONSTANTS.MAX_SANITIZE_DEPTH) {
      return LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.MAX_DEPTH;
    }
    
    if (value === null || value === undefined) {
      return value;
    }
    
    if (typeof value === 'function') {
      return LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.FUNCTION;
    }
    
    if (value instanceof Date) {
      return value.toISOString();
    }
    
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack
      };
    }
    
    if (typeof value === 'object') {
      if (visited.has(value)) {
        return LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.CIRCULAR_REF;
      }
      
      const HTMLElementCtor = typeof HTMLElement === 'undefined' ? null : HTMLElement;
      const NodeCtor = typeof Node === 'undefined' ? null : Node;
      const WindowCtor = typeof Window === 'undefined' ? null : Window;
      const DocumentCtor = typeof Document === 'undefined' ? null : Document;
      const documentRef = this.window?.document;

      if (
        (HTMLElementCtor && value instanceof HTMLElementCtor) ||
        (NodeCtor && value instanceof NodeCtor)
      ) {
        return `[${value.constructor.name}]`;
      }

      if ((WindowCtor && value instanceof WindowCtor) || value === this.window) {
        return LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.WINDOW;
      }

      if ((DocumentCtor && value instanceof DocumentCtor) || value === documentRef) {
        return LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.DOCUMENT;
      }
      
      if (Array.isArray(value)) {
        visited.add(value);
        const sanitized = value.map(item => this.sanitizeForStorage(item, visited, depth + 1));
        visited.delete(value);
        return sanitized;
      }
      
      visited.add(value);
      const sanitized: Record<string, unknown> = {};
      const record = value as Record<string, unknown>;
      for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          try {
            sanitized[key] = this.sanitizeForStorage(record[key], visited, depth + 1);
          } catch {
            sanitized[key] = LOGGER_CONSTANTS.SANITIZE_PLACEHOLDERS.UNABLE_TO_SERIALIZE;
          }
        }
      }
      visited.delete(value);
      return sanitized;
    }
    
    return value;
  }

  private createSanitizedEntry(entry: LogEntry): SanitizedLogEntry {
    return {
      ...entry,
      data: entry.data ? this.sanitizeForStorage(entry.data) : undefined,
      timestamp: entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp as string
    };
  }

  private saveToStorage(entry: LogEntry): void {
    runSafely(() => {
      if (!this.localStorage) {
        return;
      }
      
      const sanitizedEntry = this.createSanitizedEntry(entry);
      const stored = this.localStorage.getItem(LOGGER_CONSTANTS.STORAGE_KEY);
      const logs: SanitizedLogEntry[] = stored ? JSON.parse(stored) : [];
      logs.push(sanitizedEntry);
      
      if (logs.length > this.config.maxStorageEntries) {
        logs.splice(0, logs.length - this.config.maxStorageEntries);
      }
      
      this.localStorage.setItem(LOGGER_CONSTANTS.STORAGE_KEY, JSON.stringify(logs));
    }, (error) => {
      console.error('Failed to save log to storage:', error);
    });
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      if (!this.config.remoteEndpoint) {
        return;
      }

      const sanitizedEntry = this.createSanitizedEntry(entry);

      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedEntry)
      });
    } catch (error) {
      console.error('Failed to send log to remote:', error);
    }
  }

  debug(message: string, component?: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, component, data);
  }

  info(message: string, component?: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, component, data);
  }

  warn(message: string, component?: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, component, data);
  }

  error(message: string, component?: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, component, data);
  }

  fatal(message: string, component?: string, data?: unknown): void {
    this.log(LogLevel.FATAL, message, component, data);
  }

  getLogs(level?: LogLevel, component?: string): LogEntry[] {
    try {
      return this.logs.filter(log => {
        if (level !== undefined && log.level !== level) return false;
        if (component && log.component !== component) return false;
        return true;
      });
    } catch (error) {
      console.error('Failed to get logs:', error);
      return [];
    }
  }

  clearLogs(): void {
    runSafely(() => {
      this.logs.length = 0;
      if (this.localStorage) {
        this.localStorage.removeItem(LOGGER_CONSTANTS.STORAGE_KEY);
      }
    }, (error) => {
      console.error('Failed to clear logs:', error);
    });
  }

  exportLogs(): string {
    try {
      const sanitizedLogs = this.logs.map(entry => this.createSanitizedEntry(entry));
      return JSON.stringify(sanitizedLogs, null, 2);
    } catch (error) {
      console.error('Failed to export logs:', error);
      return '[]';
    }
  }

  setConfig(config: Partial<LogConfig>): void {
    try {
      Object.assign(this.config, config);
    } catch (error) {
      console.error('Failed to set config:', error);
    }
  }

  getConfig(): LogConfig {
    return { ...this.config };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getStats(): { total: number; byLevel: Record<string, number>; byComponent: Record<string, number> } {
    try {
      const stats = {
        total: this.logs.length,
        byLevel: {} as Record<string, number>,
        byComponent: {} as Record<string, number>
      };

      this.logs.forEach(log => {
        const levelName = LOG_LEVEL_NAMES[log.level];
        stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1;

        const component = log.component || 'Unknown';
        stats.byComponent[component] = (stats.byComponent[component] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get stats:', error);
      return { total: 0, byLevel: {}, byComponent: {} };
    }
  }

  isReady(): boolean {
    return !this.isDestroyed && this.errorHandlersSetup;
  }

  static Error(message: string, component?: string, data?: unknown): void {
    console.error(message, component, data);
  }

  static Warn(message: string, component?: string, data?: unknown): void {
    console.warn(message, component, data);
  }

  static Info(message: string, component?: string, data?: unknown): void {
    console.info(message, component, data);
  }

  static Debug(message: string, component?: string, data?: unknown): void {
    console.debug(message, component, data);
  }
}
