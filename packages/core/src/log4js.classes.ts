import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'log4js';

@Injectable()
export class Log4jsLogger implements LoggerService {

  constructor(private readonly logger: Logger) {

  }


  verbose(message: any, context?: string) {
    this.logger.trace(message, { context });
  }


  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }


  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { context });
  }


}
