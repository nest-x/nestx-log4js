import * as amqp from 'amqp-connection-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RABBITMQ_APPENDER_CONNECTION, RABBITMQ_APPENDER_OPTIONS } from './rabbitmq-appender.constants';
import { RabbitmqAppenderOptions } from './rabbitmq-appender.options';

@Injectable()
export class RabbitmqAppenderProducer {
  constructor(
    @Inject(RABBITMQ_APPENDER_CONNECTION) readonly connectionManager: amqp.AmqpConnectionManager,
    @Inject(RABBITMQ_APPENDER_OPTIONS) readonly options: RabbitmqAppenderOptions
  ) {}




}
