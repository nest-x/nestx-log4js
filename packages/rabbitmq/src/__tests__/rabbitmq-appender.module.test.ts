import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RabbitmqAppenderModule } from '../rabbitmq-appender.module';

describe('nestx-log4js: rabbitmq-appender', () => {
  const FAKE_AMQP_CONNECTION_URLS = ['amqp://devuser:devuser@localhost:5673'];

  let app: INestApplication;

  it('# should load module correctly', async () => {
    const module = await Test.createTestingModule({
      imports: [
        RabbitmqAppenderModule.register({
          urls: FAKE_AMQP_CONNECTION_URLS
        })
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const rabbitmqAppenderModule = module.get(RabbitmqAppenderModule);
    expect(rabbitmqAppenderModule).toBeInstanceOf(RabbitmqAppenderModule);

    await app.close();
  });

  it('# should load module async correctly', async () => {
    const module = await Test.createTestingModule({
      imports: [
        RabbitmqAppenderModule.forRootAsync({
          useFactory: () => ({
            urls: FAKE_AMQP_CONNECTION_URLS
          })
        })
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const rabbitmqAppenderModule = module.get(RabbitmqAppenderModule);
    expect(rabbitmqAppenderModule).toBeInstanceOf(RabbitmqAppenderModule);

    await app.close();
  });
});
