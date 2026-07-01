import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let logger: LoggerService;
  let consoleDebugSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    logger = TestBed.inject(LoggerService);

    consoleDebugSpy = spyOn(console, 'debug');
    consoleInfoSpy = spyOn(console, 'info');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(logger).toBeTruthy();
  });

  it('writes an info-level message to console.info', () => {
    logger.info('hello');
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    expect(consoleInfoSpy.calls.mostRecent().args[0]).toContain('hello');
  });

  it('writes a warning with structured context', () => {
    logger.warn('careful', { id: 42 });
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy.calls.mostRecent().args[1]).toEqual({ id: 42 });
  });

  it('includes the error object as the first context argument of error()', () => {
    const err = new Error('boom');
    logger.error('something failed', err);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy.calls.mostRecent().args[1]).toBe(err);
  });

  it('respects the minimum log level', () => {
    logger.setMinLevel(LogLevel.WARN);
    logger.debug('hidden');
    logger.info('also hidden');
    logger.warn('visible');
    logger.error('also visible');

    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});