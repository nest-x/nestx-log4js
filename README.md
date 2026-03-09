# nestx-log4js

[![CI](https://github.com/nest-x/nestx-log4js/actions/workflows/ci.yml/badge.svg)](https://github.com/nest-x/nestx-log4js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@nestx-log4js/core)](https://www.npmjs.com/package/@nestx-log4js/core)
[![npm provenance](https://img.shields.io/badge/npm-provenance-green)](https://www.npmjs.com/package/@nestx-log4js/core)

`log4js` as a NestJS module.

## Compatibility

| Version | NestJS     |
| ------- | ---------- |
| 2.x     | 10.x, 11.x |
| 1.x     | 7.x – 9.x  |

## Installation

```shell
npm install @nestx-log4js/core
# or
pnpm add @nestx-log4js/core
```

## Usage

### Basic

Import `Log4jsModule` and replace the default NestJS logger:

**app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';

@Module({
  imports: [Log4jsModule.forRoot()],
})
export class AppModule {}
```

**main.ts**

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

### Async Configuration (Recommended for Production)

```typescript
import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';
import { ConfigService } from './config.service';

@Module({
  imports: [
    Log4jsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          appenders: {
            stdout: { type: 'stdout' },
            file: {
              type: 'file',
              filename: './logs/app.log',
              maxLogSize: 20 * 1024 * 1024,
              backups: 10,
            },
          },
          categories: {
            default: {
              enableCallStack: true,
              appenders: ['stdout', 'file'],
              level: 'info',
            },
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

## Default Log Format

When using `Log4jsModule.forRoot()` without custom config, the output follows a Spring Boot–style pattern:

```
2026-03-09 15:47:24:486 INFO --- [         NestJS]  core/src/log4js.classes.ts  : log message here
```

**Grok pattern** for log parsing (Filebeat, Logstash, etc.):

```
%{TIMESTAMP_ISO8601:server_time}\s*%{LOGLEVEL:level}\s*---\s*\[\s*%{NOTSPACE:context}\]\s*%{NOTSPACE:file_path}\s*:\s*%{GREEDYDATA:content}
```

## License

MIT
