import * as amqp from 'amqp-connection-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RABBITMQ_APPENDER_CONNECTION_TOKEN, RABBITMQ_APPENDER_OPTIONS_TOKEN } from './rabbitmq-appender.constants';
import { RabbitmqAppenderOptions } from './rabbitmq-appender.options';

@Injectable()
export class RabbitmqAppenderProducer {
  constructor(
    @Inject(RABBITMQ_APPENDER_CONNECTION_TOKEN) readonly connectionManager: amqp.AmqpConnectionManager,
    @Inject(RABBITMQ_APPENDER_OPTIONS_TOKEN) readonly options: RabbitmqAppenderOptions
  ) {}




}
