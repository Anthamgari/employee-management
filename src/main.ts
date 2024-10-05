import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Only allow defined DTO properties
    forbidNonWhitelisted: true, // Optionally, throw an error on unknown fields
  }));
  await app.listen(3000);
}
bootstrap();
