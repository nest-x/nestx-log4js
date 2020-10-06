import { Configuration } from 'log4js';
import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { LOG4JS_LOGGER, LOG4JS_OPTIONS } from './log4js.constants';


export interface Log4jsOptionsFactory {
  createLog4jsOptions(): Log4jsAsyncOptions | Promise<Log4jsOptions>;
}


export interface Log4jsOptions {
  name?: string;

  // TODO file url handling + process.env.LOG4JS_CONFIG filepath handling
  config?: Configuration;
}

export const DEFAULT_LOG4JS_OPTIONS: Log4jsOptions = {
  config: {
    appenders: {
      stdout: {
        type: 'stdout',
        layout: {
          type: 'pattern',
          // log4js default pattern %d{yyyy-MM-dd HH:mm:ss:SSS} [%thread] %-5level %logger{36} - %msg%n
          // we use process id instead thread id
          pattern: '%[[%d{yyyy-MM-dd hh:mm:ss:SSS}][%z][%p][%X{name}]%] - %m%n'
        }
      }
    },
    categories: {
      default: {
        appenders: ['stdout'],
        level: 'debug'
      }
    }
  }

};


export interface Log4jsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  inject?: FactoryProvider['inject'];
  useExisting?: Type<Log4jsOptionsFactory>;
  useClass?: Type<Log4jsOptionsFactory>;
  useFactory?: (...args: any[]) => Log4jsOptions | Promise<Log4jsOptions>;
}

export const isSymbol = (fn: any): fn is symbol => typeof fn === 'symbol';

export const getLog4jsOptionsToken = (name: string | symbol = LOG4JS_OPTIONS): string | symbol => {
  if (name === LOG4JS_OPTIONS) {
    return LOG4JS_OPTIONS;
  }

  if (!isSymbol(name)) {
    return `${name}_LOG4JS_OPTIONS`;
  }

};


export const getLog4jsLoggerToken = (name: string | symbol = LOG4JS_LOGGER): string | symbol => {
  if (name === LOG4JS_LOGGER) {
    return LOG4JS_LOGGER;
  }

  if (!isSymbol(name)) {
    return `${name}_LOG4JS_LOGGER`;
  }
};
