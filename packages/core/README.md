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
    Log4js.forRoot()
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
