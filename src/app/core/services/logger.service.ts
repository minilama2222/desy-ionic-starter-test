import { Injectable } from '@angular/core';

/**
 * Severity levels supported by the application logger.
 *
 * The values intentionally match the conventional ordering so that a numeric
 * comparison can be used to filter logs by minimum severity.
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 99
}

/**
 * Thin structured-logging wrapper used across the DESY Ionic Starter.
 *
 * Centralises console output so that the team can later swap the implementation
 * for a real transport (Sentry, Datadog, custom backend) without touching
 * every call site.
 *
 * The current implementation writes to the global `console`. The prefix
 * `[desy-ionic-starter]` makes logs easy to filter in DevTools.
 *
 * Set the minimum level via `setMinLevel()` — messages below the threshold
 * are dropped. The default is `LogLevel.INFO` in production, `LogLevel.DEBUG`
 * otherwise.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private static readonly PREFIX = '[desy-ionic-starter]';
  private minLevel: LogLevel;

  constructor() {
    // Default behaviour: be verbose in dev, quiet in prod.
    this.minLevel =
      typeof location !== 'undefined' && location.hostname === 'localhost'
        ? LogLevel.DEBUG
        : LogLevel.INFO;
  }

  /** Override the minimum severity at runtime (useful for support / debug builds). */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  debug(message: string, ...context: unknown[]): void {
    this.write(LogLevel.DEBUG, 'debug', message, context);
  }

  info(message: string, ...context: unknown[]): void {
    this.write(LogLevel.INFO, 'info', message, context);
  }

  warn(message: string, ...context: unknown[]): void {
    this.write(LogLevel.WARN, 'warn', message, context);
  }

  error(message: string, error?: unknown, ...context: unknown[]): void {
    const ctx = error !== undefined ? [error, ...context] : context;
    this.write(LogLevel.ERROR, 'error', message, ctx);
  }

  private write(level: LogLevel, consoleMethod: 'debug' | 'info' | 'warn' | 'error', message: string, context: unknown[]): void {
    if (level < this.minLevel) {
      return;
    }
    const timestamp = new Date().toISOString();
    const tagged = `${LoggerService.PREFIX} ${timestamp} ${message}`;
    if (context.length === 0) {
      // eslint-disable-next-line no-console
      console[consoleMethod](tagged);
    } else {
      // eslint-disable-next-line no-console
      console[consoleMethod](tagged, ...context);
    }
  }
}