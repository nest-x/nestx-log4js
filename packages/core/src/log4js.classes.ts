import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'log4js';

@Injectable()
export class Log4jsLogger implements LoggerService {
  constructor(private readonly logger: Logger) {}

  updateContext(context?: string) {
    if (context && context.length > 0) {
      this.logger.addContext('name', context);
    } else {
      this.logger.addContext('name', '');
    }
  }

  verbose(message: any, context?: string) {
    this.updateContext(context);
    this.logger.trace(message);
  }

  debug(message: any, context?: string) {
    this.updateContext(context);
    this.logger.debug(message);
  }

  log(message: any, context?: string) {
    this.updateContext(context);
    this.logger.info(message);
  }

  warn(message: any, context?: string) {
    this.updateContext(context);
    this.logger.warn(message);
  }

  error(message: any, trace?: string, context?: string) {
    this.updateContext(context);
    this.logger.error(message);
    this.printStackTrace(trace);
  }

  static getTimestamp() {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit'
    } as const;
    return new Date(Date.now()).toLocaleString(undefined, localeStringOptions);
  }

  getTimestamp() {
    return Log4jsLogger.getTimestamp();
  }

  // nestjs logging use `process['stdout' | ...].write(message) to print log
  // But log4js use async logging clustering to print log `clustering.send(loggingEvent);`
  // to maintain the same behavior as nestjs logging, there should use error level
  printStackTrace(stackTrace?: string) {
    if (!stackTrace) {
      return;
    }
    this.logger.error(stackTrace);
  }
}
