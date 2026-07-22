import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { WINDOW } from '@core/tokens';
import { LoggerService } from '@core/services';
import { ErrorInfo, ErrorContext, ErrorReport, ErrorCode, ErrorConfig } from '../models/error.types';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly window = inject(WINDOW);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);

  // Signals for reactive state management
  private readonly _currentError = signal<ErrorInfo | null>(null);
  private readonly _errorHistory = signal<ErrorReport[]>([]);
  private readonly _isErrorVisible = signal<boolean>(false);
  private readonly _retryCount = signal<number>(0);

  // Computed values
  readonly currentError = computed(() => this._currentError());
  readonly errorHistory = computed(() => this._errorHistory());
  readonly isErrorVisible = computed(() => this._isErrorVisible());
  readonly retryCount = computed(() => this._retryCount());

  // Behavior subjects for observables
  private readonly errorSubject = new BehaviorSubject<ErrorInfo | null>(null);
  readonly error$ = this.errorSubject.asObservable();

  // Error configuration
  private readonly config: ErrorConfig = {
    enableLogging: true,
    enableReporting: true,
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    logLevel: 'error'
  };

  // Error tracking
  private readonly _errorCount = signal<number>(0);
  private readonly _lastError = signal<ErrorReport | null>(null);
  private readonly _isRetrying = signal<boolean>(false);

  // Additional computed values
  readonly errorCount = computed(() => this._errorCount());
  readonly lastError = computed(() => this._lastError());
  readonly isRetrying = computed(() => this._isRetrying());

  // Predefined error configurations
  private readonly errorConfigs: Record<ErrorCode, ErrorInfo> = {
    '404': {
      code: '404',
      title: 'صفحه یافت نشد',
      message: 'متأسفانه صفحه مورد نظر یافت نشد',
      description: 'صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است',
      icon: 'search',
      illustration: 'assets/media/illustrations/sigma-1/18.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/18-dark.webp',
      showRetry: false,
      showHome: true,
      showBack: true,
      homeAction: () => this.router.navigate(['/dashboard']),
      backAction: () => this.window.history.back()
    },
    '500': {
      code: '500',
      title: 'خطای سرور',
      message: 'خطایی در سرور رخ داده است',
      description: 'لطفاً بعداً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید',
      icon: 'warning',
      illustration: 'assets/media/auth/500-error.webp',
      illustrationDark: 'assets/media/auth/500-error-dark.webp',
      showRetry: true,
      showHome: true,
      showBack: false,
      retryAction: () => this.retry(),
      homeAction: () => this.router.navigate(['/dashboard'])
    },
    '403': {
      code: '403',
      title: 'دسترسی ممنوع',
      message: 'شما مجاز به دسترسی به این صفحه نیستید',
      description: 'لطفاً با مدیر سیستم تماس بگیرید',
      icon: 'lock',
      illustration: 'assets/media/illustrations/sigma-1/19.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/19-dark.webp',
      showRetry: false,
      showHome: true,
      showBack: true,
      homeAction: () => this.router.navigate(['/dashboard']),
      backAction: () => this.window.history.back()
    },
    '401': {
      code: '401',
      title: 'احراز هویت مورد نیاز',
      message: 'لطفاً ابتدا وارد شوید',
      description: 'برای دسترسی به این صفحه باید وارد سیستم شوید',
      icon: 'user',
      illustration: 'assets/media/illustrations/sigma-1/20.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/20-dark.webp',
      showRetry: false,
      showHome: false,
      showBack: true,
      backAction: () => this.router.navigate(['/auth/login'])
    },
    '400': {
      code: '400',
      title: 'درخواست نامعتبر',
      message: 'درخواست شما نامعتبر است',
      description: 'لطفاً اطلاعات را بررسی کرده و دوباره تلاش کنید',
      icon: 'exclamation',
      illustration: 'assets/media/illustrations/sigma-1/21.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/21-dark.webp',
      showRetry: true,
      showHome: true,
      showBack: true,
      retryAction: () => this.retry(),
      homeAction: () => this.router.navigate(['/dashboard']),
      backAction: () => this.window.history.back()
    },
    '503': {
      code: '503',
      title: 'سرویس در دسترس نیست',
      message: 'سرویس موقتاً در دسترس نیست',
      description: 'لطفاً بعداً دوباره تلاش کنید',
      icon: 'clock',
      illustration: 'assets/media/illustrations/sigma-1/22.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/22-dark.webp',
      showRetry: true,
      showHome: true,
      showBack: false,
      retryAction: () => this.retry(),
      homeAction: () => this.router.navigate(['/dashboard'])
    },
    '502': {
      code: '502',
      title: 'خطای Gateway',
      message: 'خطایی در ارتباط با سرور رخ داده است',
      description: 'لطفاً بعداً دوباره تلاش کنید',
      icon: 'wifi',
      illustration: 'assets/media/illustrations/sigma-1/23.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/23-dark.webp',
      showRetry: true,
      showHome: true,
      showBack: false,
      retryAction: () => this.retry(),
      homeAction: () => this.router.navigate(['/dashboard'])
    },
    '504': {
      code: '504',
      title: 'زمان اتصال به پایان رسید',
      message: 'سرور پاسخ نمی‌دهد',
      description: 'لطفاً اتصال اینترنت خود را بررسی کنید',
      icon: 'time',
      illustration: 'assets/media/illustrations/sigma-1/24.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/24-dark.webp',
      showRetry: true,
      showHome: true,
      showBack: false,
      retryAction: () => this.retry(),
      homeAction: () => this.router.navigate(['/dashboard'])
    },
    'unknown': {
      code: 'unknown',
      title: 'خطای ناشناخته',
      message: 'خطایی رخ داده است',
      description: 'لطفاً با پشتیبانی تماس بگیرید',
      icon: 'question',
      illustration: 'assets/media/illustrations/sigma-1/25.webp',
      illustrationDark: 'assets/media/illustrations/sigma-1/25-dark.webp',
      showRetry: true,
      showHome: true,
      showBack: true,
      retryAction: () => this.retry(),
      homeAction: () => this.router.navigate(['/dashboard']),
      backAction: () => this.window.history.back()
    }
  };

  // Show error
  showError(errorCode: ErrorCode, context?: Partial<ErrorContext>): void {
    const errorInfo = this.errorConfigs[errorCode];
    const errorContext: ErrorContext = {
        url: this.window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      ...context
    };

    // Create error report
    const errorReport: ErrorReport = {
      error: errorInfo,
      context: errorContext,
      severity: this.getSeverity(errorCode),
      category: this.getCategory(errorCode)
    };

    // Update signals
    this._currentError.set(errorInfo);
    this._isErrorVisible.set(true);
    this._errorHistory.update(history => [...history, errorReport]);
    this._errorCount.update(count => count + 1);
    this._lastError.set(errorReport);

    // Update observable
    this.errorSubject.next(errorInfo);

    // Log error
    if (this.config.enableLogging) {
      this.logError(errorReport);
    }

    // Report error
    if (this.config.enableReporting) {
      this.reportError(errorReport);
    }
  }

  // Hide error
  hideError(): void {
    this._currentError.set(null);
    this._isErrorVisible.set(false);
    this.errorSubject.next(null);
  }

  // Retry action
  retry(): void {
    const currentRetryCount = this._retryCount();
    
    if (currentRetryCount < this.config.maxRetries) {
      this._retryCount.update(count => count + 1);
      this._isRetrying.set(true);
      
      setTimeout(() => {
        this._isRetrying.set(false);
        this.window.location.reload();
      }, this.config.retryDelay);
    } else {
      this.showError('unknown');
    }
  }

  // Reset retry count
  resetRetryCount(): void {
    this._retryCount.set(0);
  }

  // Get error by code
  getErrorByCode(code: ErrorCode): ErrorInfo {
    return this.errorConfigs[code];
  }

  // Navigate to error page
  navigateToError(errorCode: ErrorCode, context?: Partial<ErrorContext>): void {
    this.showError(errorCode, context);
    this.router.navigate(['/errors', errorCode]);
  }

  // Clear error history
  clearErrorHistory(): void {
    this._errorHistory.set([]);
    this._errorCount.set(0);
  }

  // Get error by severity
  getErrorsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ErrorReport[] {
    return this._errorHistory().filter(report => report.severity === severity);
  }

  // Get errors by category
  getErrorsByCategory(category: 'client' | 'server' | 'network' | 'validation' | 'authentication' | 'authorization'): ErrorReport[] {
    return this._errorHistory().filter(report => report.category === category);
  }

  // Get recent errors (last N errors)
  getRecentErrors(count: number = 10): ErrorReport[] {
    return this._errorHistory().slice(-count);
  }

  // Check if there are any critical errors
  hasCriticalErrors(): boolean {
    return this.getErrorsBySeverity('critical').length > 0;
  }

  // Get error rate (errors per minute)
  getErrorRate(): number {
    const history = this._errorHistory();
    if (history.length === 0) return 0;
    
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentErrors = history.filter(report => report.context.timestamp && report.context.timestamp > oneMinuteAgo);
    
    return recentErrors.length;
  }

  // Get error statistics
  getErrorStatistics(): { total: number; byCode: Record<string, number>; bySeverity: Record<string, number> } {
    const history = this._errorHistory();
    const byCode: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    history.forEach(report => {
      byCode[report.error.code] = (byCode[report.error.code] || 0) + 1;
      bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
    });

    return {
      total: history.length,
      byCode,
      bySeverity
    };
  }

  // Private methods
  private getSeverity(errorCode: ErrorCode): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<ErrorCode, 'low' | 'medium' | 'high' | 'critical'> = {
      '404': 'low',
      '400': 'low',
      '401': 'medium',
      '403': 'medium',
      '500': 'high',
      '502': 'high',
      '503': 'high',
      '504': 'high',
      'unknown': 'critical'
    };
    return severityMap[errorCode];
  }

  private getCategory(errorCode: ErrorCode): 'client' | 'server' | 'network' | 'validation' | 'authentication' | 'authorization' {
    const categoryMap: Record<ErrorCode, 'client' | 'server' | 'network' | 'validation' | 'authentication' | 'authorization'> = {
      '404': 'client',
      '400': 'validation',
      '401': 'authentication',
      '403': 'authorization',
      '500': 'server',
      '502': 'network',
      '503': 'server',
      '504': 'network',
      'unknown': 'client'
    };
    return categoryMap[errorCode];
  }

  private logError(errorReport: ErrorReport): void {
    const logMessage = `Error ${errorReport.error.code}: ${errorReport.error.message}`;
    
    switch (this.config.logLevel) {
      case 'debug':
        this.logger.debug(logMessage, 'ErrorService', { errorReport });
        break;
      case 'info':
        this.logger.info(logMessage, 'ErrorService', { errorReport });
        break;
      case 'warn':
        this.logger.warn(logMessage, 'ErrorService', { errorReport });
        break;
      case 'error':
        this.logger.error(logMessage, 'ErrorService', { errorReport });
        break;
    }
  }

  private reportError(errorReport: ErrorReport): void {
    // In a real application, this would send the error to a logging service
    // For now, we'll just store it in localStorage for debugging
    try {
      const reports = JSON.parse(localStorage.getItem('errorReports') || '[]');
      reports.push(errorReport);
      localStorage.setItem('errorReports', JSON.stringify(reports.slice(-100))); // Keep only last 100 reports
    } catch (error) {
      this.logger.error('Failed to store error report', 'ErrorService', { error });
    }
  }
}
