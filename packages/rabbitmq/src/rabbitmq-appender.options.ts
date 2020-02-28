import * as amqp from 'amqp-connection-manager';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Layout } from 'log4js';

export type RabbitmqConnectionURLString = string;

export interface RabbitmqConnectionOptions {
  urls: RabbitmqConnectionURLString[];
  options?: amqp.AmqpConnectionManagerOptions;
}

export interface RabbitmqChannelOptions {
  exchange?: string;
  routingKey?: string;
  queue?: string;
}

export interface RabbitmqLoggerOptions {
  type?: '@nestx-log4js/rabbitmq';
  layout?: Layout;
}

export type RabbitmqAppenderOptions = RabbitmqConnectionOptions & RabbitmqChannelOptions & RabbitmqLoggerOptions;

export interface RabbitmqAppenderAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args) => RabbitmqAppenderOptions | Promise<RabbitmqAppenderOptions>;
}
