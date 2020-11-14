# `@nestx-log4js/core`

[![NPM](https://img.shields.io/npm/v/@nestx-log4js/core.svg)](https://www.npmjs.com/package/@nestx-log4js/core)
[![Github Workflow Status](https://github.com/nest-x/nestx-log4js/workflows/ci/badge.svg)](https://github.com/nest-x/nestx-log4js)
[![Codecov](https://codecov.io/gh/nest-x/nestx-log4js/branch/master/graph/badge.svg)](https://codecov.io/gh/nest-x/nestx-log4js)

`log4js` as NestJS Module.

<br/>

## Features

- Provide `log4js` wrapper as NestJS Global Module
- Provide `Log4jsLogger` instance for replacement logger usage

<br/>


## Installation

```shell
yarn add @nestx-log4js/core
```

<br/>


## Usage


### Just want to use `log4js`?

> Since logger is a special service in NestJS, we suppose
> import `Log4jsModule` and manual call `app.useLogger(app.get(Log4jsLogger))`


**app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';


@Module({
  imports: [
    Log4jsModule.forRoot()
  ]
})
export class AppModule {}
```

**bootstrap.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import { Log4jsLogger } from '@nestx-log4js/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useLogger(app.get(Log4jsLogger));
  await app.listen(3000);
}
bootstrap();
```

> For more details, you can refer unit tests in source code


### Initial `Log4jsModule` with AsyncOptions (Production Usage)

> You might want to use different appender (e.g. file/dateFile appender)
> in real production usage and initial in your ConfigService/LoggerOnlyConfigService


**app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';

// import your ConfigService/LoggerConfigService

@Module({
  imports: [
    Log4js.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getLog4jsOptions() // config.getLog4jsOptions should return valid Log4jsOptions
    })
  ]
})
export class AppModule {}
```


## Bundled Layout & Appenders

When using `Log4jsModule.forRoot()` and no spec any appenders and layouts,

It will use default below layouts:

```typescript
export const LOG4JS_DEFAULT_LAYOUT = {
  type: 'pattern',
  // log4js default pattern %d{yyyy-MM-dd HH:mm:ss:SSS} [%thread] %-5level %logger{36} - %msg%n
  // we use process id instead thread id
  pattern: '%[%d{yyyy-MM-dd hh:mm:ss:SSS} %p --- [%15.15x{name}]%] %40.40f{3}  : %m',
  tokens: {
    name: (logEvent) => {
      return (logEvent.context && logEvent.context['name']) || '-';
    }
  }
};

export const LOG4JS_NO_COLOUR_DEFAULT_LAYOUT = {
  type: 'pattern',
  // log4js default pattern %d{yyyy-MM-dd HH:mm:ss:SSS} [%thread] %-5level %logger{36} - %msg%n
  // we use process id instead thread id
  pattern: '%d{yyyy-MM-dd hh:mm:ss:SSS} %p --- [%15.15x{name}] %40.40f{3}  : %m',
  tokens: {
    name: (logEvent) => {
      return (logEvent.context && logEvent.context['name']) || '-';
    }
  }
};



export const LOG4JS_DEFAULT_CONFIG: Configuration = {
  appenders: {
    stdout: {
      type: 'stdout',
      layout: LOG4JS_DEFAULT_LAYOUT
    },
    file: {
      type: 'file',
      filename: './logs/application.log',
      maxLogSize: 20 * 1024 * 1024, // maxLogSize use bytes ad unit
      backups: 10,     // default use 5 so 1KB file size total rotating
      layout: LOG4JS_NO_COLOUR_DEFAULT_LAYOUT
    }
  },
  categories: {
    default: {
      enableCallStack: true,
      appenders: ['stdout', 'file'],
      level: 'debug'
    }
  }
};

```

It will use default below layouts (from spring boot default log pattern without process id)

You can refer to [SpringBoot logging features](https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/reference/html/boot-features-logging.html)

```

2020-11-14 15:47:24:486 INFO --- [         NestJS]               core/src/log4js.classes.ts  : log using nestjs as category
2020-11-14 15:47:24:486 INFO --- [              -]               core/src/log4js.classes.ts  : log using none as category
2020-11-14 15:47:24:490 INFO --- [         NestJS]               core/src/log4js.classes.ts  : log using nestjs as category
2020-11-14 15:47:24:490 WARN --- [              -]      src/__tests__/log4js.module.test.ts  : log using none as category

```
