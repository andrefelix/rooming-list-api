import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { LOG_LEVELS, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LOG_LEVELS,
  });

  const whiteListedCors = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: whiteListedCors,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
