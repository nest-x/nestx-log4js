import * as log4js from 'log4js';
import { Test, TestingModule } from '@nestjs/testing';
import { Log4jsModule } from '../log4js.module';
import { Log4jsLogger } from '../log4js.classes';
import { Logger } from '@nestjs/common';
import { LOG4JS_OPTIONS } from '../log4js.constants';
import { getLog4jsLoggerToken, getLog4jsOptionsToken } from '../log4js.options';
import { parseNestModuleCallStack } from '../log4js.extentions';

describe('@nestx-log4js module', () => {

  it('# should module define with sync-and-empty options correctly', async (done) => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Log4jsModule.forRoot()
      ]
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const log4jsLogger = app.get(Log4jsLogger);
    expect(log4jsLogger).toBeInstanceOf(Log4jsLogger);

    app.useLogger(log4jsLogger);

    const logger = new Logger('test-log4js');
    logger.log('test logger logging powered by log4js');

    const log4jsModule = module.get(Log4jsModule);
    expect(log4jsModule).toBeInstanceOf(Log4jsModule);

    const log4jsOptions = app.get(LOG4JS_OPTIONS);
    expect(log4jsOptions).toBeDefined();

    await app.close();
    done();

  });

  it('# should module define with sync options correctly', async (done) => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Log4jsModule.forRoot({
          config: {
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
          }
        })
      ]
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const log4jsLogger = app.get(Log4jsLogger);
    expect(log4jsLogger).toBeInstanceOf(Log4jsLogger);

    app.useLogger(log4jsLogger);

    const logger = new Logger('test-log4js-for-root');
    logger.log('test logger logging powered by log4js');

    const log4jsModule = module.get(Log4jsModule);
    expect(log4jsModule).toBeInstanceOf(Log4jsModule);

    await app.close();

    done();
  });

  it('# should module defined with async options', async (done) => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Log4jsModule.forRootAsync({
          inject: [],
          useFactory: () => ({
            config: {
              appenders: {
                out: {
                  type: 'file',
                  filename: './logs/log-via-config-async.log'
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
            }
          })
        })
      ]
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const log4jsLogger = app.get(Log4jsLogger);
    expect(log4jsLogger).toBeInstanceOf(Log4jsLogger);

    app.useLogger(log4jsLogger);

    const logger = new Logger('test-log4js-for-root-async');
    logger.verbose('test logger logging powered by log4js');
    logger.debug('test logger logging powered by log4js');
    logger.log('test logger logging powered by log4js');
    logger.warn('test logger logging powered by log4js');
    logger.error('test logger logging powered by log4js');

    const log4jsModule = module.get(Log4jsModule);
    expect(log4jsModule).toBeInstanceOf(Log4jsModule);

    await app.close();

    done();

    done();
  });

  it('# should module defined with spec name', async (done) => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Log4jsModule.forRoot({
          name: 'app',
          config: {
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
          }
        })
      ]
    }).compile();


    const app = module.createNestApplication();
    await app.init();
    const log4jsLogger = app.get(Log4jsLogger);
    const log4jsAliasLogger = app.get(getLog4jsLoggerToken('app'));
    expect(log4jsLogger).toBeInstanceOf(Log4jsLogger);
    expect(log4jsLogger).toEqual(log4jsAliasLogger);

    const log4jsOptions = app.get(getLog4jsOptionsToken('app'));
    expect(log4jsOptions).toBeDefined();

    const log4jsModule = module.get(Log4jsModule);
    expect(log4jsModule).toBeInstanceOf(Log4jsModule);

    await app.close();


    done();
  });


  it('# should use nestjs context display as category field', async (done) => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Log4jsModule.forRoot()
      ]
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const log4jsLogger = app.get(Log4jsLogger);
    expect(log4jsLogger).toBeInstanceOf(Log4jsLogger);

    app.useLogger(log4jsLogger);

    const logger = new Logger('NestJS');
    logger.log('log using nestjs as category');

    const unnamedLogger = new Logger();
    unnamedLogger.log('log using none as category');

    await app.close();
    done();
  });

  it('# should support undefined context', async (done) => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Log4jsModule.forRoot()
      ]
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const log4jsLogger = app.get(Log4jsLogger);
    expect(log4jsLogger).toBeInstanceOf(Log4jsLogger);

    app.useLogger(log4jsLogger);

    const logger = new Logger('NestJS');
    logger.log('log using nestjs as category');

    const unnamedLogger = log4js.getLogger();
    unnamedLogger.debug('log using none as category');

    await app.close();
    done();

  });


  it('# should support file depth in callstack parsing', async (done) => {

    const data = {
      stack: 'Error: \n' +
        '    at Logger._log (/ci/workspace/nestx-log4js/packages/core/node_modules/log4js/lib/logger.js:88:48)\n' +
        '    at Logger.log (/ci/workspace/nestx-log4js/packages/core/node_modules/log4js/lib/logger.js:73:12)\n' +
        '    at Logger.<computed> [as info] (/ci/workspace/nestx-log4js/packages/core/node_modules/log4js/lib/logger.js:124:10)\n' +
        '    at Log4jsLogger.log (/ci/workspace/nestx-log4js/packages/core/src/log4js.classes.ts:34:17)\n' +
        '    at Logger.callFunction (/ci/workspace/nestx-log4js/packages/core/node_modules/@nestjs/common/services/logger.service.js:69:18)\n' +
        '    at Logger.log (/ci/workspace/nestx-log4js/packages/core/node_modules/@nestjs/common/services/logger.service.js:25:14)\n' +
        '    at /ci/workspace/nestx-log4js/packages/core/src/__tests__/log4js.module.test.ts:258:12\n' +
        '    at Generator.next (<anonymous>)\n' +
        '    at fulfilled (/ci/workspace/nestx-log4js/packages/core/src/__tests__/log4js.module.test.ts:5:58)'
    };


    const { fileName } = parseNestModuleCallStack(data);

    expect(fileName).toEqual('/ci/workspace/nestx-log4js/packages/core/src/__tests__/log4js.module.test.ts');


    const customStackLineResult = parseNestModuleCallStack(data, 4);

    expect(customStackLineResult.fileName).toEqual('/ci/workspace/nestx-log4js/packages/core/src/log4js.classes.ts');

    done();
  });
});
