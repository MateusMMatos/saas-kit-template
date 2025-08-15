import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, parseEnv } from '@core/index';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // rawBody: true -> mantém o corpo bruto disponível em req.rawBody (útil p/ Stripe)
  const app = await NestFactory.create(AppModule, { cors: true, rawBody: true });

  // Validação global dos DTOs (class-validator)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // remove campos não declarados no DTO
    forbidNonWhitelisted: true,   // 400 se vier campo extra
    transform: true,              // converte tipos (string->number, etc.)
  }));

  const env = parseEnv(process.env);
  await app.listen(env.PORT);
  logger.info({ port: env.PORT }, 'API listening');
}
bootstrap();
