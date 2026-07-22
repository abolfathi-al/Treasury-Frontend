import { Injectable, signal, computed, inject } from '@angular/core';
import { LoggerService } from './logger.service';

export type ProfilerLogLevel = 'log' | 'warn' | 'error' | 'info';

export interface ProfilerLog {
  id: string;
  message: string;
  timestamp: Date;
  level: ProfilerLogLevel;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilerService {
  private readonly logger = inject(LoggerService);
  private readonly _logs = signal<ProfilerLog[]>([]);
  private readonly _isEnabled = signal<boolean>(true);

  readonly logs = computed(() => this._logs());
  readonly isEnabled = computed(() => this._isEnabled());
  readonly logCount = computed(() => this._logs().length);

  add(message: string, level: ProfilerLogLevel = 'log'): void {
    if (!this._isEnabled()) {
      return;
    }

    const log: ProfilerLog = {
      id: this.generateId(),
      message,
      timestamp: new Date(),
      level
    };

    this._logs.update(logs => [...logs, log]);
    this.writeLog(message, level, log);
  }

  info(message: string): void {
    this.add(message, 'info');
  }

  warn(message: string): void {
    this.add(message, 'warn');
  }

  error(message: string): void {
    this.add(message, 'error');
  }

  setEnabled(enabled: boolean): void {
    this._isEnabled.set(enabled);
  }

  clear(): void {
    this._logs.set([]);
  }

  getLogsByLevel(level: ProfilerLogLevel): ProfilerLog[] {
    return this._logs().filter(log => log.level === level);
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private writeLog(message: string, level: ProfilerLogLevel, log: ProfilerLog): void {
    switch (level) {
      case 'error':
        this.logger.error(message, 'Profiler', log);
        return;
      case 'warn':
        this.logger.warn(message, 'Profiler', log);
        return;
      case 'info':
        this.logger.info(message, 'Profiler', log);
        return;
      case 'log':
        this.logger.debug(message, 'Profiler', log);
        return;
    }
  }
}
