import * as log4js from 'log4js';
import { Test, TestingModule } from '@nestjs/testing';
import { Log4jsModule } from '../log4js.module';
import { Log4jsLogger } from '../log4js.classes';
import { Logger } from '@nestjs/common';
import { LOG4JS_OPTIONS } from '../log4js.constants';
import { getLog4jsLoggerToken, getLog4jsOptionsToken } from '../log4js.options';

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
    unnamedLogger.warn('log using none as category');

    await app.close();
    done();

    done();
  });
});
