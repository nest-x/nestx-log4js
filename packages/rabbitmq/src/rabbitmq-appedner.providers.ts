import * as amqp from 'amqp-connection-manager';
import {
  RABBITMQ_APPENDER_CONNECTION_TOKEN,
  RABBITMQ_APPENDER_OPTIONS_TOKEN,
  RABBITMQ_APPENDER_PRODUCER_TOKEN
} from './rabbitmq-appender.constants';
import { RabbitmqAppenderAsyncOptions, RabbitmqAppenderOptions } from './rabbitmq-appender.options';
import { RabbitmqAppenderProducer } from './rabbitmq-appender.producer';

export const createRabbitmqAppenderConnection = () => ({
  provide: RABBITMQ_APPENDER_CONNECTION_TOKEN,
  inject: [RABBITMQ_APPENDER_OPTIONS_TOKEN],
  useFactory: async (args: RabbitmqAppenderOptions) => {
    return amqp.connect(args.urls, args.options);
  }
});

export const createRabbitmqAppenderProducer = () => ({
  provide: RABBITMQ_APPENDER_PRODUCER_TOKEN,
  inject: [RABBITMQ_APPENDER_CONNECTION_TOKEN, RABBITMQ_APPENDER_OPTIONS_TOKEN],
  useFactory: (connection: amqp.AmqpConnectionManager, options: RabbitmqAppenderOptions) => {
    return new RabbitmqAppenderProducer(connection, options);
  }
});

export const createAsyncRabbitmqAppenderOptions = (options: RabbitmqAppenderAsyncOptions) => ({
  provide: RABBITMQ_APPENDER_OPTIONS_TOKEN,
  inject: options.inject,
  useFactory: options.useFactory
});
