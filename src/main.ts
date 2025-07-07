import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whiteListedCors = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');

  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: whiteListedCors,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
