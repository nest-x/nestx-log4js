import { DynamicModule, Global, Module } from '@nestjs/common';
import { RabbitmqAppenderAsyncOptions, RabbitmqAppenderOptions } from './rabbitmq-appender.options';
import { RABBITMQ_APPENDER_OPTIONS_TOKEN, RABBITMQ_APPENDER_PRODUCER_TOKEN } from './rabbitmq-appender.constants';
import {
  createAsyncRabbitmqAppenderOptions,
  createRabbitmqAppenderConnection,
  createRabbitmqAppenderProducer
} from './rabbitmq-appedner.providers';

@Global()
@Module({})
export class RabbitmqAppenderModule {
  static register(options: RabbitmqAppenderOptions): DynamicModule {
    return {
      module: RabbitmqAppenderModule,
      providers: [
        {
          provide: RABBITMQ_APPENDER_OPTIONS_TOKEN,
          useValue: options
        },
        createRabbitmqAppenderConnection(),
        createRabbitmqAppenderProducer()
      ]
    };
  }

  static forRootAsync(options: RabbitmqAppenderAsyncOptions): DynamicModule {
    return {
      module: RabbitmqAppenderModule,
      imports: options.imports,
      providers: [
        {
          provide: RABBITMQ_APPENDER_OPTIONS_TOKEN,
          useValue: options
        },
        createAsyncRabbitmqAppenderOptions(options),
        createRabbitmqAppenderConnection(),
        createRabbitmqAppenderProducer()
      ],
      exports: [RABBITMQ_APPENDER_PRODUCER_TOKEN]
    };
  }
}
