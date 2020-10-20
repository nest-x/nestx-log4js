/**
 * @desc this is not a nest module test.
 *       only calling log4js and complete typings
 **/

import * as log4js from 'log4js';
import { Configuration, LoggingEvent } from 'log4js';


describe('log4js usage', () => {


  afterEach(async (done) => {
    // waiting for log4js worker process shutdown
    // we should support graceful shutdown in nestjs/cloud-native project
    log4js.shutdown(() => {
      done();
    });
  });


  it('# sample usage', () => {
    const logger = log4js.getLogger();

    logger.level = 'debug';
    logger.debug('print from default logger');
  });


  describe('log4js configuration', () => {

    it('# should load configuration via config object', () => {

      const config: Configuration = {
        appenders: {
          out: {
            type: 'file',
            filename: './logs/log-via-config.log'
          },
          console: {
            type: 'stdout'
          }
        },
        categories: {
          default: {
            appenders: [
              'out',
              'console'
            ],
            level: 'info'
          },
          debug: {
            appenders: [
              'out',
              'console'
            ],
            level: 'debug'
          }
        }
      };

      log4js.configure(config);

      const logger = log4js.getLogger();
      logger.info('print from default logger (via configuration)');

      const debugLogger = log4js.getLogger('debug');
      debugLogger.debug('print from debug logger (via configuration)');
    });

  });

  describe('log4js layout', () => {

    it('# should print with pattern layout', () => {
      const config: Configuration = {
        appenders: {
          out: {
            type: 'stdout',
            layout: {
              type: 'pattern',
              pattern: '%d %p %c %x{user} %m%n',
              tokens: {
                user: () => {
                  return 'alice';
                }
              }
            }
          }
        },
        categories: {
          default: {
            appenders: [
              'out'
            ],
            level: 'debug'
          }
        }
      };

      log4js.configure(config);
      const logger = log4js.getLogger();

      logger.debug('print from debug logger (via layout)');
    });

    it('# should print with custom layout', () => {

      const config: Configuration = {
        appenders: {
          out: {
            type: 'stdout',
            layout: {
              type: 'json'
            }
          }
        },
        categories: {
          default: {
            appenders: [
              'out'
            ],
            level: 'debug'
          }
        }
      };

      log4js.addLayout('json', () =>
        (logEvent: LoggingEvent) => {
          return JSON.stringify(logEvent);
        }
      );
      log4js.configure(config);
      const logger = log4js.getLogger();

      logger.info('print from debug logger (via layout:json)');
    });

    it('# should print with custom layout + context', () => {
      const config: Configuration = {
        appenders: {
          out: {
            type: 'stdout',
            layout: {
              type: 'json-with-context'
            }
          }
        },
        categories: {
          default: {
            appenders: [
              'out'
            ],
            level: 'debug'
          }
        }
      };

      log4js.addLayout('json-with-context', () =>
        (logEvent: LoggingEvent) => {
          const optimizeLogEvent = {
            ip: logEvent.context.ip,
            '@timestamp': logEvent.startTime.getTime(),
            category: logEvent.categoryName,
            level: logEvent.level.levelStr,
            data: logEvent.data
          };
          return JSON.stringify(optimizeLogEvent);
        }
      );
      log4js.configure(config);
      const logger = log4js.getLogger();

      // most time we should add ip, env, some..other object
      logger.addContext('ip', '127.0.0.1');

      logger.info('print from debug logger (via layout:json-with-context)');

    });
  });


  describe('log4js file rotation', () => {

    it('# should enable file rotation via config', () => {
      const config: Configuration = {
        appenders: {
          out: {
            type: 'stdout'
          },
          file: {
            type: 'file',
            filename: './logs/log-with-json-context.log',
            maxLogSize: 200, // maxLogSize use bytes ad unit
            backups: 10,     // default use 5 so 1KB file size total rotating
            layout: {
              type: 'json-context'
            }
          }
        },
        categories: {
          default: {
            appenders: [
              'out',
              'file'
            ],
            level: 'debug'
          }
        }
      };

      log4js.addLayout('json-context', () =>
        (logEvent: LoggingEvent) => {
          const optimizeLogEvent = {
            ip: logEvent.context.ip,
            '@timestamp': logEvent.startTime.getTime(),
            category: logEvent.categoryName,
            level: logEvent.level.levelStr,
            data: logEvent.data
          };
          return JSON.stringify(optimizeLogEvent);
        }
      );
      log4js.configure(config);
      const logger = log4js.getLogger();

      // most time we should add ip, env, some..other object
      logger.addContext('ip', '127.0.0.1');

      logger.info('print from debug logger (via layout:json-context)');

    });
  });

});
