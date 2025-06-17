import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { bootstrapPipes, bootstrapSwagger } from './bootstrap';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.enableShutdownHooks();

  bootstrapSwagger(app);
  bootstrapPipes(app);

  await app.listen(appConfig.port);

  const logger = new Logger('Bootstrap');

  const serverInfo = app.getHttpServer().address();
  logger.log(`Server listening on ${serverInfo.address}:${serverInfo.port}`);
}

bootstrap();
