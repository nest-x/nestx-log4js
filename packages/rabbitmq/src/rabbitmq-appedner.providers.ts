import * as amqp from 'amqp-connection-manager';
import {
  RABBITMQ_APPENDER_CONNECTION,
  RABBITMQ_APPENDER_OPTIONS,
  RABBITMQ_APPENDER_PRODUCER
} from './rabbitmq-appender.constants';
import { RabbitmqAppenderOptions } from './rabbitmq-appender.options';
import { RabbitmqAppenderProducer } from './rabbitmq-appender.producer';

export const createRabbitmqAppenderConnection = () => ({
  provide: RABBITMQ_APPENDER_CONNECTION,
  inject: [RABBITMQ_APPENDER_OPTIONS],
  useFactory: async (args: RabbitmqAppenderOptions) => {
    return amqp.connect(args.urls, args.options);
  }
});

export const createRabbitmqAppenderProducer = () => ({
  provide: RABBITMQ_APPENDER_PRODUCER,
  inject: [RABBITMQ_APPENDER_CONNECTION, RABBITMQ_APPENDER_OPTIONS],
  useFactory: (connection: amqp.AmqpConnectionManager, options: RabbitmqAppenderOptions) => {
    return new RabbitmqAppenderProducer(connection, options);
  }
});

export const createAsyncRabbitmqAppenderOptions = () => ({

});
