import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RabbitmqAppenderModule } from '../rabbitmq-appender.module';

describe("nestx-log4js: rabbitmq-appender", () => {
  const FAKE_AMQP_CONNECTION_URL = ["amqp://devuser:devuser@localhost:5673"];

  let app: INestApplication;

  it("# should load module correctly", async () => {

    const module = await Test.createTestingModule({
      imports: [
        RabbitmqAppenderModule
      ]
    }).compile();
  });
});
