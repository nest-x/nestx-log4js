import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import { Logger } from 'log4js';
import { LOG4JS_LOGGER } from './log4js.constants';

@Injectable()
export class Log4jsLogger implements LoggerService {

  constructor(private readonly logger: Logger) {
  }

  updateContext(context?: string) {
    if (context && context.length > 0) {
      this.logger.addContext('name', context);
    } else {
      this.logger.removeContext('name');
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
  }


}
